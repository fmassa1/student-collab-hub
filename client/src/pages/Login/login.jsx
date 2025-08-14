import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './login.css';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });    

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Username, email, first name, and last name required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5055/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to login in.');
                return
            }

            console.log('Logged in:', data);


            // TODO: Navigate to users profile page
            //navigate(`/users/${data.id}`);
            navigate(`/projects`);
        } catch (err) {
            console.error('Failed to login user:', err);
            setError('Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h1>Create New Project</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}

                <label>
                    Email or Username
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
}

export default Login;