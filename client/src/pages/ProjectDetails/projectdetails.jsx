import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../../context/AuthContext";
import ErrorPage from "../../components/ErrorPage/error";
import TagSelector from "../../components/TagSelector/TagSelector";
import projectTags from "../../components/TagSelector/projectTags.json";
import { 
    postComment, deleteComment, likeComment, unlikeComment,
    getProject, updateProject, deleteProject,
    unlikeProject, likeProject
 } from '../../services/projectAPI';

import './projectdetails.css'


function ProjectDetails() {
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const { user, token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [project, setProject] = useState(null);
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [newComment, setNewComment] = useState('');

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tags: [],
      });
    
    useEffect(() => {
        async function fetchData() {
            try {
                const projectData = await getProject(id);
                const isLiked = projectData.liked_by?.includes(user.id) || false;
                const numberOfLikes = projectData.liked_by?.length || 0;
                setProject(projectData);
                setLiked(isLiked); 
                setLikes(numberOfLikes);
                setLoading(false);
            } catch (err) {
                console.error("Fetch failed:", err);
                const statusCode = err.status;
                setError(statusCode || 500);
                setErrorMessage(err.message || `Server error fetching project #${id}`)
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (isEditing && project) {
            const tagIds = projectTags
                .filter(tag => project.tags.includes(tag.label))
                .map(tag => tag.id);
            setFormData({
                name: project.name || "",
                description: project.description || "",
                tags: tagIds || [],
            });
        }
    }, [isEditing, project]);

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
        async function fetchData() {
            try {
                const updatedProjectData = await updateProject(id, JSON.stringify(formData));
                const updated = await updatedProjectData;
      
                setProject(updated);
                setIsEditing(false);
            } catch (err) {
                console.error("Failed to update project:", err);
                setError(parseInt(err.message) || 500);
                setErrorMessage(`Server error updating project #${id}`);
            }
        }
        fetchData();
    };

    const handleToggleLike = async () => {
        async function fetchData() {
            try {
                let res;
                if(!liked) res = await likeProject(id);
                else res =  await unlikeProject(id);

                if (res.status >= 200 && res.status < 300) {
                    setLiked(!liked);
                    setLikes(prev => liked ? prev - 1 : prev + 1);
    
                } 
                else throw new Error(res.status, `Server error liking project #${id}`);
            } catch (err) {
                console.error('Error toggling like:', err);
                const statusCode = parseInt(err.message);
                setError(statusCode || 500);
                setErrorMessage(`Server error toggling like`);
            }
        }
        fetchData();
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const createdComment = await postComment(id, newComment);
            
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
            setErrorMessage(`Server error posting comment`);

        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(id, commentId);
            
            setProject(prev => ({
                ...prev,
                comments: prev.comments.filter(comment => comment.id !== commentId)
            }));
        } catch (err) {
            console.error("Failed to delete comment:", err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);
            setErrorMessage(`Server error deleting comment #${commentId}`);

        }
    };

    const handleToggleCommentLike = async (commentId, userLiked) => {
        try {
            if (userLiked) {
                await unlikeComment(id, commentId);
                setProject(prev => ({
                    ...prev,
                    comments: prev.comments.map(c =>
                        c.id === commentId 
                            ? { ...c, likes: c.likes - 1, liked_by_user: false }
                            : c
                    )
                }));
            } else {
                await likeComment(id, commentId);
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
            setErrorMessage(`Server error liking comment #${commentId}`);

        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        async function fetchData() {
            try {
                const updatedProjectData = await deleteProject(id);
                navigate('/');
                if (res.ok) navigate('/'); 
                else throw new Error(res.status);

            } catch (err) {
                console.error("Failed to delete project:", err);
                const statusCode = parseInt(err.message);
                setError(statusCode || 500);
                setErrorMessage(`Server error deleting project #${id}`);
            }
        }
        fetchData();
    };

    if (error) {
        return <ErrorPage code={error} error={errorMessage} />;
    }

    if (loading) {
        return <div className="loading">Loading project...</div>;
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
                                <img src='/svg/eye.svg' alt=""  className="views-icon" />
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
                            {project.github_url ? (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                    <img src='/svg/github.svg' alt="Github" />
                                </a>
                            ) : null}
                        </div>

                        <button 
                            className={`like-button ${liked ? 'liked' : ''}`} 
                            onClick={handleToggleLike}
                            >
                            <img 
                                src={liked ? "/svg/thumbs-up-filled.svg" : "/svg/thumbs-up-outline.svg"} 
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
                                            src={c.liked_by_user ? "/svg/thumbs-up-filled.svg" : "/svg/thumbs-up-outline.svg"} 
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