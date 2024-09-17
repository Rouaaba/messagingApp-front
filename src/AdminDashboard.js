import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Ensure this file exists

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [userUpdate, setUserUpdate] = useState({ username: '', email: '', password: '' });
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false); // Added state for form visibility
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.email);
    }
  }, [selectedUser]);

  const fetchUsers = (page) => {
    setLoading(true);
    axios.get(`/users/all?page=${page}&size=10`) // Adjust size if needed
      .then(response => {
        setUsers(response.data.content); // Assuming response.data.content contains the list of users
        setTotalPages(response.data.totalPages); // Assuming response.data.totalPages contains total pages info
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const fetchConversation = (email) => {
    axios.get(`/messages/conversation?email=${email}`)
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

  const handleCreateUser = () => {
    axios.post('/users/create', newUser)
      .then(() => {
        setNewUser({ username: '', email: '', password: '' });
        fetchUsers(currentPage); // Fetch users again to include the new one
        setShowCreateUserForm(false); // Hide the form after creation
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  const handleDeleteUser = (id) => {
    const confirmPassword = window.prompt('Please enter your password to confirm deletion:');
    if (confirmPassword) {
      axios.delete(`/admin/${id}`, { params: { password: confirmPassword } })
        .then(() => {
          fetchUsers(currentPage);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const handleEditProfile = () => {
    if (selectedUser) {
      axios.put(`/users/${selectedUser.id}`, userUpdate)
        .then(() => {
          setUserUpdate({ username: '', email: '', password: '' });
          setSelectedUser(null);
          fetchUsers(currentPage);
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <button onClick={handleLogout}>Logout</button>
        <div className="profile-menu">
          <button 
            className="profile-icon" 
            onClick={() => setShowMenu(!showMenu)}
          >
            <span>🔽</span> {/* Example icon */}
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <button 
          className="create-user-button" 
          onClick={() => setShowCreateUserForm(!showCreateUserForm)}
        >
          {showCreateUserForm ? 'Close Create User Form' : 'Create User'}
        </button>
      </header>
      <div className="dashboard-content">
        <div className="user-list-section">
          <h2>User List</h2>
          <ul className="user-list">
            {users.map(user => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <span>{user.username} - {user.email}</span>
                </div>
                <div className="user-actions">
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  <button onClick={() => { setSelectedUser(user); fetchConversation(user.email); }}>Send Message</button>
                </div>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
              Previous
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
              Next
            </button>
          </div>
        </div>

        {/* Create User Form */}
        {showCreateUserForm && (
          <div className="create-user-form">
            <h2>Create New User</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit">Create User</button>
            </form>
          </div>
        )}

        {/* Messaging */}
        {selectedUser && (
          <div className="message-panel">
            <h3>Send Message to {selectedUser.username}</h3>
            <div className="conversation">
              {Array.isArray(conversation) && conversation.length > 0 ? (
                conversation.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))
              ) : (
                <p>No messages found.</p>
              )}
            </div>
            <textarea
              value={messageContent}
              onChange={e => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
