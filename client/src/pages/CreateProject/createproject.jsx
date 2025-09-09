import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import TagSelector from '../../components/TagSelector/TagSelector';
import { AuthContext } from "../../context/AuthContext";
import './createproject.css';


function CreateProject() {
    const navigate = useNavigate();
    const { user, token} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        linkedin_url: '',
        github_url: '',
        tags: []
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValidGitHubUrl = (string) => {
        try {
            new URL(string);
            return string.startsWith('https://github.com') || string.startsWith('https://www.github.com')

        } catch (_) {
            return false;
        }
    }

    const isValidLinkedInUrl = (string) => {
        try {
            new URL(string);
            return string.startsWith('https://linkedin.com') || string.startsWith('https://www.linkedin.com')

        } catch (_) {
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description) {
            setError('Name and description are required.');
            return;
        }

        if(formData.linkedin_url && !isValidLinkedInUrl(formData.linkedin_url)) {
            setError('Invalid LinkedIn Url');
            return;
        }

        if(formData.github_url && !isValidGitHubUrl(formData.github_url)) {
            setError('Invalid Github Url');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5055/api/projects', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                })
            });

            if (!res.ok) {
                let errorMsg = 'Something went wrong';
                try {
                  const errData = await res.json();
                  errorMsg = errData.error || errorMsg;
                } catch {
                  errorMsg = await res.text();
                }
            
                setError(errorMsg);
                return;
              }

            const data = await res.json();
            console.log('Project created:', data);

            navigate(`/projects/${data.id}`);
        } catch (err) {
            console.error('Failed to create project:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
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
                    LinkedIn URL
                    <input
                        type="text"
                        name="linkedin_url"
                        value={formData.linkedin_url}
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