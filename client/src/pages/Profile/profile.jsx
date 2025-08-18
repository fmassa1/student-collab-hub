import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';


import { AuthContext } from "../../context/AuthContext";
import './profile.css'


function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);

    
    const { token } = useContext(AuthContext);
    
    
    useEffect(() => {
        fetch(`http://localhost:5055/api/profile/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const profileData = data[0];
            setProfile(profileData);

        })
        fetch(`http://localhost:5055/api/profile/${username}/projects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const projectData = data;
            setProjects(projectData);
        })
        
        .catch(err => console.error(`Failed to load profile username: ${username}`, err));
    }, [username]);

    if(!profile) {
        return <p>No profile found with username {username}</p>
    }

    return (
        <div className="profile-details-page">
            {/* User Info */}
            <div className="profile-header">
                <h1>{profile.first_name} {profile.last_name}</h1>
                <p>@{profile.username}</p>
                <p>{profile.email}</p>
                {profile.university && <p>🎓 {profile.university}</p>}
            </div>

            <hr />

            <div className="projects-section" >
                <h2>{profile.first_name}'s Projects</h2>
                {projects.length > 0 ? (
                    <ul className="projects-list">
                        {projects.map((project, idx) => (
                            <li key={idx} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects found for this user.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;