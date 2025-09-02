const db = require('../db');

async function getAllProjects() {
  const [rows] = await db.query(`
    SELECT *
    FROM projects
  `);
  return rows;
}

async function getProjectsByTags(tags) {
  const placeholders = tags.map(() => "?").join(","); 
  const [rows] = await db.query(
    `SELECT DISTINCT p.* 
     FROM projects p
     JOIN project_tags pt ON p.id = pt.project_id
     WHERE LOWER(pt.tag) IN (${placeholders})`,
    tags.map(t => t.toLowerCase())
  );
  return rows;
}

async function getProjectById(project_id, user_id) {
  const [project] = await db.query(`SELECT projects.*, users.username FROM projects 
    JOIN users ON projects.user_id = users.id 
    WHERE projects.id = ?`, [project_id]);
  const [tags] = await db.query(`SELECT tag FROM project_tags WHERE project_id = ?`, [project_id]);
  const [likes] = await db.query(`SELECT user_id FROM project_likes WHERE project_id = ?`, [project_id]);
  const [comments] = await db.query(`
    SELECT project_comments.id, project_comments.comment, users.username
    FROM project_comments 
    JOIN users ON project_comments.user_id = users.id 
    WHERE project_comments.project_id = ?`, 
  [project_id]);



  return {
    ...project[0],
    tags: tags.map(t => t.tag),
    liked_by: likes.map(l => l.user_id),
    comments
  };
}

async function getProjectsByUsername(username) {
  const [rows] = await db.query(`
    SELECT projects.*
    FROM projects
    LEFT JOIN users ON users.id = projects.user_id
    WHERE users.username = ?

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
  


  return getProjectById(project_id);
}

async function deleteProject(user_id, project_id) {
  const [result] = await db.query(
    `DELETE FROM projects  WHERE user_id = ? AND id = ?`,
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

  return {success: true, user_id, project_id };
}

async function unlikeProject(user_id, project_id) {
  const [result] = await db.query(
    `DELETE FROM project_likes  WHERE user_id = ? AND project_id = ?`,
    [user_id, project_id]
  );

  return { success: result.affectedRows > 0, user_id, project_id };
}

async function postCommentOnProject(user_id, project_id, comment) {
  const [result] = await db.query(
    `INSERT INTO project_comments (project_id, user_id, comment)
     VALUES (?, ?, ?)`,
    [project_id, user_id, comment]
  );

  const [rows] = await db.query(
    `SELECT pc.id, pc.comment, u.username
     FROM project_comments pc
     JOIN users u ON pc.user_id = u.id
     WHERE pc.id = ?`,
    [result.insertId]
  );

  return rows[0]; 
}

async function deleteCommentOnProject(user_id, project_id, comment_id) {
  const [result] = await db.query(
    `DELETE FROM project_comments  WHERE user_id = ? AND project_id = ? AND id = ?`,
    [user_id, project_id, comment_id]
  );

  return { success: result.affectedRows > 0, user_id, project_id, comment_id };
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
    deleteCommentOnProject
  };