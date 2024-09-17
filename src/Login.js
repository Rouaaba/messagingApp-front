import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make the login request
      const response = await axios.post('/login', null, {
        params: { username, password },
        withCredentials: true // Ensure cookies are sent with requests
      });
  
      // Extract the response data which is a simple string
      const redirectUrl = response.data;
  
      // Redirect based on the response value
      if (redirectUrl === 'Admin Dashboard') {
        navigate('/admin/dashboard');
      } else if (redirectUrl === 'User Dashboard') {
        navigate('/user/dashboard');
      } else {
        console.error('Unknown redirect URL:', redirectUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  
  

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
