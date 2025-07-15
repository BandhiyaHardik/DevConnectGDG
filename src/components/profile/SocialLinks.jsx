import React from 'react';
import './SocialLinks.css';

const SocialLinks = ({ socialLinks, isEditMode, onSocialLinkChange }) => {
  // Function to copy GitHub username to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('GitHub username copied to clipboard!');
  };
  
  return (
    <div className="social-links-section">
      <h2>GitHub</h2>
      
      <div className="social-links-content">
        {isEditMode ? (
          <div className="social-links-form">
            <div className="form-group">
              <label htmlFor="github">
                <i className="fab fa-github"></i> GitHub Username
              </label>
              <input
                type="text"
                id="github"
                name="github"
                value={socialLinks.github}
                onChange={onSocialLinkChange}
                placeholder="username"
              />
            </div>
          </div>
        ) : (
          <div className="social-links-display">
            {socialLinks.github ? (
              <div className="links-list">
                <div className="social-handle github">
                  <i className="fab fa-github"></i>
                  <span className="handle-text">{socialLinks.github}</span>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopy(socialLinks.github)}
                    title="Copy username"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-links">
                No GitHub username added
              </div>
            )}
          </div>
        )}
      </div>
      
      {isEditMode && (
        <div className="github-info">
          <p>
            <i className="fas fa-info-circle"></i> Your GitHub username helps verify your developer status and showcase your code contributions.
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;