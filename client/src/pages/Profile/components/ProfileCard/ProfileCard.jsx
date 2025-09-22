import EditProfileForm from "../EditProfileForm/EditProfileForm";
import "./ProfileCard.css";

function ProfileCard({
    profile,
    formData,
    isEditing,
    isOwner,
    editingError,
    onChange,
    onSave,
    onCancel,
    onEditProfile,
    onEditPicture,
  }) {

    if (isEditing) {
        return (
            <div className="profile-header">
                <EditProfileForm
                    formData={formData}
                    editingError={editingError}
                    onChange={onChange}
                    onSave={onSave}
                    onCancel={onCancel}
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
            <p>{profile.profile_picture_url}</p>

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
                <button onClick={onEditProfile}>
                        Edit Profile
                </button>
            )}
        </div>
    );

}

export default ProfileCard;