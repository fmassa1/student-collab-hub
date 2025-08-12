import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './projectdetails.css'

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    
    useEffect(() => {
        fetch(`http://localhost:5055/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(`Fetched project ID: ${id}:`, data);
            setProject(data[0]);
        })
        
        .catch(err => console.error(`Failed to load project ID: ${id}`, err));
    }, [id]);

    if(!project) {
        return <p>Project not found</p>
    }

    return (
        <div className="project-details-page">
            <div className="project-post-card">
                <div className="project-header">
                    <h1 className="project-title">{project.name}</h1>
                    <span className="project-meta">Posted in <strong>Projects</strong> • {new Date().toLocaleDateString()}</span>
                </div>

                {project.image_url && (
                    <div className="project-image-wrapper">
                        <img src={project.image_url} alt={project.name} className="project-image" />
                    </div>
                )}

                <p className="project-description">{project.description}</p>

                {project.tags && project.tags.length > 0 && (
                    <div className="project-tags">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="tag-pill">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="project-links">
                    {project.linkedin_url ? (
                        <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <img src='/linkedin.svg' alt="LinkedIn" />
                        </a>
                    ) : null}
                    {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <img src='/github.svg' alt="Github" />
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;