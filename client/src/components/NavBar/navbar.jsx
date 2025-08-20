import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import './navbar.css';


function NavBar() {
    const { user, logout } = useContext(AuthContext);

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
                        <>
                                <Link to={`/profile/${user.username}`}>
                                    {user.username}
                                </Link>                           
                                 <li>
                                <button className="logout-button" onClick={logout}>
                                    Logout
                                </button>
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