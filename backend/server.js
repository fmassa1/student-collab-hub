const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database"
let projects = [
  { id: 1, name: "AI Chatbot", image_url: "https://picsum.photos/200?1", description: "A chatbot that helps students", linkedin_url: "https://www.linkedin.com/in/fredric-massa", github_url: "https://github.com/fmassa1", tags: ["Python", "Flask", "HTML", "CSS"]},
  { id: 2, name: "3D Protein Viewer", image_url: "https://picsum.photos/200?2", description: "AR protein interaction explorer" },
  { id: 3, name: "Smart Scheduler", image_url: "https://picsum.photos/200?3", description: "AI-powered class and task scheduler" },
  { id: 4, name: "Campus Navigator", image_url: "https://picsum.photos/200?4", description: "Augmented reality app for navigating campus" },
  { id: 5, name: "Resume Analyzer", image_url: "https://picsum.photos/200?5", description: "Tool to scan and grade resumes using ML" },
  { id: 6, name: "Code Mentor", image_url: "https://picsum.photos/200?6", description: "Peer-to-peer code review and help platform" },
  { id: 7, name: "Eco Tracker", image_url: "https://picsum.photos/200?7", description: "Track personal carbon footprint and habits" },
  { id: 8, name: "Study Buddy Finder", image_url: "https://picsum.photos/200?8", description: "Match with students in similar classes" },
  { id: 9, name: "IdeaBoard", image_url: "https://picsum.photos/200?9", description: "Collaborative whiteboard for project planning" },
  { id: 10, name: "Hackathon Hub", image_url: "https://picsum.photos/200?10", description: "Organize and join virtual hackathons" },
  { id: 11, name: "TaskStorm", image_url: "https://picsum.photos/200?11", description: "Gamified group task management app" },
  { id: 12, name: "Dev Dashboard", image_url: "https://picsum.photos/200?12", description: "Unified view of GitHub, Trello, and more" },
  { id: 13, name: "QuizMe AI", image_url: "https://picsum.photos/200?13", description: "Generate quizzes from any PDF or lecture notes" },
  { id: 14, name: "Roommate Matcher", image_url: "https://picsum.photos/200?14", description: "Find compatible roommates using preferences" },
  { id: 15, name: "Language Buddy", image_url: "https://picsum.photos/200?15", description: "Pair up with native speakers to practice" },
  { id: 16, name: "Crypto Tracker", image_url: "https://picsum.photos/200?16", description: "Track your crypto portfolio and news" },
  { id: 17, name: "Workout Logger", image_url: "https://picsum.photos/200?17", description: "Log workouts and share with your group" },
  { id: 18, name: "SkillShare UIC", image_url: "https://picsum.photos/200?18", description: "Exchange skills with others on campus" },
  { id: 19, name: "Focus Flow", image_url: "https://picsum.photos/200?19", description: "Pomodoro timer with music and task sync" },
  { id: 20, name: "Lab Partner Finder", image_url: "https://picsum.photos/200?20", description: "Find lab partners based on availability" },
  { id: 21, name: "Language Buddy", image_url: "https://picsum.photos/200?15", description: "Pair up with native speakers to practice" },
  { id: 22, name: "Crypto Tracker", image_url: "https://picsum.photos/200?16", description: "Track your crypto portfolio and news" },
  { id: 23, name: "Workout Logger", image_url: "https://picsum.photos/200?17", description: "Log workouts and share with your group" },
  { id: 24, name: "SkillShare UIC", image_url: "https://picsum.photos/200?18", description: "Exchange skills with others on campus" },
  { id: 25, name: "Focus Flow", image_url: "https://picsum.photos/200?19", description: "Pomodoro timer with music and task sync" },
  { id: 26, name: "Lab Partner Finder", image_url: "https://picsum.photos/200?20", description: "Find lab partners based on availability" },
  { id: 27, name: "Lab Partner Finder", image_url: "https://picsum.photos/200?20", description: "Find lab partners based on availability" },
  { id: 28, name: "Language Buddy", image_url: "https://picsum.photos/200?15", description: "Pair up with native speakers to practice" },
  { id: 29, name: "Crypto Tracker", image_url: "https://picsum.photos/200?16", description: "Track your crypto portfolio and news" },
  { id: 30, name: "Workout Logger", image_url: "https://picsum.photos/200?17", description: "Log workouts and share with your group" },
  { id: 31, name: "SkillShare UIC", image_url: "https://picsum.photos/200?18", description: "Exchange skills with others on campus" },
  { id: 32, name: "Focus Flow", image_url: "https://picsum.photos/200?19", description: "Pomodoro timer with music and task sync" },
  { id: 33, name: "Lab Partner Finder", image_url: "https://picsum.photos/200?20", description: "Find lab partners based on availability" }
];



// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, './../client/dist/index.html'));
// });
// app.get('/contact', (req, res) => {
//   res.sendFile(path.join(__dirname, './../client/public/contact.html'));
// });

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

app.use(express.static(path.join(__dirname, '../client/dist')));


app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
