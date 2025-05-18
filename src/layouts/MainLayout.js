import { Link } from 'react-router-dom';
import { removeToken } from '../auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MainLayout({ children }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const name = localStorage.getItem('user');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user'); // ✅ Optional: clear name on logout
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h3 className="mb-4">EMS</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/employees" className="nav-link text-white">
              Employees
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/departments" className="nav-link text-white">
              Department
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/projects" className="nav-link text-white">
              Project
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="d-flex justify-content-end align-items-center p-3 border-bottom">
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
            >
              {userName} {/* ✅ Dynamic user name */}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4" style={{ backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
