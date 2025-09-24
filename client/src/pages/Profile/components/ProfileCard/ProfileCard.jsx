import { useState } from "react";

import EditProfileForm from "../EditProfileForm/EditProfileForm";
import { isValidGitHubUrl, isValidLinkedInUrl } from '../../../../services/urlChecker';
import {updateProfile} from "../../../../services/profileAPI";

import "./ProfileCard.css";

function ProfileCard({
    profile,
    isOwner,
    onSave,
    onEditPicture
  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingError, setEditingError] = useState(null);
    const [formData, setFormData] = useState({});


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
            const updatedProfile = await updateProfile(profile.username, formData);
            onSave(updatedProfile);
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            setEditingError("Profile update failed.");
        }
    };


    if (isEditing) {
        return (
            <div className="profile-header">
                <EditProfileForm
                    formData={formData}
                    editingError={editingError}
                    onChange={handleChange}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="profile-header">
            <div className='profile-picture-container'>
                <img 
                    src={profile.profile_picture_url || '/placeholder_profile_picture.jpg'} 
                    alt={`${profile.username}'s profile`} 
                    className='profile-picture'
                />
                {isOwner && (
                    <button 
                        className="edit-pfp-btn" 
                        onClick={onEditPicture}
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

            <div className="profile-links">
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
                </button>
            )}
        </div>
    );

}

export default ProfileCard;