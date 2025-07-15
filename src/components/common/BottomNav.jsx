import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/dashboard" 
        className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
      >
        <i className="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink 
        to="/swipe" 
        className={`nav-item ${location.pathname === '/swipe' ? 'active' : ''}`}
      >
        <i className="fas fa-code"></i>
        <span>Connect</span>
      </NavLink>
      
      <NavLink 
        to="/chat" 
        className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}
      >
        <i className="fas fa-comments"></i>
        <span>Messages</span>
      </NavLink>
      
      <NavLink 
        to="/hackathons" 
        className={`nav-item ${location.pathname === '/hackathons' ? 'active' : ''}`}
      >
        <i className="fas fa-laptop-code"></i>
        <span>Hackathons</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;