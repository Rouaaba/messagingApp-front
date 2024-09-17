import React, { useState } from 'react';
import axios from 'axios';

function CreateUser() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = () => {
    axios.post('/users/create', user)
      .then(response => alert('User created successfully!'))
      .catch(error => alert('Error creating user'));
  };

  return (
    <div>
      <h2>Create User</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={user.username}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Create User</button>
    </div>
  );
}

export default CreateUser;
