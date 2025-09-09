import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';

import { postComment, deleteComment, likeComment, unlikeComment } from '../../services/commentAPI';
import { AuthContext } from "../../context/AuthContext";
import ErrorPage from "../../components/ErrorPage/error";
import TagSelector from "../../components/TagSelector/TagSelector";

import './projectdetails.css'


function ProjectDetails() {
    const [error, setError] = useState(null);
    const { user, token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [project, setProject] = useState(null);
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [newComment, setNewComment] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tags: []
      });
    
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

    useEffect(() => {
        if (isEditing && project) {
          setFormData({
            name: project.name || "",
            description: project.description || "",
            tags: project.tags || []
          });
        }
    }, [isEditing, project]);

    if (error) {
        return <ErrorPage code={error} />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    };
      
    const handleTagsChange = (newTags) => {
        setFormData(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const handleSave = async () => {
        try {
          const res = await fetch(`http://localhost:5055/api/projects/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
      
          if (!res.ok) throw new Error(res.status);
          const updated = await res.json();
      
          setProject(updated);
          setIsEditing(false);
        } catch (err) {
          console.error("Failed to update project:", err);
          setError(parseInt(err.message) || 500);
        }
      };

    const handleToggleLike = async () => {
        try {
            const url = `http://localhost:5055/api/projects/${id}/${liked ? 'unlike' : 'like'}`;
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

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const createdComment = await postComment(id, newComment, token);
            
            const commentWithUser = {

                id: createdComment.id,
                username: user.username,
                date_posted: createdComment.date_posted,
                likes: createdComment.likes,
                liked_by_user: createdComment.liked_by_user,
                comment: newComment
            };
            
            setProject(prev => ({
                ...prev,
                comments: [...prev.comments, commentWithUser]
            }));
            setNewComment(''); 
        } catch (err) {
            console.error('Failed to post comment:', err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(id, commentId, token);
            
            setProject(prev => ({
                ...prev,
                comments: prev.comments.filter(comment => comment.id !== commentId)
            }));
        } catch (err) {
            console.error("Failed to delete comment:", err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
        }
    };

    const handleToggleCommentLike = async (commentId, userLiked) => {
        try {
            if (userLiked) {
                await unlikeComment(id, commentId, token);
                setProject(prev => ({
                    ...prev,
                    comments: prev.comments.map(c =>
                        c.id === commentId 
                            ? { ...c, likes: c.likes - 1, liked_by_user: false }
                            : c
                    )
                }));
            } else {
                await likeComment(id, commentId, token);
                setProject(prev => ({
                    ...prev,
                    comments: prev.comments.map(c =>
                        c.id === commentId 
                            ? { ...c, likes: c.likes + 1, liked_by_user: true }
                            : c
                    )
                }));
            }
        } catch (err) {
            console.error("Error toggling comment like:", err);
            setError(parseInt(err.message) || 500);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
    
        try {
            const res = await fetch(`http://localhost:5055/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (res.ok) {
                navigate('/');
            } else {
                throw new Error(res.status);
            }
        } catch (err) {
            console.error("Failed to delete project:", err);
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
                {user && project.user_id === user.id && (
                        <button className="delete-project-btn" onClick={handleDeleteProject}>
                            Delete Project
                        </button>


                )}

                {user && project.user_id === user.id && (
                    <button className="update-project-btn" onClick={() => setIsEditing(true)}>
                        Update Project
                    </button>
                )}

                {isEditing ? (
                    <>
                        <input name="name" value={formData.name || ""} onChange={handleChange} />
                        <input name="description" value={formData.description || ""} onChange={handleChange} />
                        <TagSelector
                            selected={formData.tags}
                            setSelected={handleTagsChange} 
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    
                    </>
                ): (
                    <>
                        <div className="project-header">
                            <div>
                                <h1 className="project-title">{project.name}</h1>
                                <span className="project-meta">
                                Posted by{" "}
                                <strong 
                                    onClick={() => navigate(`/profile/${project.username}`)} 
                                    className="clickable-username"
                                >
                                    {project.username } 
                                </strong>
                                {" "} on {new Date(project.date_posted).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                </span>
                            </div>
                            
                            <div className="project-views">
                                <img src='/eye.svg' alt=""  className="views-icon" />
                                <span>{project.views} views </span>
                            </div>
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
                            <img 
                                src={liked ? "/thumbs-up-filled.svg" : "/thumbs-up-outline.svg"} 
                                alt="Like" 
                                className="like-icon"
                            />
                            <span className="like-count">{likes}</span>
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
                                    <span>{"on "}
                                        {new Date(c.date_posted).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}</span>
                                    <p>{c.comment}</p>
                                    <button 
                                        className={`comment-like-button ${c.liked_by_user ? 'liked' : ''}`}
                                        onClick={() => handleToggleCommentLike(c.id, c.liked_by_user)}
                                    >
                                        <img 
                                            src={c.liked_by_user ? "/thumbs-up-filled.svg" : "/thumbs-up-outline.svg"} 
                                            alt="Like" 
                                            className="like-icon"
                                        />
                                        <span>{c.likes}</span>
                                    </button>
                                
                                    {user && c.username === user.username && (
                                        <button
                                        className="delete-comment-btn"
                                        onClick={() => handleDeleteComment(c.id)}
                                        >
                                        Delete
                                        </button>
                                    )}
                                    </div>
                                ))
                            )}
                            {user && (
                                <form className="comment-form" onSubmit={handlePostComment}>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="comment-input"
                                    />
                                    <button type="submit" className="comment-submit">Post</button>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;