import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './signup.css';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        university: '',

    });    

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.first_name | !formData.last_name) {
            setError('Username, email, first name, and last name required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5055/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create new user.');
                return
            }

            console.log('User created:', data);


            // TODO: Navigate to users profile page
            //navigate(`/users/${data.id}`);
            navigate(`/projects`);
        } catch (err) {
            console.error('Failed to create new user:', err);
            setError('Failed to create new user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    //TODO:
    //   - check email/username already taken
    //   - double password entry
    //   - pass info to database
    //   - password hashing
    //   - university drop down?


    return (
        <div className="signup-page">
            <h1>Create New Project</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Username
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
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

                <label>
                    First Name
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Last Name
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <label>
                    University
                    <input
                        type="text"
                        name="university"
                        value={formData.university}
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

export default SignUp;