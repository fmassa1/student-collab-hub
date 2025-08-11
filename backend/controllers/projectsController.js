const projectsModel = require('../models/projectsModel');


async function getAllProjects(req, res) {
    try {
        const projects = await projectsModel.getAllProjects();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = {
    getAllProjects,
};