import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, TextField, Box, Typography, CircularProgress, Menu, MenuItem, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching conversation for:', selectedUser.email);
      fetchConversation(selectedUser.email);
    }
  }, [selectedUser]);

  const fetchUsers = (page) => {
    setLoading(true);
    axios.get(`/users/all?page=${page}&size=10`)
      .then(response => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const fetchConversation = (email) => {
    console.log('Fetching conversation for:', email);
    axios.get(`/messages/conversation?email=${email}`)
      .then(response => {
        console.log('API Response:', response.data);
        if (Array.isArray(response.data)) {
          // Log the first item to check its structure
          console.log('First item in conversation:', response.data[0]);
          setConversation(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setConversation([]);
        }
      })
      .catch(error => {
        console.error('Error fetching conversation:', error);
        setConversation([]);
      });
  };
  
  

  const handleCreateUser = () => {
    axios.post('/users/create', newUser)
      .then(() => {
        setNewUser({ username: '', email: '', password: '' });
        fetchUsers(currentPage);
        setShowCreateUserForm(false);
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPassword('');
    setUserToDelete(null);
  };

  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  const handleDeleteUser = () => {
    if (password) {
      axios.delete(`/admin/${userToDelete.id}`, { params: { password } })
        .then(() => {
          fetchUsers(currentPage);
          handleCloseDeleteDialog();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    } else {
      alert('Please enter your password');
    }
  };

  const handleSendMessage = () => {
    if (selectedUser && messageContent) {
      axios.post('/messages/send', {
        recipient: selectedUser.email,
        content: messageContent
      })
      .then(() => {
        setMessageContent('');
        fetchConversation(selectedUser.email);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
    } else {
      alert('Please select a user and enter a message');
    }
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#F7EFE5' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#C8A1E0', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Admin Dashboard</Typography>
        <div>
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: '#C8A1E0',
              '&:hover': { backgroundColor: 'transparent' },
              '&:focus': { outline: 'none' },
              border: 'none',
              backgroundColor: 'transparent'
            }}
          >
            <Avatar sx={{ bgcolor: '#ffffff' }}>
              <AccountCircleIcon fontSize="large" sx={{ color: '#674188' }} />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                mt: 1.5
              }
            }}
          >
            <MenuItem onClick={() => navigate('/admin/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </header>

      <Box display="flex" mt={3}>
        <Box flex="1" mr={2} sx={{ borderRight: '1px solid #e0e0e0', padding: '16px' }}>
          <Typography variant="h6" sx={{ marginBottom: '16px', color: '#674188' }}>Users</Typography>
          <List>
            {users.map(user => (
              <ListItem
                button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                selected={selectedUser?.id === user.id}
                sx={{
                  backgroundColor: selectedUser?.id === user.id ? '#E2BFD9' : 'inherit',
                  '&:hover': { backgroundColor: '#C8A1E0' }
                }}
              >
                <ListItemText primary={user.username} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleOpenDeleteDialog(user)}
                  sx={{ color: '#FF6F61' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={() => setShowCreateUserForm(!showCreateUserForm)}
              sx={{
                backgroundColor: '#C8A1E0',
                '&:hover': { backgroundColor: '#674188' },
                color: '#ffffff'
              }}
            >
              {showCreateUserForm ? 'Close Create User Form' : 'Create User'}
            </Button>
          </Box>
          {/* Pagination Controls */}
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>Previous</Button>
            <Typography>Page {currentPage + 1} of {totalPages}</Typography>
            <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>Next</Button>
          </Box>
          {/* Create User Form */}
          {showCreateUserForm && (
            <Box mt={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                sx={{ marginBottom: '16px' }}
              />
              <Button
                variant="contained"
                onClick={handleCreateUser}
                sx={{
                  backgroundColor: '#C8A1E0',
                  '&:hover': { backgroundColor: '#674188' },
                  color: '#ffffff'
                }}
              >
                Create User
              </Button>
            </Box>
          )}
        </Box>

        {selectedUser && (
          <Box flex="2" sx={{ padding: '16px' }}>
            <Typography variant="h6" sx={{ marginBottom: '16px', color: '#674188' }}>
              Conversations with {selectedUser.username}
            </Typography>
            <Box sx={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '16px' }}>
            <List>
              {conversation.map((msg, index) => (
                <ListItem
                key={index}
                sx={{
                  backgroundColor: '#F7EFE5',
                  border: '1px solid #E2BFD9', // Outline color
                  borderRadius: '4px' // Optional: Adds rounded corners
                }}
              >
                <ListItemText primary={msg} />
              </ListItem>
              ))}
            </List>

            </Box>
            <TextField
              label="Type your message here"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                backgroundColor: '#C8A1E0',
                '&:hover': { backgroundColor: '#674188' },
                color: '#ffffff'
              }}
            >
              Send Message
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete user {userToDelete?.username}?</Typography>
          <TextField
            label="Your Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            sx={{
              backgroundColor: '#FF6F61',
              '&:hover': { backgroundColor: '#E53F3F' },
              color: '#ffffff'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
