const projectsModule = require('../Modules/projectsModule');


async function getAllProjects(req, res) {
    try {
        const projects = await projectsModule.getAllProjects();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function getProjectById(req, res) {
    try {
        const id = req.params.id;
        const project = await projectsModule.getProjectById(id);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function getProjectsByUsername(req, res) {
    try {
        const username = req.params.username;
        const projects = await projectsModule.getProjectsByUsername(username);
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function postProject(req, res) {
    try {
        const user_id = req.user.id;         
        const { name, description, image_url, linkedin_url, github_url, tags } = req.body;
        
        const project = await projectsModule.postProject({
            name,
            description,
            image_url,
            linkedin_url,
            github_url,
            tags,
            user_id
        });    

        res.status(201).json(project);

    } catch (err) {
        console.error('Error posting project: ', err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function deleteProjectHandler(req, res) {
    try {
        const user_id = req.user.id;
        const project_id = req.params.id;
        const deleted = await projectsModule.deleteProject(user_id, project_id);
        if (!deleted) {
            return res.status(403).json({ error: 'You cannot delete this project' });
        }
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}


async function likeProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const project_id = req.params.project_id;
        const project = await projectsModule.likeProject(user_id, project_id);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function unlikeProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const project_id = req.params.project_id;
        const project = await projectsModule.unlikeProject(user_id, project_id);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}


async function postCommentOnProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const project_id = req.params.project_id;
        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        const newComment = await projectsModule.postCommentOnProject(user_id, project_id, comment);

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function deleteCommentOnProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const comment_id = req.params.comment_id;
        const project_id = req.params.project_id;
        const deleted = await projectsModule.deleteCommentOnProject(user_id, project_id, comment_id);

        if (!deleted) {
            return res.status(403).json({ error: 'You cannot delete this comment' });
        }
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = {
    getAllProjects,
    getProjectById,
    getProjectsByUsername,
    postProject,
    deleteProjectHandler,
    likeProjectHandler,
    unlikeProjectHandler,
    postCommentOnProjectHandler,
    deleteCommentOnProjectHandler
};