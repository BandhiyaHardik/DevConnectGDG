import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';

// Mock data imports (replace with actual API calls in production)
import { getMockDevelopers } from '../services/mockData';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('preferences');
  const [preferences, setPreferences] = useState({
    lookingFor: {
      skillDevelopment: true,
      lookingForWork: true,
      freelancing: false,
      techFriends: true,
      hackathons: false
    },
    ageRange: [20, 50],
    maxDistance: 25,
    showMe: 'all',
    pushNotifications: true,
    emailNotifications: false
  });
  
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);
  const [devStories, setDevStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to load user data
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get mock likes (in a real app, these would come from your backend)
        const allDevs = getMockDevelopers();
        
        // Randomly select some developers as likes
        const mockLikes = allDevs.slice(0, 2);
        setLikes(mockLikes);
        
        // Randomly select other developers as passes
        const mockPasses = allDevs.slice(2);
        setPasses(mockPasses);
        
        // Mock dev stories
        setDevStories([
          {
            id: 1,
            title: "From Swipe to Startup",
            developers: ["Mia Chen", "Jack Thompson"],
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            story: "We matched on DevConnect and discovered we both wanted to solve the same problem. Six months later, our startup got seed funding!",
            techStack: ["React", "Node.js", "MongoDB"]
          },
          {
            id: 2,
            title: "Hackathon Champions",
            developers: ["Sophia Martinez", "David Kim"],
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
            story: "Connected through the app, formed a team for a local hackathon, and won first place with our accessibility tool for developers.",
            techStack: ["Python", "TensorFlow", "React Native"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handlePreferenceChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const handleLookingForToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      lookingFor: {
        ...prev.lookingFor,
        [preference]: !prev.lookingFor[preference]
      }
    }));
  };
  
  const renderSection = () => {
    switch(activeSection) {
      case 'preferences':
        return (
          <div className="settings-section" id="preferences-section">
            <h2>My Preferences</h2>
            
            <div className="setting-group">
              <h3>I'm looking for...</h3>
              <div className="looking-for-options">
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={preferences.lookingFor.skillDevelopment}
                      onChange={() => handleLookingForToggle('skillDevelopment')}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span>Skill Development</span>
                </label>
                
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={preferences.lookingFor.lookingForWork}
                      onChange={() => handleLookingForToggle('lookingForWork')}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span>Work Opportunities</span>
                </label>
                
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={preferences.lookingFor.freelancing}
                      onChange={() => handleLookingForToggle('freelancing')}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span>Freelancing</span>
                </label>
                
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={preferences.lookingFor.techFriends}
                      onChange={() => handleLookingForToggle('techFriends')}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span>Tech Friends</span>
                </label>
                
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={preferences.lookingFor.hackathons}
                      onChange={() => handleLookingForToggle('hackathons')}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span>Hackathon Teams</span>
                </label>
              </div>
            </div>
            
            <div className="setting-group">
              <h3>Discovery Settings</h3>
              
              <div className="setting-item">
                <label>Show Me</label>
                <div className="setting-controls">
                  <select 
                    value={preferences.showMe}
                    onChange={(e) => handlePreferenceChange('showMe', e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Men</option>
                    <option value="female">Women</option>
                  </select>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Maximum Distance</label>
                <div className="setting-controls range-control">
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={preferences.maxDistance}
                    onChange={(e) => handlePreferenceChange('maxDistance', parseInt(e.target.value))}
                  />
                  <span className="range-value">{preferences.maxDistance} km</span>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Age Range</label>
                <div className="setting-controls range-control age-range">
                  <div className="age-inputs">
                    <input 
                      type="number" 
                      min="18" 
                      max="65" 
                      value={preferences.ageRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const newRange = [...preferences.ageRange];
                        newRange[0] = value;
                        if (value > newRange[1]) newRange[1] = value;
                        handlePreferenceChange('ageRange', newRange);
                      }}
                    />
                    <span className="age-separator">to</span>
                    <input 
                      type="number" 
                      min="18" 
                      max="65" 
                      value={preferences.ageRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const newRange = [...preferences.ageRange];
                        newRange[1] = value;
                        if (value < newRange[0]) newRange[0] = value;
                        handlePreferenceChange('ageRange', newRange);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="setting-group">
              <h3>Notifications</h3>
              <div className="setting-item">
                <label>Push Notifications</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Email Notifications</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>
            </div>
            
            <div className="settings-actions">
              <button className="save-button">Save Changes</button>
            </div>
          </div>
        );
        
      case 'likes':
        return (
          <div className="settings-section" id="likes-section">
            <h2>Your Connections</h2>
            {loading ? (
              <div className="section-loading">
                <div className="settings-loader"></div>
                <p>Loading your connections...</p>
              </div>
            ) : likes.length > 0 ? (
              <div className="connection-grid">
                {likes.map(developer => (
                  <div className="connection-card" key={developer.id}>
                    <div className="connection-image">
                      <img src={developer.avatar} alt={developer.name} />
                    </div>
                    <div className="connection-info">
                      <h3>{developer.name}, {developer.age}</h3>
                      <p className="connection-title">{developer.title}</p>
                      <div className="connection-skills">
                        {developer.skills.slice(0, 3).map(skill => (
                          <span className="skill-tag" key={skill}>{skill}</span>
                        ))}
                      </div>
                      <div className="connection-actions">
                        <button className="message-btn">
                          <i className="fas fa-comment-alt"></i> Message
                        </button>
                        <button className="unmatch-btn">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-heart empty-icon"></i>
                <h3>No connections yet</h3>
                <p>When you match with other developers, they'll appear here.</p>
                <Link to="/swipe" className="start-swiping-btn">Start Swiping</Link>
              </div>
            )}
          </div>
        );
        
      case 'passes':
        return (
          <div className="settings-section" id="passes-section">
            <h2>Recent Passes</h2>
            <p className="section-description">Developers you've passed on in the last 30 days</p>
            
            {loading ? (
              <div className="section-loading">
                <div className="settings-loader"></div>
                <p>Loading your passes...</p>
              </div>
            ) : passes.length > 0 ? (
              <div className="passes-grid">
                {passes.map(developer => (
                  <div className="pass-card" key={developer.id}>
                    <div className="pass-image">
                      <img src={developer.avatar} alt={developer.name} />
                    </div>
                    <div className="pass-info">
                      <h3>{developer.name}, {developer.age}</h3>
                      <p className="pass-title">{developer.title}</p>
                      <button className="reconsider-btn">
                        <i className="fas fa-undo"></i> Reconsider
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-times-circle empty-icon"></i>
                <h3>No recent passes</h3>
                <p>When you pass on developers, they'll appear here for 30 days.</p>
              </div>
            )}
          </div>
        );
        
      case 'stories':
        return (
          <div className="settings-section" id="stories-section">
            <h2>Dev Stories</h2>
            <p className="section-description">Success stories from developers who connected through our platform</p>
            
            {loading ? (
              <div className="section-loading">
                <div className="settings-loader"></div>
                <p>Loading dev stories...</p>
              </div>
            ) : (
              <div className="stories-container">
                {devStories.map(story => (
                  <div className="story-card" key={story.id}>
                    <div className="story-image">
                      <img src={story.image} alt={story.title} />
                    </div>
                    <div className="story-content">
                      <h3 className="story-title">{story.title}</h3>
                      <div className="story-developers">
                        {story.developers.join(" & ")}
                      </div>
                      <p className="story-text">{story.story}</p>
                      <div className="story-tech-stack">
                        <span className="tech-stack-label">Tech Stack:</span>
                        {story.techStack.map(tech => (
                          <span className="tech-tag" key={tech}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="submit-story-card">
                  <h3>Share Your Story</h3>
                  <p>Found your perfect tech match through DevConnect? Tell us how you collaborated and what you built together!</p>
                  <button className="submit-story-btn">
                    <i className="fas fa-pen"></i> Submit Your Story
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'help':
        return (
          <div className="settings-section" id="help-section">
            <h2>Help Center</h2>
            
            <div className="faq-section">
              <div className="faq-item">
                <h3 className="faq-question">How does DevConnect matching work?</h3>
                <p className="faq-answer">DevConnect uses your preferences, skills, and interests to suggest potential collaborators. When both parties express interest, it's a match!</p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">Can I change my profile information?</h3>
                <p className="faq-answer">Yes! You can edit your profile by going to the Edit Profile section in settings. Update your skills, bio, and project interests anytime.</p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">How do I message my connections?</h3>
                <p className="faq-answer">Once you've matched with someone, they'll appear in your Connections tab. Click on the message button to start chatting.</p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">I want to report inappropriate behavior</h3>
                <p className="faq-answer">We take user safety seriously. Use the "Report" button on any profile to alert our moderation team about inappropriate content or behavior.</p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">How can I delete my account?</h3>
                <p className="faq-answer">To delete your account, go to Account Settings at the bottom of the Settings page and select "Delete Account". Note that this action cannot be undone.</p>
              </div>
            </div>
            
            <div className="help-contact">
              <h3>Still need help?</h3>
              <p>Our support team is available 24/7 to assist you with any questions or issues.</p>
              <button className="contact-support-btn">
                <i className="fas fa-envelope"></i> Contact Support
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings & Profile</h1>
        <p>Manage your preferences, connections and account settings</p>
      </div>
      
      <div className="settings-main">
        <div className="settings-nav">
          <div className={`nav-item ${activeSection === 'preferences' ? 'active' : ''}`} onClick={() => setActiveSection('preferences')}>
            <i className="fas fa-sliders-h"></i>
            <span>Preferences</span>
          </div>
          <div className={`nav-item ${activeSection === 'likes' ? 'active' : ''}`} onClick={() => setActiveSection('likes')}>
            <i className="fas fa-heart"></i>
            <span>Your Connections</span>
          </div>
          <div className={`nav-item ${activeSection === 'passes' ? 'active' : ''}`} onClick={() => setActiveSection('passes')}>
            <i className="fas fa-times-circle"></i>
            <span>Recent Passes</span>
          </div>
          <div className={`nav-item ${activeSection === 'stories' ? 'active' : ''}`} onClick={() => setActiveSection('stories')}>
            <i className="fas fa-book"></i>
            <span>Dev Stories</span>
          </div>
          <div className={`nav-item ${activeSection === 'help' ? 'active' : ''}`} onClick={() => setActiveSection('help')}>
            <i className="fas fa-question-circle"></i>
            <span>Help Center</span>
          </div>
        </div>
        <div className="settings-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;