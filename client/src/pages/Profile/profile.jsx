import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

import ErrorPage from "../../components/ErrorPage/error";
import ProjectSection from "./components/ProjectSection/ProjectSection"
import ProfileCard from "./components/ProfileCard/ProfileCard"
import PfpUpload from "./components/PfpUpload/PfpUpload"

import {
    getProfile,
    getProjects,
} from "../../services/profileAPI";

import './profile.css'

function Profile() {
    const [error, setError] = useState(null);
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [showPfpUpload, setShowPfpUpload] = useState(false);
    const { user } = useContext(AuthContext);

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

    if (error)  return <ErrorPage code={error} />;
    if (!profile) return <p>No profile found with username {username}</p>;

    const isOwner = user?.username === username;

    return (
        <div className="profile-details-page">
            <div className="profile-content-wrapper">
                <ProfileCard
                    profile={profile}
                    isOwner={isOwner}
                    onSave={(updatedData) => setProfile(updatedData)}
                    onEditPicture={() => setShowPfpUpload(true)}
                />
                
                <PfpUpload 
                    show={showPfpUpload}
                    profile={profile}
                    setShow={setShowPfpUpload}
                    username={username}
                    onUpload={(updatedProfile) => setProfile(updatedProfile)}
                />

                <ProjectSection 
                    profile={profile} 
                    projects={projects} 
                />
            </div>
        </div>
    );
}

export default Profile;
