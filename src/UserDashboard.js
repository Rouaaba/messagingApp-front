import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, TextField, Box, Typography, CircularProgress, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    axios.get('/normal-users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  // Fetch conversation when a user is selected
  useEffect(() => {
    if (selectedUser) {
      axios.get(`/messages/conversation?email=${selectedUser.email}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setConversation(response.data);
          } else {
            console.error('Unexpected response format for conversation:', response.data);
            setConversation([]);
          }
        })
        .catch(error => {
          console.error('Error fetching conversation:', error);
          setConversation([]);
        });
    }
  }, [selectedUser]);

  // Handle logout
  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (selectedUser && messageContent) {
      axios.post('/messages/send', {
        recipient: selectedUser.email,
        content: messageContent
      })
      .then(() => {
        setMessageContent('');
        // Fetch the updated conversation
        axios.get(`/messages/conversation?email=${selectedUser.email}`)
          .then(response => {
            if (Array.isArray(response.data)) {
              setConversation(response.data);
            } else {
              console.error('Unexpected response format for updated conversation:', response.data);
            }
          })
          .catch(error => {
            console.error('Error fetching updated conversation:', error);
          });
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
    } else {
      alert('Please select a user and enter a message');
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
      
    // Inline styles
    <Box sx={{ padding: '20px', backgroundColor: '#F7EFE5' }}>
      <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#C8A1E0', borderRadius: '8px'}}> 
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>User Dashboard</Typography>
        <IconButton
  onClick={handleMenuClick}
  sx={{
    color: '#C8A1E0',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:focus': {
      outline: 'none',
    },
    // Remove any border or background color that might be causing the red box
    border: 'none',
    backgroundColor: 'transparent',
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
            sx: { // Material UI
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              mt: 1.5,
            },
          }}
        >
          <MenuItem onClick={() => navigate('/user/profile')}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
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
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex="2" sx={{ padding: '16px' }}>
          {selectedUser ? (
            <>
              <Typography variant="h6" sx={{ marginBottom: '16px', color: '#674188' }}>
                Conversation with {selectedUser.username}
              </Typography>
              <Box sx={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', padding: '16px', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: 1 }}>
                {Array.isArray(conversation) && conversation.length > 0 ? (
                  conversation.map((msg, index) => (
                    <Typography key={index} variant="body1" sx={{ marginBottom: '8px' }}>
                      {msg}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No messages found.</Typography>
                )}
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                label="Type your message"
                value={messageContent}
                onChange={e => setMessageContent(e.target.value)}
                sx={{ marginBottom: '8px' }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#C8A1E0',
                  '&:hover': { backgroundColor: '#674188' },
                  color: '#ffffff'
                }}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </>
          ) : (
            <Typography variant="body2">Please select a user to start a conversation</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default UserDashboard;
