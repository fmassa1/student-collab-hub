const projectsModule = require('../Modules/projectsModule');
const projectTags = require('../data/projectTags.json');


async function getAllProjects(req, res) {
    try {
        const { tags, sort = "date_posted", order = "desc" } = req.query;

        const validSorts = {
            views: "views",
            likes: "likes",
            date_posted: "date_posted"
        };

        const validOrders = {
            desc: "desc",
            asc: "asc",
        };
        const sortOrder = validOrders[order] || "desc";
        const sortColumn = validSorts[sort] || "date_posted";

        if (tags) {
            const tagList = tags.split(",").map(Number);

            const tagLabels = projectTags
                .filter(tag => tagList.includes(tag.id))
                .map(tag => tag.label);

            const projects = await projectsModule.getProjectsByTags(tagLabels);
            return res.json(projects);

        }

        const projects = await projectsModule.getAllProjects(sortColumn, sortOrder);
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function getProjectById(req, res) {
    try {
        const user_id = req.user.id; 
        const project_id = req.params.id;

        const project = await projectsModule.getProjectById(project_id, user_id);
        if(!project.id) {
            return res.status(404).json({ error: 'Project not found' });
        }
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
        const { name, description, github_url, tags } = req.body;

        const tagLabels = projectTags
            .filter(tag => tags.includes(tag.id))
            .map(tag => tag.label);
        
        const project = await projectsModule.postProject({
            name,
            description,
            github_url,
            tags: tagLabels,
            user_id,
        }); 
        res.status(201).json(project);

    } catch (err) {
        console.error('Error posting project: ', err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function uploadImagesHandler(req, res) {
    try {
        const project_id = req.params.project_id;
        const filenames = req.files.map(file => file.filename);
        await projectsModule.postProjectPictures(project_id, filenames);
        res.json({ images: filenames });
    } catch (err){
        console.error(err);
        res.status(500).json({ error: 'Database error uploadingImages' });
    }

}

async function updateProjectHandler(req, res) {
    try {

        const user_id = req.user.id;
        const project_id = req.params.id;
        const { name, description, tags } = req.body;

        const tagLabels = projectTags
            .filter(tag => tags.includes(tag.id))
            .map(tag => tag.label);

        const updated_project = await projectsModule.updateProject(user_id, project_id, name, description, tagLabels);
        res.json(updated_project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error getAllUsers' });
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

async function likeCommentOnProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const comment_id = req.params.comment_id;
        const project_id = req.params.project_id;
        const likedComment = await projectsModule.likeCommentOnProject(user_id, comment_id, project_id);

        res.status(201).json(likedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

async function unlikeCommentOnProjectHandler(req, res) {
    try {
        const user_id = req.user.id;         
        const comment_id = req.params.comment_id;
        const unlikedComment = await projectsModule.unlikeCommentOnProject(user_id, comment_id);
        res.status(201).json(unlikedComment);
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
    uploadImagesHandler,
    updateProjectHandler,
    deleteProjectHandler,
    likeProjectHandler,
    unlikeProjectHandler,
    postCommentOnProjectHandler,
    deleteCommentOnProjectHandler,
    likeCommentOnProjectHandler,
    unlikeCommentOnProjectHandler
};