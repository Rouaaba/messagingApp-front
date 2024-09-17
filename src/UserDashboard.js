import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Ensure this file exists

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
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
      </header>

      <div className="dashboard-content">
        <div className="user-panel">
          <h2>Users</h2>
          <ul>
            {users.map(user => (
              <li 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={selectedUser?.id === user.id ? 'selected' : ''}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="message-panel">
          {selectedUser ? (
            <>
              <h2>Conversation with {selectedUser.username}</h2>
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
            </>
          ) : (
            <p>Please select a user to start a conversation</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
