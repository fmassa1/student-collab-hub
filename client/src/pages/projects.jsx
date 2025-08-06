import React, { useEffect, useState } from 'react';

import LinkedIn from '../assets/linkedin.svg'
import Github from '../assets/github.svg'

import '../css/projects.css';

function Projects() {

    const [allProjects, setProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedProject, setSelectedProject] = useState(null);


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
                        <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src={LinkedIn} alt="LinkedIn" />
                        </a>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <img src={Github} alt="Github" />
                        </a>
                    </div>
                    {project.tags?.length > 0 && (
                        <div className="project-tags">
                            {project.tags.map((tag, index) => (
                            <span key={index} className="tag-badge">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                ))}
            </div>
            {visibleCount < allProjects.length && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>Load More</button>
                </div>
            )}
            {selectedProject && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}> x </button>
                        <img src={selectedProject.image_url} alt={selectedProject.name} />
                        <h2>{selectedProject.name}</h2>
                        <p>{selectedProject.description}</p>
                        <div className="modal-icon-container">
                            <a href={selectedProject.linkedin_url} target="_blank" rel="noopener noreferrer">
                                <img src={LinkedIn} alt="LinkedIn" />
                            </a>
                            <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                                <img src={Github} alt="Github" />
                            </a>
                        </div>
                        <div className="project-tags">
                            {selectedProject.tags?.map((tag, index) => (
                                <span key={index} className="tag-badge">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;