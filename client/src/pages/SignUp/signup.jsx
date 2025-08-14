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