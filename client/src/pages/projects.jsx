import React, { useEffect, useState } from 'react';

import LinkedIn from '../assets/linkedin.svg'
import Github from '../assets/github.svg'

import '../css/projects.css';
import { Link } from 'react-router-dom';

function Projects() {

    const [allProjects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error('Failed to load projects', err));
    }, []);

    const loadMore = () => {
        setVisibleCount(prev=> Math.min(prev + 10, allProjects.length));
    };

    const visibleProjects = allProjects.slice(0, visibleCount);

    return (
        <div className="projects-page">
            <h1 className="projects-heading">Featured Projects</h1>
            <div className="project-grid">
                {visibleProjects.map(project => (
                <div key={project.id} className="project-card">
                    <img src={project.image_url} alt={project.name} />
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                    <div className="icon-container">
                        <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src={LinkedIn} alt="LinkedIn" />
                        </a>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <img src={Github} alt="Github" />
                        </a>
                    </div>
                </div>
                ))}
            </div>
            {visibleCount < allProjects.length && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default Projects;