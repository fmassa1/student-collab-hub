import { useNavigate } from "react-router-dom";
import "./CommentSection.css";

function CommentSection({ 
    user,
    comments,
    toggleLike,
    onPost,
    onDelete,
    newComment,
    setNewComment
 }) {
    const navigate = useNavigate();

    return (
        <div className="project-comments">
            <h3>Comments ({comments.length})</h3>
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((c) => (
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
                            onClick={() => toggleLike(c.id, c.liked_by_user)}
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
                            onClick={() => onDelete(c.id)}
                            >
                            Delete
                            </button>
                        )}
                    </div>
                ))
            )}
            {user && (
                <form className="comment-form" onSubmit={onPost}>
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
    );
}

export default CommentSection;
