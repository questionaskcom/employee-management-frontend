// src/pages/Dashboard.js
import axios from '../axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/user')
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, []);

  const logout = async () => {
    await axios.post('/api/logout');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
