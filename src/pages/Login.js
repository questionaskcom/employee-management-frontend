// src/pages/Login.js
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await axios.get('/sanctum/csrf-cookie');
    await axios.post('/api/login', form);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}
