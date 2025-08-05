import React, { useEffect, useState } from 'react';
import '../css/projects.css';

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
                </div>
                ))}
            </div>
            {visibleCount < allProjects.length && (
                <div className="load-more-container">
                    <button classname="load-more-btn" onClick={loadMore}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default Projects;