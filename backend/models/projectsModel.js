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



module.exports = {
    getAllProjects,
    getProjectById,
  };