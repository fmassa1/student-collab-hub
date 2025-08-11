const db = require('../db');

async function getAllProjects() {
  const [rows] = await db.query(`
    SELECT 
      projects.*,
      GROUP_CONCAT(project_tags.tag) AS tags
    FROM projects
    LEFT JOIN project_tags ON projects.id = project_tags.project_id
    GROUP BY projects.id;
  `);

  return rows.map(row => ({
    ...row,
    tags: row.tags ? row.tags.split(',') : []
  }));
}


module.exports = {
    getAllProjects,
  };