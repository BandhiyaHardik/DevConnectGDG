import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, profile } = useFirebase();
  const location = useLocation();

  // Always allow /logout to render, even if loading or not authenticated
  if (location.pathname === "/logout") {
    return children;
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't completed onboarding and isn't on the onboarding page
  if (!profile?.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If user has completed onboarding but is trying to access onboarding page
  if (profile?.onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;