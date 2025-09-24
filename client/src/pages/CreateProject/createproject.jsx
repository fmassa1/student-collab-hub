import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { isValidGitHubUrl } from '../../services/urlChecker';

import TagSelector from '../../components/TagSelector/TagSelector';
import { AuthContext } from "../../context/AuthContext";
import { postProject, postProjectImages } from "../../services/projectAPI";

import './createproject.css';


function CreateProject() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        github_url: '',
        tags: [],
        images: []
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        async function fetchData() {
            e.preventDefault();
            if (!formData.name || !formData.description) {
                setError('Name and description are required.');
                return;
            }
    
            if(formData.github_url && !isValidGitHubUrl(formData.github_url)) {
                setError('Invalid Github Url');
                return;
            }
            setError('');
            setLoading(true);

            try {
                const data = new FormData();
                data.append("name", formData.name);
                data.append("description", formData.description);
                data.append("github_url", formData.github_url);
                data.append("tags", JSON.stringify(formData.tags));

                const project = await postProject(data);
                const projectImages = await postProjectImages(project.id, formData.images);
                navigate(`/projects/${project.id}`);
                setLoading(false);
            } catch (err) {
                console.error('Failed to create project:', err);
                setError(err);
            }
        }
        fetchData();
    };


    return (
        <div className="create-project-page">
            <h1>Create New Project</h1>
            <form className="project-form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}

                <label>
                    Project Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>


                <label>
                    Upload Images (max 3)
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, ...files].slice(0, 3),
                        }));
                        }}
                    />
                    </label>

                    <div className="image-preview">
                    {formData.images.map((file, idx) => (
                        <div key={idx} className="preview-container">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            className="preview-img"
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                            setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                            }));
                            }}
                        >
                            <img src="/svg/trash.svg" alt="Remove" className="trash-icon" />
                        </button>
                        </div>
                    ))}
                 </div>

                <label>
                    GitHub URL
                    <input
                        type="text"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
                    />
                </label>

                <TagSelector
                    selected={formData.tags || []}
                    setSelected={(tags) =>
                        setFormData((prev) => ({ ...prev, tags }))
                    }
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
}

export default CreateProject;