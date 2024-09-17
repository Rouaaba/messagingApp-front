import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f0f4f8' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#CDC1FF' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClick}
          >
            <Avatar sx={{ bgcolor: '#CDC1FF' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, bgcolor: '#ffffff', borderRadius: 1, boxShadow: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: '#F5EFFF' }}>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              <List>
                {users.map(user => (
                  <ListItem
                    button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    selected={selectedUser?.id === user.id}
                    sx={{
                      bgcolor: selectedUser?.id === user.id ? '#E5D9F2' : 'inherit',
                      '&:hover': { bgcolor: '#E5D9F2' }
                    }}
                  >
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            {selectedUser ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Conversation with {selectedUser.username}
                </Typography>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, minHeight: '300px', mb: 2, bgcolor: '#F5EFFF', overflowY: 'auto' }}>
                  {Array.isArray(conversation) && conversation.length > 0 ? (
                    conversation.map((msg, index) => (
                      <Typography key={index} sx={{ textAlign: msg.sender === selectedUser.email ? 'right' : 'left', mb: 1 }}>
                        {msg.content}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No messages found.</Typography>
                  )}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={messageContent}
                  onChange={e => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" sx={{
                    bgcolor: '#b3a4ff', // Custom color
                    '&:hover': { bgcolor: '#A594F9' } // Slightly darker on hover
                  }} onClick={handleSendMessage}>
                  Send
                </Button>
              </>
            ) : (
              <Typography>Please select a user to start a conversation</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default UserDashboard;
