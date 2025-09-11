const db = require('../db');

async function getAllProjects(sortColumn, sortOrder) {
  const order = sortOrder === "desc" ? "DESC" : "ASC";
  const [rows] = await db.query(`
    SELECT p.*, COUNT(DISTINCT pl.user_id) AS likes, COUNT(DISTINCT pv.user_id) AS views
    FROM projects p
    LEFT JOIN project_likes pl ON p.id = pl.project_id
    LEFT JOIN project_views pv ON p.id = pv.project_id
    WHERE p.deleted = false
    GROUP BY p.id
    ORDER BY ${sortColumn} ${order}
  `);
  return rows;
}

async function getProjectsByTags(tags) {
  const placeholders = tags.map(() => "?").join(",");
  const [rows] = await db.query(
    `
    SELECT p.*
    FROM projects p
    JOIN project_tags pt ON p.id = pt.project_id
    WHERE LOWER(pt.tag) IN (${placeholders}) AND p.deleted = false
    GROUP BY p.id
    HAVING COUNT(DISTINCT LOWER(pt.tag)) = ?
    `,
    [...tags.map(t => t.toLowerCase()), tags.length]
  );
  return rows;
}

async function getProjectById(project_id, user_id) {
  const [project] = await db.query(`
    SELECT projects.*, users.username 
    FROM projects 
    JOIN users ON projects.user_id = users.id 
    WHERE projects.id = ? AND projects.deleted = false`, [project_id]);

  
  if(project.length >= 1) {
    projectViewed(user_id, project_id);
  }
  const [tags] = await db.query(`SELECT tag FROM project_tags WHERE project_id = ?`, [project_id]);
  const [likes] = await db.query(`SELECT user_id FROM project_likes WHERE project_id = ?`, [project_id]);
  const [comments] = await db.query(`
    SELECT pc.id, pc.comment, pc.date_posted, COUNT(DISTINCT pcl.user_id) as likes, MAX(pcl.user_id = ?) AS liked_by_user, u.username
    FROM project_comments pc
    LEFT JOIN users u ON pc.user_id = u.id 
    LEFT JOIN project_comment_likes pcl ON pc.id = pcl.comment_id 
    WHERE pc.project_id = ? AND pc.deleted = false
    GROUP BY pc.id, pc.comment, pc.date_posted, u.username`, 
  [user_id, project_id]);
  const [views] = await db.query(`SELECT * FROM project_views WHERE project_id = ?`, [project_id]);

  return {
    ...project[0],
    tags: tags.map(t => t.tag),
    liked_by: likes.map(l => l.user_id),
    comments,
    views: views.length
  };
}

async function getProjectsByUsername(username) {
  const [rows] = await db.query(`
    SELECT projects.*
    FROM projects
    LEFT JOIN users ON users.id = projects.user_id
    WHERE users.username = ? AND projects.deleted = false

  `, [username]
  );

  return rows.map(row => ({
    ...row,
    tags: row.tags ? row.tags.split(',') : [],
    liked_by: row.liked_by ? row.liked_by.split(',').map(id => parseInt(id)) : []
  }));
}

async function postProject(project) {
  const [result] = await db.query(
    `INSERT INTO projects (name, description, image_url, linkedin_url, github_url, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [project.name, project.description, project.image_url, project.linkedin_url, project.github_url, project.user_id]
  );

  if (Array.isArray(project.tags) && project.tags.length > 0) {
    const tagValues = project.tags.map(tag => [result.insertId, tag]);
    await db.query(
        `INSERT INTO project_tags (project_id, tag) VALUES ?`,
        [tagValues]
    );
  }

  return { id: result.insertId, ...project };
}

async function updateProject(user_id, project_id, name, description, tags) {
  const [updated] = await db.query(`
      UPDATE projects
      SET name = ?, description = ?
      WHERE id = ? AND user_id = ?
  `, [name, description, project_id, user_id]
  );

  //might be better way to update tags
  if (Array.isArray(tags) && tags.length > 0) {

    const [tag_delete_result] = await db.query(
      `DELETE FROM project_tags WHERE project_id = ?`,
      [project_id]
    );

    const tagValues = tags.map(tag => [project_id, tag]);
    await db.query(
        `INSERT INTO project_tags (project_id, tag) VALUES ?`,
        [tagValues]
    );
  }
  
  return getProjectById(project_id, user_id);
}

async function deleteProject(user_id, project_id) {
  const [result] = await db.query(
    `UPDATE projects set deleted = TRUE WHERE user_id = ? AND id = ?`,
    [user_id, project_id]
  );

  return { success: result.affectedRows > 0, user_id, project_id };
}

async function likeProject(user_id, project_id) {
  const [result] = await db.query(
    `INSERT INTO project_likes (user_id, project_id)
     VALUES (?, ?)`,
    [user_id, project_id]
  );

  const [user] = await db.query(`
    SELECT user_id
    FROM projects
    WHERE id = ?
  `, [project_id]);

  //if user likes their own project don't add a notifcation
  if(user_id != user[0].user_id) {
    addNotification(project_id, user_id, user[0].user_id, "project like");
  }

  return {success: true, user_id, project_id };
}

async function unlikeProject(user_id, project_id) {
  const [result] = await db.query(
    `DELETE FROM project_likes  WHERE user_id = ? AND project_id = ?`,
    [user_id, project_id]
  );

  const [notification] = await db.query(
    `SELECT id
     FROM notifications
     WHERE from_user_id = ? AND project_id = ? AND type = ?
    `, [user_id, project_id, "project like"]
  );
  if(notification[0]) {
    removeNotification(notification[0].id);
  }

  return { success: result.affectedRows > 0, user_id, project_id };
}

async function postCommentOnProject(user_id, project_id, comment) {
  const [result] = await db.query(
    `INSERT INTO project_comments (project_id, user_id, comment)
     VALUES (?, ?, ?)`,
    [project_id, user_id, comment]
  );
  const [rows] = await db.query(`
    SELECT pc.id, pc.comment, pc.date_posted, COUNT(DISTINCT pcl.user_id) as likes, MAX(pcl.user_id = ?) AS liked_by_user, u.username
    FROM project_comments pc
    LEFT JOIN users u ON pc.user_id = u.id 
    LEFT JOIN project_comment_likes pcl ON pc.id = pcl.comment_id 
    WHERE pc.project_id = ?
    GROUP BY pc.id, pc.comment, pc.date_posted, u.username`, 
  [user_id, project_id]);

  const newComment = rows[rows.length - 1];

  const [user] = await db.query(`
    SELECT user_id
    FROM projects
    WHERE id = ?
  `, [project_id]);

  //if user comments on their own project don't add a notifcation
  if(user_id != user[0].user_id) {
    addNotification(project_id, user_id, user[0].user_id, "comment", newComment.id);
  }

  return newComment; 
}

async function deleteCommentOnProject(user_id, project_id, comment_id) {
  const [result] = await db.query(
    `UPDATE project_comments 
     SET deleted = TRUE 
     WHERE user_id = ? AND project_id = ? AND id = ?`,
    [user_id, project_id, comment_id]
  );

  const [notification] = await db.query(
    `SELECT id
     FROM notifications
     WHERE from_user_id = ? AND comment_id = ? AND type = ?
    `, [user_id, comment_id, "comment"]
  );
  if(notification[0]) {
    removeNotification(notification[0].id);
  }

  return { success: result.affectedRows > 0, user_id, project_id, comment_id };
}

async function likeCommentOnProject(user_id, comment_id, project_id) {
  const [result] = await db.query(
    `INSERT INTO project_comment_likes (comment_id, user_id)
     VALUES (?, ?)`,
    [comment_id, user_id]
  );
  const [user] = await db.query(`
    SELECT user_id
    FROM project_comments
    WHERE id = ?
  `, [comment_id]);

  //if user likes their own comment don't add a notifcation
  if(user_id != user[0].user_id) {
    addNotification(project_id, user_id, user[0].user_id, "comment like", comment_id);
  }
  return {success: true, comment_id, user_id};
}

async function unlikeCommentOnProject(user_id, comment_id) {
  const [result] = await db.query(
    `DELETE FROM project_comment_likes  WHERE comment_id = ? AND user_id = ?`,
    [comment_id, user_id]
  );

  const [notification] = await db.query(
    `SELECT id
     FROM notifications
     WHERE from_user_id = ? AND comment_id = ? AND type = ?
    `, [user_id, comment_id, "comment like"]
  );
  if(notification[0]) {
    removeNotification(notification[0].id);
  }

  return { success: result.affectedRows > 0, comment_id, user_id };
}


async function projectViewed(user_id, project_id) {
  const [viewed] = await db.query(
    `SELECT * 
     FROM project_views
     WHERE project_id = ? AND user_id = ?
    `, [project_id, user_id]);


  if(viewed.length === 0) {
    const [results] = await db.query(
      `INSERT INTO project_views (project_id, user_id)
       VALUES (?, ?)`,
      [project_id, user_id]);
  }
}

async function addNotification(project_id, from_user_id, to_user_id, type, comment_id = null) {
  const [result] = await db.query(
    `INSERT INTO notifications (project_id, user_id, from_user_id, type, comment_id)
     VALUES (?, ?, ?, ?, ?)`,
    [project_id, to_user_id, from_user_id, type, comment_id]
  );
  return {success: true, project_id, to_user_id, from_user_id,  type, comment_id};
}

async function removeNotification(notification_id) {
  const [result] = await db.query(
    `DELETE FROM notifications
     WHERE id = ?`,
    [notification_id]
  );
  return {success: true, notification_id};
}


module.exports = {
    getAllProjects,
    getProjectsByTags,
    getProjectById,
    getProjectsByUsername,
    postProject,
    updateProject,
    deleteProject,
    likeProject,
    unlikeProject,
    postCommentOnProject,
    deleteCommentOnProject,
    likeCommentOnProject,
    unlikeCommentOnProject
  };