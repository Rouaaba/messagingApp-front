import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Import CSS file for styling

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/users/all?page=0&size=10') // Adjust the page and size as needed
      .then(response => {
        setUsers(response.data.content); // Assuming response.data.content contains the list of users
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

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
        // Refresh user list after successful creation
        setNewUser({ username: '', email: '', password: '' });
        return axios.get('/users/all?page=0&size=10');
      })
      .then(response => setUsers(response.data.content))
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  const handleDeleteUser = (id) => {
    const confirmPassword = window.prompt('Please enter your password to confirm deletion:');
    if (confirmPassword) {
      axios.delete(`/admin/${id}`, { params: { password: confirmPassword } })
        .then(() => {
          // Refresh user list after successful deletion
          return axios.get('/users/all?page=0&size=10');
        })
        .then(response => setUsers(response.data.content))
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>

        {/* User Creation Form */}
        <div className="user-creation">
          <h3>Create New User</h3>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button onClick={handleCreateUser}>Create User</button>
        </div>

        {/* User List */}
        <div className="user-list">
          <h3>All Users</h3>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.username} - {user.email}
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
