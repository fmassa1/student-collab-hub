import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { isValidGitHubUrl, isValidLinkedInUrl } from '../../services/urlChecker';

import ErrorPage from "../../components/ErrorPage/error";
import './profile.css'

function Profile() {
    const [error, setError] = useState(null);
    const [editingError, setEditingError] = useState(null);
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        fetch(`http://localhost:5055/api/profile/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                setError(res.status);
                return;
            }
            return res.json();
        })
        .then(data => {
            const profileData = data[0];
            setProfile(profileData);
            setFormData(profileData);
        })

        fetch(`http://localhost:5055/api/profile/${username}/projects`, {
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
        .then(data => setProjects(data))
        .catch(err => {
            console.error("Fetch failed:", err);
            const statusCode = parseInt(err.message);
            setError(statusCode || 500);    
        });
    }, [username]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {

        if(formData.github_url && !isValidGitHubUrl(formData.github_url)) {
            setEditingError('Invalid Github Url');
            return;
        }
        if(formData.linkedin_url && !isValidLinkedInUrl(formData.linkedin_url)) {
            setEditingError('Invalid LinkedIn Url');
            return;
        }

        setEditingError('');
    
        fetch(`http://localhost:5055/api/profile/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(updatedProfile => {
            setProfile(updatedProfile);
            setIsEditing(false);

        })
        .catch(err => console.error("Update failed:", err));

    };

    if (error) {
        return <ErrorPage code={error} />;
    }

    if (!profile) {
        return <p>No profile found with username {username}</p>;
    }

    const isOwner = user?.username === username;

    return (
        <div className="profile-details-page">
            <div className="profile-header">
                {isEditing ? (
                    <>
                        {editingError && <p className="error">{editingError}</p>}
                        <input name="first_name" value={formData.first_name || ""} onChange={handleChange} />
                        <input name="last_name" value={formData.last_name || ""} onChange={handleChange} />
                        <input name="university" value={formData.university || ""} onChange={handleChange} />
                        <input name="bio" value={formData.bio || ""} onChange={handleChange} />
                        <input name="linkedin_url" value={formData.linkedin_url || ""} onChange={handleChange} />
                        <input name="github_url" value={formData.github_url || ""} onChange={handleChange} />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <div className='profile-picture'>
                        <img 
                            src={profile.profile_picture ? profile.profile_picture : '/placeholder_profile_picture.jpg'} 
                            alt={`${profile.username}'s profile`} 
                            />
                        </div>
                        <h1>{profile.first_name} {profile.last_name}</h1>
                        <p>@{profile.username}</p>
                        {profile.university && <p>🎓 {profile.university}</p>}
                        <p>{profile.email}</p>
                        <p>{profile.bio}</p>


                        <div className="project-links">
                            {profile.linkedin_url ? (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <img src='/linkedin.svg' alt="LinkedIn" />
                                </a>
                            ) : null}
                            {profile.github_url ? (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                                    <img src='/github.svg' alt="Github" />
                                </a>
                            ) : null}
                        </div>
                        
                        {isOwner && <button onClick={() => setIsEditing(true)}>Edit Profile</button>}
                    </>
                )}
            </div>

            <hr />

            <div className="projects-section">
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
