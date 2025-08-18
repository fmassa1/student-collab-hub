const db = require('../db');

async function getAllProjects() {
  const [rows] = await db.query(`
    SELECT *
    FROM projects
  `);
  return rows;
}

async function getProjectById(id) {
  const [rows] = await db.query(`
    SELECT 
      projects.*,
      users.username, 
      GROUP_CONCAT(DISTINCT project_tags.tag) AS tags,
      GROUP_CONCAT(DISTINCT project_likes.user_id) AS liked_by
    FROM projects
    LEFT JOIN users ON projects.user_id = users.id
    LEFT JOIN project_tags ON projects.id = project_tags.project_id
    LEFT JOIN project_likes ON projects.id = project_likes.project_id
    WHERE projects.id = ?
    GROUP BY projects.id
  `, [id]
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
    postProject,
    likeProject,
    unlikeProject
  };