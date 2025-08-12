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

async function getProjectById(req, res) {
    try {
        const id = req.params.id;
        const project = await projectsModel.getProjectById(id);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function postProject(req, res) {
    try {
        const { name, description, image_url, linkedin_url, github_url, tags } = req.body;
        
        const project = await projectsModel.postProject({
            name,
            description,
            image_url,
            linkedin_url,
            github_url,
            tags
        });    

        res.status(201).json(project);

    } catch (err) {
        console.error('Error posting project: ', err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = {
    getAllProjects,
    getProjectById,
    postProject,
};