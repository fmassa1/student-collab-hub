import React, { useEffect, useState } from 'react';

import './projects.css';

function Projects() {

    const [allProjects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedProject, setSelectedProject] = useState(null);


    useEffect(() => {
        fetch('http://localhost:5055/api/projects')
        .then(res => res.json())
        .then(data => {
            console.log('Fetched projects:', data);
            setProjects(data);
        }
        )
        
        .catch(err => console.error('Failed to load projects', err));
    }, []);

    const loadMore = () => {
        setVisibleCount(prev=> Math.min(prev + 10, allProjects.length));
    };

    const visibleProjects = allProjects.slice(0, visibleCount);

    const handleCardClick = (project) => {
        setSelectedProject(project);
    };
    
    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <div className="projects-page">
            <h1 className="projects-heading">Featured Projects</h1>
            <div className="project-grid">
                {visibleProjects.map(project => (
                <div key={project.id} className="project-card" onClick={() => handleCardClick(project)}>
                    <img src={project.image_url} alt={project.name} />
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                    <div className="icon-container">
                    {project.linkedin_url ? (
                        <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src='/linkedin.svg' alt="LinkedIn" />
                            </a>
                        ) : null}
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <img src='/github.svg' alt="Github" />
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