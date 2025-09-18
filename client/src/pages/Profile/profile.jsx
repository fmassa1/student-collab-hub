import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { isValidGitHubUrl, isValidLinkedInUrl } from '../../services/urlChecker';

import ErrorPage from "../../components/ErrorPage/error";

import {
    getProfile,
    getProjects,
    updateProfile,
    uploadProfilePicture,
  } from "../../services/profileAPI";

import './profile.css'

function Profile() {
    const [error, setError] = useState(null);
    const [editingError, setEditingError] = useState(null);
    const [showPfpUpload, setShowPfpUpload] = useState(false);
    const [newPfp, setNewPfp] = useState(null);
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const profileData = await getProfile(username);
                setProfile(profileData);
                const projectData = await getProjects(username);
                setProjects(projectData);
            } catch (err) {
                setError(err.response?.status || 500);
            }
        }
        fetchData();
    }, [username]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {

        if(formData.github_url && !isValidGitHubUrl(formData.github_url)) {
            setEditingError('Invalid Github Url');
            return;
        }
        if(formData.linkedin_url && !isValidLinkedInUrl(formData.linkedin_url)) {
            setEditingError('Invalid LinkedIn Url');
            return;
        }

        setEditingError('');
    
        try {
            const updatedProfile = await updateProfile(username, formData, token);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            setEditingError("Profile update failed.");
        }
    };

    const handlePictureUpload = async (file) => {
        try {
          const data = await uploadProfilePicture(username, file);
          setProfile({ ...profile, profile_picture_url: data.profile_picture_url });
          setShowPfpUpload(false);
        } catch (err) {
          console.error("Upload failed:", err);
        }
      };

    if (error)  return <ErrorPage code={error} />;
    if (!profile) return <p>No profile found with username {username}</p>;

    const isOwner = user?.username === username;

    return (
        <div className="profile-details-page">
            <div className="profile-header">
                {isEditing ? (
                    <>
                        <div className="edit-profile-form">
                            {editingError && <p className="error">{editingError}</p>}

                            <label className="edit-label" htmlFor="first_name">First Name</label>
                            <input id="first_name" className="edit-input" name="first_name" value={formData.first_name || ""} onChange={handleChange} placeholder="First Name" />

                            <label className="edit-label" htmlFor="last_name">Last Name</label>
                            <input id="last_name" className="edit-input" name="last_name" value={formData.last_name || ""} onChange={handleChange} placeholder="Last Name" />

                            <label className="edit-label" htmlFor="university">University</label>
                            <input id="university" className="edit-input" name="university" value={formData.university || ""} onChange={handleChange} placeholder="University" />

                            <label className="edit-label" htmlFor="bio">Bio</label>
                            <textarea id="bio" className="edit-textarea" name="bio" value={formData.bio || ""} onChange={handleChange} placeholder="Write a short bio"></textarea>

                            <label className="edit-label" htmlFor="linkedin_url">LinkedIn</label>
                            <input id="linkedin_url" className="edit-input" name="linkedin_url" value={formData.linkedin_url || ""} onChange={handleChange} placeholder="https://linkedin.com/in/username" />

                            <label className="edit-label" htmlFor="github_url">GitHub</label>
                            <input id="github_url" className="edit-input" name="github_url" value={formData.github_url || ""} onChange={handleChange} placeholder="https://github.com/username" />

                            <div className="edit-buttons">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='profile-picture-container'>
                            <img 
                                src={profile.profile_picture_url ? profile.profile_picture_url : '/placeholder_profile_picture.jpg'} 
                                alt={`${profile.username}'s profile`} 
                                className='profile-picture'
                            />
                            {isOwner && (
                                <button 
                                    className="edit-pfp-btn" 
                                    onClick={() => setShowPfpUpload(true)}
                                >
                                    <img 
                                    src="/svg/pencil-simple.svg" 
                                    alt="Edit profile picture" 
                                    className="edit-pfp-icon" 
                                    />
                                </button>
                            )}
                        </div>
                        <h1>{profile.first_name} {profile.last_name}</h1>
                        <p>@{profile.username}</p>
                        {profile.university && <p>🎓 {profile.university}</p>}
                        <p>{profile.email}</p>
                        <p>{profile.bio}</p>

                        <div className="project-links">
                            {profile.linkedin_url ? (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <img src='/svg/linkedin.svg' alt="LinkedIn" />
                                </a>
                            ) : null}
                            {profile.github_url ? (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                                    <img src='/svg/github.svg' alt="Github" />
                                </a>
                            ) : null}
                        </div>
                        
                        {isOwner && (
                            <button onClick={() => {
                                    setFormData(profile);
                                    setIsEditing(true);
                                }}>
                                    Edit Profile
                            </button>)}
                    </>
                )}
            </div>
            {showPfpUpload && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Upload New Profile Picture</h3>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setNewPfp(e.target.files[0])} 
                        />
                        <div className="modal-actions">
                            <button 
                            onClick={() => setShowPfpUpload(false)}
                            >
                            Cancel
                            </button>
                            <button 
                                onClick={async () => {
                                    if (!newPfp) return;
                                    try {
                                        const data = await uploadProfilePicture(username, newPfp, token);
                                        setProfile({ ...profile, profile_picture_url: data.profile_picture_url });
                                        setShowPfpUpload(false);
                                    } catch (err) {
                                        console.error("Upload failed:", err);
                                    }
                                }}
                                >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
                )}

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
