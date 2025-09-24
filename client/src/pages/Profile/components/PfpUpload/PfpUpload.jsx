import { useState } from 'react';
import { uploadProfilePicture } from "../../../../services/profileAPI";
import "./PfpUpload.css";

function PfpUpload({
    show, 
    profile,
    setShow, 
    username, 
    onUpload
}) {

    const [newPfp, setNewPfp] = useState(null);

    const handlePictureUpload = async (file) => {
        try {
          const data = await uploadProfilePicture(username, file);
          onUpload({
            ...profile,
            profile_picture_url: `${data.profile_picture_url}?t=${Date.now()}`
        });
        setShow(false);
        } catch (err) {
          console.error("Upload failed:", err);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Upload New Profile Picture</h3>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNewPfp(e.target.files[0])} 
                />
                <div className="modal-actions">
                    <button onClick={() => setShow(false)}> Cancel </button>
                    <button 
                        onClick={async () => {
                            if (!newPfp) return;
                            handlePictureUpload(newPfp);
                        }}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PfpUpload;
