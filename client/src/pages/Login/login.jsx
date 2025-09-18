import React, { useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../../context/AuthContext";
import { loginUser } from '../../services/profileAPI';
import './login.css';

function LoginPage() {
    const navigate = useNavigate();

    const { login, user } = useContext(AuthContext);

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
            setError('Email and password required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data = await loginUser(formData);
            login(data);

            navigate(`/profile/${data.user.username}`);
        } catch (err) {
            console.error('Failed to login user:', err);
            setError(
                err.response?.data?.error || 'Failed to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Login</h1>
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
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;