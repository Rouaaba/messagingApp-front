import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/current')
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching profile:', error);
        setError('Failed to load user profile.');
      });
  }, []);

  // Function to handle editing the user
  const handleEdit = () => {
    const password = window.prompt('Please enter your password to edit your profile:');
    if (password) {
      // Perform any actions related to editing after password confirmation
      navigate('/update-user', { state: { userId: user.id } });
    } else {
      alert('Password is required to edit your profile.');
    }
  };

  // Function to handle deleting the user
  const handleDelete = () => {
    const password = window.prompt('Please enter your password to delete your account:');
    
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
      }
    } else {
      alert('Password is required to delete your account.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Id: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}

export default Profile;
