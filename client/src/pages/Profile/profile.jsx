import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { isValidGitHubUrl, isValidLinkedInUrl } from '../../services/urlChecker';

import ErrorPage from "../../components/ErrorPage/error";
import ProjectSection from "./components/ProjectSection/ProjectSection"
import ProfileCard from "./components/ProfileCard/ProfileCard"
import PfpUpload from "./components/PfpUpload/PfpUpload"



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
            const updatedProfile = await updateProfile(username, formData);
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
          setProfile({
            ...profile,
            profile_picture_url: `${data.profile_picture_url}?t=${Date.now()}`
        });
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
            <ProfileCard
                profile={profile}
                formData={formData}
                isEditing={isEditing}
                isOwner={isOwner}
                editingError={editingError}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                onEditProfile={() => {
                    setFormData(profile);
                    setIsEditing(true);
                }}
                onEditPicture={() => setShowPfpUpload(true)}
            />
            
            <PfpUpload 
                show={showPfpUpload}
                newPfp={newPfp}
                setNewPfp={setNewPfp}
                onClose={() => setShowPfpUpload(false)}
                onUpload={handlePictureUpload}
            />

            <ProjectSection profile={profile} projects={projects} />

        </div>
    );
}

export default Profile;
