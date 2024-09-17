import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Container, Typography, Alert, Link } from '@mui/material';

const RegisterElement = () => {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = { username, email, password };
        const url = role === 'admin' ? '/admin/create' : '/users/create';

        try {
            const response = await axios.post(url, user);
            if (response.status === 200 || response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Register</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                        required
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Register</Button>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </Alert>
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Do you already have an account? <Link href="/login">Login here</Link>
                </Typography>
            </form>
        </Container>
    );
};

export default RegisterElement;
