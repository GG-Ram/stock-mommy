import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>👶 Mommy Simulator</h1>
        </div>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link 
              to="/market" 
              className={`navbar-link ${location.pathname === '/market' ? 'active' : ''}`}
            >
              <span className="icon">🛒</span>
              <span>Market</span>
            </Link>
          </li>
          
          <li className="navbar-item">
            <Link 
              to="/shop" 
              className={`navbar-link ${location.pathname === '/shop' ? 'active' : ''}`}
            >
              <span className="icon">🏪</span>
              <span>Shop</span>
            </Link>
          </li>
          
          <li className="navbar-item">
            <Link 
              to="/avatar" 
              className={`navbar-link ${location.pathname === '/avatar' ? 'active' : ''}`}
            >
              <span className="icon">👤</span>
              <span>Avatar</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;