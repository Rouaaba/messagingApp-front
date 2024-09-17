import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterElement = () => {
    const [role, setRole] = useState('user'); // Default role is user
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = { username, email, password };
        const url = role === 'admin' ? '/admin/create' : '/users/create'; // URL based on role

        try {
            const response = await axios.post(url, user);
            if (response.status === 200 || response.status === 201) {
                navigate('/login'); // Redirect to login after successful registration
            }
        } catch (error) {
            // Extract error message or fallback to a general error message
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
                {error && (
                    <div className="error">
                        {/* Displaying error as a string */}
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterElement;
