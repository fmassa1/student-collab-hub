import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { AuthContext } from "../../context/AuthContext";
import ErrorPage from "../../components/ErrorPage/error";

import './projectdetails.css'


function ProjectDetails() {
    const [error, setError] = useState(null);
    const { user, token} = useContext(AuthContext);
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(`http://localhost:5055/api/projects/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            return res.json();
        })
        .then(data => {
            const projectData = data;
            const isLiked = projectData.liked_by?.includes(user.id) || false;
            const numberOfLikes = projectData.liked_by?.length || 0;


            setProject(projectData);
            setLiked(isLiked); 
            setLikes(numberOfLikes);
        })
        
        .catch(err => {
            console.error("Fetch failed:", err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
        });
    }, [id]);

    if (error) {
        return <ErrorPage code={error} />;
    }

    const handleToggleLike = async () => {
        if (!user) {
            alert('You must be logged in to like a project.');
            return;
        }

        try {
            const url = `http://localhost:5055/api/projects/${id}/${liked ? 'unlike' : 'like'}/${user.id}`;
            const method = liked ? 'DELETE' : 'POST';

            const res = await fetch(url, { 
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                setLiked(!liked);
                setLikes(prev => liked ? prev - 1 : prev + 1);

            } else {
                throw new Error(res.status);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
        }
    };

    if (error) {
        return <ErrorPage code={error} />;
    }

    if(!project) {
        return <p>Project not found</p>
    }

    return (
        <div className="project-details-page">
            <div className="project-post-card">
                <div className="project-header">
                    <h1 className="project-title">{project.name}</h1>
                    <span className="project-meta">
                        Posted by{" "}
                        <strong 
                            onClick={() => navigate(`/profile/${project.username}`)} 
                            className="clickable-username"
                        >
                            {project.username}
                        </strong>
                    </span>
                </div>

                {project.image_url && (
                    <div className="project-image-wrapper">
                        <img src={project.image_url} alt={project.image_url} className="project-image" />
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

                <div className="project-comments">
                    <h3>Comments ({project.comments.length})</h3>
                    {project.comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        project.comments.map((c) => (
                            <div key={c.id} className="comment-card">
                                <strong 
                                    onClick={() => navigate(`/profile/${c.username}`)} 
                                    className="clickable-username"
                                >
                                    {c.username}
                                </strong>
                                <p>{c.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;