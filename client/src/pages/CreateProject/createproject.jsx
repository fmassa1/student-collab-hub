import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { isValidGitHubUrl } from '../../services/urlChecker';

import TagSelector from '../../components/TagSelector/TagSelector';
import { AuthContext } from "../../context/AuthContext";
import { postProject } from "../../services/projectAPI";

import './createproject.css';


function CreateProject() {
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        github_url: '',
        tags: []
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
                const data = await postProject(formData);
                navigate(`/projects/${data.id}`);
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


                {/* will change later to upload pictures */}
                <label>
                    Image URL
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                </label>

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