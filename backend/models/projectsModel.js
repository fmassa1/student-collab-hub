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
      GROUP_CONCAT(project_tags.tag) AS tags
    FROM projects
    LEFT JOIN project_tags ON projects.id = project_tags.project_id
    WHERE projects.id = ?
    GROUP BY projects.id
  `, [id]
  );

  return rows.map(row => ({
    ...row,
    tags: row.tags ? row.tags.split(',') : []
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



module.exports = {
    getAllProjects,
    getProjectById,
    postProject,
  };