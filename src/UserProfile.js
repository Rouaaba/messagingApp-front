import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'edit' or 'delete'
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/current')
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching profile:', error);
        setError('Failed to load user profile.');
      });
  }, []);

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPassword('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEdit = () => {
    if (password) {
      // Perform any actions related to editing after password confirmation
      navigate('/update-user', { state: { userId: user.id } });
      handleDialogClose();
    } else {
      alert('Password is required to edit your profile.');
    }
  };
//`/users/all?page=${page}&size=10`
  const handleDelete = () => {
    if (password) {
      if (window.confirm('Are you sure you want to delete your account?')) {
        axios.delete(`/delete/current`, {
          params: { username: user.username, password: password }
        })
          .then(() => {
            navigate('/login'); // Redirect to login after deletion
          })
          .catch(error => {
            console.error('Error deleting account:', error);
            setError('Failed to delete account.');
          });
        handleDialogClose();
      }
    } else {
      alert('Password is required to delete your account.');
    }
  };

  if (error) {
    return (
      <Box sx={{ padding: '20px', backgroundColor: '#F7EFE5' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7EFE5' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#F7EFE5' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#C8A1E0', borderRadius: '8px' }}>
        <IconButton onClick={() => navigate('/user/dashboard')} sx={{ color: '#ffffff', '&:hover': { backgroundColor: 'transparent' } }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>Profile</Typography>
      </header>

      <Box sx={{ marginTop: '20px', padding: '20px', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ marginBottom: '16px', color: '#674188' }}>User Information</Typography>
        <Typography variant="body1">Id: {user.id}</Typography>
        <Typography variant="body1">Username: {user.username}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>

        <Box sx={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#C8A1E0',
              '&:hover': { backgroundColor: '#674188' },
              color: '#ffffff',
              marginRight: '10px',
            }}
            onClick={() => handleDialogOpen('edit')}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            data-testid="open-delete-dialog"
            onClick={() => handleDialogOpen('delete')}
          >
            Delete Account
          </Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogType === 'edit' ? 'Edit Profile' : 'Delete Account'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogType === 'edit' ? 'Enter your password to edit your profile:' : 'Enter your password to confirm account deletion:'}</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginTop: '8px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button
            onClick={dialogType === 'edit' ? handleEdit : handleDelete}
            color="primary"
            data-testid={dialogType === 'edit' ? 'confirm-edit' : 'confirm-delete'} // Add unique data-testid
          >
            {dialogType === 'edit' ? 'Edit' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserProfile;
