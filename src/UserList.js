import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    axios.get('/normal-users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSendMessage = () => {
    axios.post('/messages/send', { recipient, content: message })
      .then(response => alert('Message sent!'))
      .catch(error => alert('Error sending message: ' + error.message));
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <button onClick={() => setRecipient(user.email)}>
              {user.username}
            </button>
          </li>
        ))}
      </ul>
      {recipient && (
        <div>
          <h2>Send Message</h2>
          <textarea
            placeholder="Type your message here"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default UserList;
