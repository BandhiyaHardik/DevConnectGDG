import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "./Header.css";

const dashboardRoutes = [
  "/dashboard",
  "/swipe",
  "/chat",
  "/profile",
  "/profile/edit",
  "/settings",
  "/hackathons"
];

const isDashboardRoute = (pathname) =>
  dashboardRoutes.includes(pathname) || /^\/chat\/[^/]+$/.test(pathname);

const isLandingRoute = (pathname) =>
  pathname === "/" || pathname === "/login" || pathname === "/register";

const Header = ({ logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  // Dashboard header
  if (isDashboardRoute(location.pathname)) {
    return (
      <header className="dashboard-header">
        <Link to="/dashboard" className="logo">DevConnect</Link>
        <nav className="dashboard-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/swipe" className={location.pathname === '/swipe' ? 'active' : ''}>Swipe</Link>
          <Link to="/chat" className={location.pathname.startsWith('/chat') ? 'active' : ''}>Chat</Link>
          <Link to="/hackathons" className={location.pathname === '/hackathons' ? 'active' : ''}>Hackathons</Link>
        </nav>
        <div className="profile-menu" ref={menuRef}>
          <div
            className="avatar"
            onClick={() => setUserMenuOpen((open) => !open)}
            style={{ cursor: "pointer" }}
          >
            {user?.photoURL && (
              <img src={user.photoURL} alt={user.displayName || "Profile"} />
            )}
          </div>
          {userMenuOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <Link to="/logout" className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Landing header for / and all non-dashboard routes
  if (isLandingRoute(location.pathname) || location.pathname === "/*") {
    return (
      <header className="main-header">
        <Link to="/" className="logo">DevConnect</Link>
        <nav>
          <Link to="/login" className="header-btn">Log In</Link>
          <Link to="/login" className="header-btn header-btn-primary">Sign Up</Link>
        </nav>
      </header>
    );
  }

  // Default: show landing header for any other route
  return (
    <header className="main-header">
      <Link to="/" className="logo">DevConnect</Link>
      <nav>
        <Link to="/login" className="header-btn">Log In</Link>
        <Link to="/register" className="header-btn header-btn-primary">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;