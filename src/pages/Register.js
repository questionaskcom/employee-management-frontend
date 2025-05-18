import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../auth';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('https://api.questionask.com/api/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed! Please try again.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#e9f0fb' }}>
      <div className="card shadow-lg" style={{ maxWidth: '900px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
        <div className="row g-0">
          {/* Left info side */}
          <div className="col-md-6 d-none d-md-block" style={{ backgroundColor: '#0d6efd' }}>
            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5">
              <h2 className="fw-bold mb-4">Join Employee Management</h2>
              <p className="fs-5">
                Create your account to access all the tools for managing your employees efficiently and effortlessly.
              </p>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
                alt="Register"
                style={{ width: '150px', opacity: 0.8 }}
                className="mt-auto"
              />
            </div>
          </div>

          {/* Right form side */}
          <div className="col-md-6 bg-white p-5">
            <h3 className="mb-4 text-center text-primary fw-bold">Create an Account</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="mb-3">
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
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fs-5 fw-semibold">
                Register
              </button>
            </form>
            <p className="mt-4 text-center text-muted">
              Already have an account?{' '}
              <a href="/login" className="text-primary fw-semibold">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
