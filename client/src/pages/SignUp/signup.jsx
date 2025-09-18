import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../../services/profileAPI';

import './signup.css';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        university: '',
    });    

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);    
    const [passwordsMatch, setPasswordsMatch] = useState(true);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password' || name === 'confirmPassword') {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            setPasswordsMatch(password === confirmPassword || confirmPassword === '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.first_name || !formData.last_name) {
            setError('Username, email, first name, and last name required');
            return;
        }

        if (formData.username.length < 6) {
            setError('Username must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }


        setError('');
        setLoading(true);

        try {
            const { confirmPassword, ...submitData } = formData;
            const data = await signUpUser(submitData); // no stringify, no res.json()
        
            console.log('User created:', data);
            navigate(`/login`);
        } catch (err) {
            console.error('Failed to create new user:', err);
            setError(err.response?.data?.error || 'Failed to create new user. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1 className="signup-title">Sign Up</h1>

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
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Confirm Password
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter your password"
                        className={!passwordsMatch ? 'password-mismatch' : ''}
                    />
                    {!passwordsMatch && formData.confirmPassword && (
                        <span className="password-error">Passwords do not match</span>
                    )}
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
                    {loading ? 'Submitting...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default SignUp;