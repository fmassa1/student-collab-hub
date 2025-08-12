const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const projectsController = require('./controllers/projectsController');


app.get('/api/projects', projectsController.getAllProjects);
app.get('/api/projects/:id', projectsController.getProjectById);
app.post('/api/projects', projectsController.postProject);



// PUT update a project
app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { name, description } = req.body;
  if (name) project.name = name;
  if (description) project.description = description;

  res.json(project);
});

// DELETE a project
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  const deleted = projects.splice(index, 1);
  res.json(deleted[0]);
});

app.use(express.static(path.join(__dirname, '../client/dist')));


app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
