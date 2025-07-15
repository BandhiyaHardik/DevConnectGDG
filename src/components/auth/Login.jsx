import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithGithub, processRedirectResult } from '../../firebase/auth';
import { useFirebase } from '../../contexts/FirebaseContext';
import './Auth.css';

const Login = () => {
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  // Process redirect result on component mount
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        setLoading(true);
        const result = await processRedirectResult();
        if (result) {
          // User successfully signed in after redirect
          handleSuccessfulLogin();
        }
      } catch (err) {
        console.error('Redirect authentication error:', err);
        setError('Failed to complete authentication. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkRedirect();
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      handleSuccessfulLogin();
    }
  }, [user]);

  const handleSuccessfulLogin = () => {
    // Check if user needs to complete onboarding first
    if (user && !user.onboardingComplete) {
      navigate('/onboarding', { replace: true });
    } else {
      // Redirect after successful login
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  // Only trigger GitHub auth when button is clicked
  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGithub();
      // Redirect handled by Firebase
    } catch (err) {
      console.error('GitHub authentication error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Authentication canceled. Please try again.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with a different sign-in method.');
      } else {
        setError('Failed to authenticate with GitHub. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle between sign in and sign up modes (UI only)
  const handleSignIn = () => {
    setIsNewUser(false);
  };

  const handleSignUp = () => {
    setIsNewUser(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to DevConnect<span className="text-accent">.</span></h2>
          <p>Connect with developers worldwide</p>
        </div>
        
        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
        
        <div className="github-auth-container">
          <div className="auth-mode-toggle">
            <button 
              className={`auth-mode-btn ${!isNewUser ? 'active' : ''}`}
              onClick={handleSignIn}
              disabled={loading}
            >
              Sign In
            </button>
            <button 
              className={`auth-mode-btn ${isNewUser ? 'active' : ''}`}
              onClick={handleSignUp}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
          
          <div className="github-info">
            <div className="github-icon">
              <svg height="48" viewBox="0 0 16 16" width="48">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"></path>
              </svg>
            </div>
            <h3>{isNewUser ? 'Sign up with GitHub' : 'Sign in with GitHub'}</h3>
            <p>
              {isNewUser
                ? 'Create an account using your GitHub profile to connect with developers.'
                : 'Use your GitHub account to sign in to DevConnect.'}
            </p>
            
            <div className="github-benefits">
              <div className="benefit-item">
                <i className="fas fa-code-branch"></i>
                <span>Connect your repositories</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-users"></i>
                <span>Find collaborators</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-shield-alt"></i>
                <span>Secure authentication</span>
              </div>
            </div>
          </div>
          
          {/* Always render the button, regardless of error */}
          <button
            onClick={handleGithubAuth}
            className="github-auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="fab fa-github"></i>
                <span>{isNewUser ? 'Continue with GitHub' : 'Sign in with GitHub'}</span>
              </>
            )}
          </button>
        </div>
        
        <div className="auth-footer">
          <p>
            By continuing, you agree to DevConnect's <a href="/terms" className="auth-link">Terms of Service</a> and <a href="/privacy" className="auth-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
      
      <div className="auth-info">
        <h2>Developer connections<span className="text-accent">.</span></h2>
        <div className="feature-list">
          <div className="feature-item">
            <i className="fas fa-project-diagram"></i>
            <div>
              <h3>Share Your Projects</h3>
              <p>Showcase your GitHub repositories to potential collaborators</p>
            </div>
          </div>
          <div className="feature-item">
            <i className="fas fa-code"></i>
            <div>
              <h3>Match by Coding Skills</h3>
              <p>Find developers with complementary skills for your projects</p>
            </div>
          </div>
          <div className="feature-item">
            <i className="fas fa-laptop-code"></i>
            <div>
              <h3>Join Hackathons</h3>
              <p>Find teammates for upcoming coding competitions</p>
            </div>
          </div>
          <div className="feature-item">
            <i className="fas fa-rocket"></i>
            <div>
              <h3>Launch Ideas Together</h3>
              <p>Turn concepts into reality with the right development partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;