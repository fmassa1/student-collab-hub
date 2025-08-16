import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { AuthContext } from "../../context/AuthContext";
import './projectdetails.css'

//TODO add auth when making calls


function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const { user, token} = useContext(AuthContext);
    
    
    useEffect(() => {
        fetch(`http://localhost:5055/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
            const projectData = data[0];
            const isLiked = projectData.liked_by?.includes(user.id) || false;
            const numberOfLikes = projectData.liked_by?.length || 0;


            setProject(projectData);
            setLiked(isLiked); 
            setLikes(numberOfLikes);
        })
        
        .catch(err => console.error(`Failed to load project ID: ${id}`, err));
    }, [id]);

    const handleToggleLike = async () => {
        if (!user) {
            alert('You must be logged in to like a project.');
            return;
        }

        try {
            const url = `http://localhost:5055/api/projects/${id}/${liked ? 'unlike' : 'like'}/${user.id}`;
            const method = liked ? 'DELETE' : 'POST';

            const res = await fetch(url, { method });
            const data = await res.json();

            if (res.ok) {
                setLiked(!liked);
                setLikes(prev => liked ? prev - 1 : prev + 1);

            } else {
                console.error('Failed to toggle like:', data.error);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

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

                <button 
                    className={`like-button ${liked ? 'liked' : ''}`} 
                    onClick={handleToggleLike}
                >
                    {liked ? 'Liked' : 'Like'} ({likes})
                </button>
            </div>
        </div>
    );
}

export default ProjectDetails;