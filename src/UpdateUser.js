import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || '';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // Fetch user data to pre-fill the form, if necessary
      axios.get(`/users/${userId}`)
        .then(response => {
          // Set the initial value of input based on fetched data
          setInput(response.data.username || response.data.email || '');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
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
        alert('Error updating user');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Update User</h2>
      <input
        type="text"
        placeholder="New Username or Email"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={handleUpdate}>Update User</button>
    </div>
  );
}

export default UpdateUser;
