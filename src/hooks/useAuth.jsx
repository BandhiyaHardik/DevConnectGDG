import React, { useState, createContext, useContext } from 'react';

// Create an AuthContext
const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth object available
export function AuthProvider({ children }) {
  // Create a mock user directly without Firebase
  const [currentUser] = useState({
    uid: 'mock-user-123',
    email: 'user@example.com',
    displayName: 'Demo User',
    photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=1a73e8&color=fff',
    skills: ['React', 'JavaScript', 'Firebase'],
    role: 'Frontend Developer',
    bio: 'Passionate developer looking to connect with like-minded people.',
    location: 'San Francisco, CA',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com'
  });
  
  // Context value with simplified mock methods
  const value = {
    currentUser,
    loading: false,
    isAuthenticated: true
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object
export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;