import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NotificationsContext } from "../../context/Notifications";
import { Link } from "react-router-dom";
import './navbar.css';


function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const { notifications, markAsRead } = useContext(NotificationsContext);
    const [showDropdown, setShowDropdown] = useState(false);


    return (
        <nav className="navbar">
            <div className="nav-container">
                <a href="/" className="logo">Peer Spark</a>
                <ul className="nav-links">
                    <li><a href="/projects">Browse Projects</a></li>
                    <li><a href="/">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/create">Create Post</a></li>
                    {user ? (
                        <>  <li>
                                <Link to={`/profile/${user.username}`}>
                                    {user.username}
                                </Link>
                            </li>
                            <li>
                                <button className="logout-button" onClick={logout}>
                                    Logout
                                </button>
                            </li>
                            <li className="notifications">
                                <button 
                                    className="notifications-button" 
                                    onClick={() => setShowDropdown(prev => !prev)}
                                >
                                    Notifications: {notifications.length}
                                </button>
                                {showDropdown && (
                                    <div className="notifications-dropdown">
                                        {notifications.length > 0 ? (
                                            notifications.map((n, idx) => (
                                                <div key={idx} className="notification-item">
                                                    <Link to={`/projects/${n.project_id}`} className="notification-link" 
                                                        onClick={() => {
                                                            markAsRead(n.id);
                                                            setShowDropdown(prev => !prev);
                                                        }}> 
                                                        {n.message || "New Notification"}
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="notification-empty">No new notifications</div>
                                        )}
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login" className="login-button">Login</a></li>
                            <li><a href="/signup" className="signup-button">Sign Up</a></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;