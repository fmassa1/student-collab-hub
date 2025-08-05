import React, { useEffect, useState } from 'react';
import '../css/projects.css';

function Projects() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error('Failed to load projects', err));
    }, []);

    return (
        <div className="projects-page">
        <h1 className="projects-heading">Featured Projects</h1>
        <div className="project-grid">
            {projects.map(project => (
            <div key={project.id} className="project-card">
                <img src={project.image_url} alt={project.name} />
                <h2>{project.name}</h2>
                <p>{project.description}</p>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Projects;