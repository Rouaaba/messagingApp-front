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
        <Container maxWidth="sm" sx={{ mt: 5, backgroundColor: '#F7EFE5', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#674188' }}>Register</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label" sx={{ color: '#674188' }}>Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#674188',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#674188',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#674188',
                                },
                            },
                        }}
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
                    sx={{ 
                        marginBottom: '16px',
                        backgroundColor: '#E2BFD9',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#674188',
                            },
                            '&:hover fieldset': {
                                borderColor: '#674188',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#674188',
                            },
                        },
                    }}
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
                    sx={{ 
                        marginBottom: '16px',
                        backgroundColor: '#E2BFD9',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#674188',
                            },
                            '&:hover fieldset': {
                                borderColor: '#674188',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#674188',
                            },
                        },
                    }}
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
                    sx={{ 
                        marginBottom: '16px',
                        backgroundColor: '#E2BFD9',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#674188',
                            },
                            '&:hover fieldset': {
                                borderColor: '#674188',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#674188',
                            },
                        },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: '#C8A1E0',
                        '&:hover': { backgroundColor: '#674188' },
                        color: '#ffffff',
                        mt: 2
                    }}
                >
                    Register
                </Button>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </Alert>
                )}
                <Typography variant="body2" sx={{ mt: 2, color: '#674188' }}>
                    Do you already have an account? <Link href="/login" sx={{ color: '#674188', textDecoration: 'none' }}>Login here</Link>
                </Typography>
            </form>
        </Container>
    );
};

export default RegisterElement;
