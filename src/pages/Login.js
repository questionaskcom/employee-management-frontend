import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://api.questionask.com/api/login', { email, password });
      setToken(res.data.data.token); 
      localStorage.setItem('user', res.data.data.name);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed!');
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="card shadow-lg" style={{ maxWidth: '900px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
        <div className="row g-0">
          {/* Left image / info side */}
          <div className="col-md-6 d-none d-md-block" style={{ backgroundColor: '#007bff' }}>
            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5">
              <h2 className="fw-bold mb-4">Employee Management</h2>
              <p className="fs-5">
                Manage your team effectively and keep track of all employee details from a sleek dashboard.
              </p>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3179/3179068.png"
                alt="Employee"
                style={{ width: '150px', opacity: 0.8 }}
                className="mt-auto"
              />
            </div>
          </div>

          {/* Right form side */}
          <div className="col-md-6 bg-white p-5">
            <h3 className="mb-4 text-center text-primary fw-bold">Welcome Back</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fs-5 fw-semibold">
                Log In
              </button>
            </form>
            <p className="mt-4 text-center text-muted">
              Don’t have an account?{' '}
              <a href="/register" className="text-primary fw-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
