const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require("helmet");

const projectsController = require('./controllers/projectsController');
const usersController = require('./controllers/usersController');
const requestLogger = require('./middleware/logger');
const requestLimiter = require('./middleware/limiter');
const authenticator = require('./middleware/authenticator');
const { createUploader } = require("./middleware/uploader");




require('dotenv').config();

const app = express();

app.set('trust proxy', false);


app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "data:", "https://placehold.co"],
    },
  },
}));

app.use(requestLogger);
app.use(requestLimiter);
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//project apis
app.get('/api/projects', authenticator, projectsController.getAllProjects);
app.get('/api/projects/:id', authenticator, projectsController.getProjectById);


app.post('/api/projects', authenticator, projectsController.postProject);
app.put('/api/projects/:id', authenticator, projectsController.updateProjectHandler);
app.delete('/api/projects/:id', authenticator, projectsController.deleteProjectHandler);


app.post('/api/projects/:project_id/like', authenticator, projectsController.likeProjectHandler);
app.delete('/api/projects/:project_id/unlike', authenticator, projectsController.unlikeProjectHandler);

app.post('/api/projects/:project_id/comments/', authenticator, projectsController.postCommentOnProjectHandler);
app.delete('/api/projects/:project_id/comments/:comment_id', authenticator, projectsController.deleteCommentOnProjectHandler);
app.post('/api/projects/:project_id/comments/:comment_id/like', authenticator, projectsController.likeCommentOnProjectHandler);
app.delete('/api/projects/:project_id/comments/:comment_id/unlike', authenticator, projectsController.unlikeCommentOnProjectHandler);


//user apis
app.get('/api/users', authenticator, usersController.getAllUsers);

app.get('/api/profile/notifications', authenticator, usersController.getNotificationsHandler);
app.post('/api/profile/notifications/:id', authenticator, usersController.markNotificationReadHandler);

app.get('/api/profile/:username', authenticator, usersController.getUserByUsername);
app.put('/api/profile/:username', authenticator, usersController.updateProfileHandler);
app.post('/api/profile/:username/profilepicture', authenticator, createUploader("profiles", "profile_picture"), usersController.updateProfilePictureHandler);



app.get('/api/profile/:username/projects', authenticator, projectsController.getProjectsByUsername);

app.post('/api/signup', usersController.addNewUser);
app.post('/api/login', usersController.loginUser);


app.use(express.static(path.join(__dirname, '../client/dist')));


app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
