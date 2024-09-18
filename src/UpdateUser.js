import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || '';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      // Fetch user data to pre-fill the form, if necessary
      axios.get(`/users/${userId}`)
        .then(response => {
          setInput(response.data.username || response.data.email || '');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setError(''); // Clear error state to avoid UI display
          setLoading(false);
        });
    }
  }, [userId]);

  const handleUpdate = () => {
    axios.post('/users/update', { id: userId, input })
      .then(response => {
        alert('User updated successfully!');
        navigate('/login'); // Redirect to profile page
      })
      .catch(error => {
        console.error('Error updating user:', error);
        setError(''); // Clear error state to avoid UI display
      });
  };

  if (loading) {
    return (
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7EFE5' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#F7EFE5', maxWidth: '500px', margin: '0 auto' }}>
      <Typography variant="h6" sx={{ marginBottom: '16px', color: '#674188' }}>Update User</Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        label="New Username or Email"
        value={input}
        onChange={e => setInput(e.target.value)}
        sx={{ marginBottom: '16px', color: '#674188' }}
      />
      
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#C8A1E0',
          '&:hover': { backgroundColor: '#674188' },
          color: '#ffffff'
        }}
        onClick={handleUpdate}
      >
        Update User
      </Button>
    </Box>
  );
}

export default UpdateUser;
