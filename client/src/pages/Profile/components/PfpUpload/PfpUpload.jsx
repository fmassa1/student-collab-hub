import "./PfpUpload.css";

function PfpUpload({ 
    show, 
    newPfp, 
    setNewPfp, 
    onClose, 
    onUpload
 }) {

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
                    <button onClick={onClose}> Cancel </button>
                    <button 
                        onClick={async () => {
                            if (!newPfp) return;
                            onUpload(newPfp);
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
