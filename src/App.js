import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import UpdateUser from './UpdateUser';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<UpdateUser />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;
