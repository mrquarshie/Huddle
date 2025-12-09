import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Huddle
      </Link>
      
      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          Browse
        </Link>
        <Link to="/" className="nav-link">
          How It Works
        </Link>
        <Link to="/" className="nav-link">
          Categories
        </Link>
        <Link to="/" className="nav-link">
          About
        </Link>
      </nav>

      <div className="header-btns">
        {user ? (
          <>
            <Link to="/add-item" className="btn btn-secondary">
              ➕ Post Listing
            </Link>
            <Link to={`/user/${user._id}`} className="btn btn-outline">
              👤 {user.name?.split(' ')[0] || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join Huddle
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
