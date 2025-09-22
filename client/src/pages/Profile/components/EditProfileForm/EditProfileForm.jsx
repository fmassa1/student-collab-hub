import "./EditProfileForm.css";

function EditProfileForm({ 
    formData,
    editingError,
    onChange,
    onSave,
    onCancel
 }) {


    return (
        <div className="edit-profile-form">
            {editingError && <p className="error">{editingError}</p>}

            <label className="edit-label" htmlFor="first_name">First Name</label>
            <input id="first_name" className="edit-input" name="first_name" value={formData.first_name || ""} onChange={onChange} placeholder="First Name" />

            <label className="edit-label" htmlFor="last_name">Last Name</label>
            <input id="last_name" className="edit-input" name="last_name" value={formData.last_name || ""} onChange={onChange} placeholder="Last Name" />

            <label className="edit-label" htmlFor="university">University</label>
            <input id="university" className="edit-input" name="university" value={formData.university || ""} onChange={onChange} placeholder="University" />

            <label className="edit-label" htmlFor="bio">Bio</label>
            <textarea id="bio" className="edit-textarea" name="bio" value={formData.bio || ""} onChange={onChange} placeholder="Write a short bio"></textarea>

            <label className="edit-label" htmlFor="linkedin_url">LinkedIn</label>
            <input id="linkedin_url" className="edit-input" name="linkedin_url" value={formData.linkedin_url || ""} onChange={onChange} placeholder="https://linkedin.com/in/username" />

            <label className="edit-label" htmlFor="github_url">GitHub</label>
            <input id="github_url" className="edit-input" name="github_url" value={formData.github_url || ""} onChange={onChange} placeholder="https://github.com/username" />

            <div className="edit-buttons">
            <button className="save-btn" onClick={onSave}>Save</button>
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );

}

export default EditProfileForm;