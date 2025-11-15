import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Huddle
        </Link>
        
        <div className="nav-search">
          <input type="text" placeholder="Search items..." />
          <button>Search</button>
        </div>

        <div className="nav-links">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <span className={`user-tag ${user.role}`}>
                {user.role}
              </span>
              {user.role === 'seller' && (
                <>
                  <Link to="/add-item">Add Item</Link>
                  <Link to="/my-items">My Items</Link>
                </>
              )}
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;