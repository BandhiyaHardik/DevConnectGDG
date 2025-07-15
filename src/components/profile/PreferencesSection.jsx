import React from 'react';
import './PreferencesSection.css';

const PreferencesSection = ({ preferences, isEditMode, onPreferenceChange }) => {
  return (
    <div className="preferences-section">
      <h2>Looking For</h2>
      
      <div className="preferences-content">
        {isEditMode ? (
          <div className="preferences-form">
            <div className="preference-option">
              <input
                type="checkbox"
                id="skillDevelopment"
                name="skillDevelopment"
                checked={preferences.skillDevelopment}
                onChange={onPreferenceChange}
              />
              <label htmlFor="skillDevelopment">
                <div className="preference-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="preference-text">
                  <span>Skill Development</span>
                  <small>Find partners to learn and grow together</small>
                </div>
              </label>
            </div>
            
            <div className="preference-option">
              <input
                type="checkbox"
                id="lookingForWork"
                name="lookingForWork"
                checked={preferences.lookingForWork}
                onChange={onPreferenceChange}
              />
              <label htmlFor="lookingForWork">
                <div className="preference-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="preference-text">
                  <span>Work Opportunities</span>
                  <small>Open to job offers and projects</small>
                </div>
              </label>
            </div>
            
            <div className="preference-option">
              <input
                type="checkbox"
                id="freelancing"
                name="freelancing"
                checked={preferences.freelancing}
                onChange={onPreferenceChange}
              />
              <label htmlFor="freelancing">
                <div className="preference-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <div className="preference-text">
                  <span>Freelancing</span>
                  <small>Available for freelance opportunities</small>
                </div>
              </label>
            </div>
            
            <div className="preference-option">
              <input
                type="checkbox"
                id="techFriends"
                name="techFriends"
                checked={preferences.techFriends}
                onChange={onPreferenceChange}
              />
              <label htmlFor="techFriends">
                <div className="preference-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="preference-text">
                  <span>Tech Friends</span>
                  <small>Connect for advice and guidance</small>
                </div>
              </label>
            </div>
            
            <div className="preference-option">
              <input
                type="checkbox"
                id="hackathons"
                name="hackathons"
                checked={preferences.hackathons}
                onChange={onPreferenceChange}
              />
              <label htmlFor="hackathons">
                <div className="preference-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="preference-text">
                  <span>Hackathon Teams</span>
                  <small>Find teammates for hackathons</small>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="preferences-display">
            {Object.entries(preferences).some(([_, value]) => value) ? (
              <div className="active-preferences">
                {preferences.skillDevelopment && (
                  <div className="preference-badge">
                    <i className="fas fa-graduation-cap"></i> Skill Development
                  </div>
                )}
                {preferences.lookingForWork && (
                  <div className="preference-badge">
                    <i className="fas fa-briefcase"></i> Work Opportunities
                  </div>
                )}
                {preferences.freelancing && (
                  <div className="preference-badge">
                    <i className="fas fa-laptop-code"></i> Freelancing
                  </div>
                )}
                {preferences.techFriends && (
                  <div className="preference-badge">
                    <i className="fas fa-users"></i> Tech Friends
                  </div>
                )}
                {preferences.hackathons && (
                  <div className="preference-badge">
                    <i className="fas fa-code"></i> Hackathon Teams
                  </div>
                )}
              </div>
            ) : (
              <div className="no-preferences">
                No preferences set
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesSection;