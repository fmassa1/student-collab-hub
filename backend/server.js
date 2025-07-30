const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database"
let projects = [
  { id: 1, name: "AI Chatbot", description: "A chatbot that helps students" },
  { id: 2, name: "3D Protein Viewer", description: "AR protein interaction explorer" }
];


// GET all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// GET a single project by ID
app.get('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST a new project
app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ error: 'Missing name or description' });

  const newProject = {
    id: projects.length + 1,
    name,
    description
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

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

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
// });
test = path.join('..', 'client', 'dist', 'index.html')
console.log(test)
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
