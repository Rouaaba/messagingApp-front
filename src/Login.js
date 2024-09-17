import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Alert, Link } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', null, {
                params: { username, password },
                withCredentials: true
            });

            const redirectUrl = response.data;

            if (redirectUrl === 'Admin Dashboard') {
                navigate('/admin/dashboard');
            } else if (redirectUrl === 'User Dashboard') {
                navigate('/user/dashboard');
            } else {
                console.error('Unknown redirect URL:', redirectUrl);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account? <Link href="/register">Register here</Link>
                </Typography>
            </form>
        </Container>
    );
};

export default Login;
