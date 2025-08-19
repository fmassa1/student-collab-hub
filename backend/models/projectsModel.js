const db = require('../db');

async function getAllProjects() {
  const [rows] = await db.query(`
    SELECT *
    FROM projects
  `);
  return rows;
}

async function getProjectById(id) {
  const [project] = await db.query(`SELECT projects.*, users.username FROM projects 
    JOIN users ON projects.user_id = users.id 
    WHERE projects.id = ?`, [id]);

  const [tags] = await db.query(`SELECT tag FROM project_tags WHERE project_id = ?`, [id]);
  const [likes] = await db.query(`SELECT user_id FROM project_likes WHERE project_id = ?`, [id]);
  const [comments] = await db.query(`
    SELECT project_comments.id, project_comments.comment, users.username
    FROM project_comments 
    JOIN users ON project_comments.user_id = users.id 
    WHERE project_comments.project_id = ?`, 
  [id]);

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

module.exports = {
    getAllProjects,
    getProjectById,
    getProjectsByUsername,
    postProject,
    likeProject,
    unlikeProject
  };