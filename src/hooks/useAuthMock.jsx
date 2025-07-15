import React, { useContext, useState, createContext } from 'react';

// Create an Auth context with default values to prevent null errors
// Only GitHub authentication is supported now
const AuthContext = createContext({
  currentUser: null,
  loading: false,
  loginWithGithub: () => {},
  logout: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // GitHub is now the only authentication method
  const loginWithGithub = async (isNewUser = false) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Mock different user data based on whether it's a sign up or sign in
    // In a real app, this would all come from the GitHub OAuth response
    if (isNewUser) {
      setCurrentUser({
        uid: 'github-new-user-' + Date.now(),
        email: 'new-dev@github.com',
        displayName: 'New GitHub Developer',
        username: 'newdev',
        photoURL: 'https://avatars.githubusercontent.com/u/583231?v=4', // GitHub octocat avatar
        githubProfile: 'https://github.com/octocat',
        githubRepos: 12,
        joinDate: new Date().toISOString(),
        skills: ['JavaScript', 'React', 'Node.js']
      });
    } else {
      setCurrentUser({
        uid: 'github-user-123',
        email: 'developer@github.com',
        displayName: 'GitHub Developer',
        username: 'devgithub',
        photoURL: 'https://avatars.githubusercontent.com/u/583231?v=4', // GitHub octocat avatar
        githubProfile: 'https://github.com/octocat',
        githubRepos: 35,
        followers: 128,
        following: 42,
        joinDate: '2022-05-15T10:30:00Z',
        skills: ['JavaScript', 'React', 'TypeScript', 'GraphQL']
      });
    }
    
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setCurrentUser(null);
    setLoading(false);
  };

  const value = {
    currentUser,
    loginWithGithub,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}