import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { useFirebase } from '../../contexts/FirebaseContext';
import './Onboarding.css';

const Onboarding = () => {
  const { user, profile, refreshProfile } = useFirebase();
  const navigate = useNavigate();
  
  // Form state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // User data state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [lookingFor, setLookingFor] = useState([]);
  const [experience, setExperience] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([]);
  
  // Tech options
  const techOptions = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 
    'Node.js', 'Express', 'Python', 'Django', 'Flask',
    'Ruby', 'Rails', 'PHP', 'Laravel', 'Java', 'Spring',
    'C#', '.NET', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML/CSS', 'Sass', 'Tailwind', 'Bootstrap', 'Firebase',
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
    'GraphQL', 'REST', 'MongoDB', 'PostgreSQL', 'MySQL',
  ];
  
  // Looking for options
  const lookingForOptions = [
    'Project Collaboration',
    'Hackathon Partners',
    'Code Reviews',
    'Mentorship',
    'Learning Partners',
    'Open Source Contribution',
    'Networking',
    'Job Opportunities',
  ];
  
  // Load data from profile if available
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || user?.displayName || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setTechnologies(profile.technologies || []);
      setLookingFor(profile.lookingFor || []);
      setExperience(profile.experience || '');
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setGithubUsername(profile.githubUsername || '');
    }
  }, [profile, user]);
  
  const handleTechToggle = (tech) => {
    setTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };
  
  const handleLookingForToggle = (option) => {
    setLookingFor(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };
  
  const handleNextStep = () => {
    if (step === 1 && !displayName) {
      setError('Please enter your name');
      return;
    }
    
    if (step === 3 && technologies.length === 0) {
      setError('Please select at least one technology');
      return;
    }
    
    setError('');
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };
  
  const handleCompleteOnboarding = async () => {
    try {
      setSubmitting(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Create profile data object with all form fields
      const profileData = {
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        technologies,
        experience,
        lookingFor,
        bio,
        githubUsername,
        location,
        onboardingComplete: true,
        updatedAt: serverTimestamp()
      };
      
      const userRef = doc(firestore, 'users', user.uid);
      
      // Check if document exists first
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(userRef, profileData);
      } else {
        // Document doesn't exist, create it
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          ...profileData
        });
      }
      
      // Refresh the profile in context - use your existing refreshProfile function
      await refreshProfile();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`progress-step ${step >= i ? 'active' : ''}`}
                onClick={() => i < step && setStep(i)}
              >
                {i}
              </div>
            ))}
          </div>
          <h2>Set up your profile<span className="text-accent">.</span></h2>
          <p>Let's create your developer profile</p>
        </div>
        
        {error && (
          <div className="onboarding-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
        
        {step === 1 && (
          <div className="onboarding-step">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="displayName">Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="onboarding-step">
            <h3>Experience Level</h3>
            <p>Select your level of development experience</p>
            
            <div className="radio-group">
              <div 
                className={`radio-option ${experience === 'beginner' ? 'selected' : ''}`}
                onClick={() => setExperience('beginner')}
              >
                <div className="radio-icon">
                  {experience === 'beginner' ? <i className="fas fa-check-circle"></i> : <i className="far fa-circle"></i>}
                </div>
                <div className="radio-content">
                  <h4>Beginner</h4>
                  <p>Less than 1 year of experience</p>
                </div>
              </div>
              
              <div 
                className={`radio-option ${experience === 'intermediate' ? 'selected' : ''}`}
                onClick={() => setExperience('intermediate')}
              >
                <div className="radio-icon">
                  {experience === 'intermediate' ? <i className="fas fa-check-circle"></i> : <i className="far fa-circle"></i>}
                </div>
                <div className="radio-content">
                  <h4>Intermediate</h4>
                  <p>1-3 years of experience</p>
                </div>
              </div>
              
              <div 
                className={`radio-option ${experience === 'advanced' ? 'selected' : ''}`}
                onClick={() => setExperience('advanced')}
              >
                <div className="radio-icon">
                  {experience === 'advanced' ? <i className="fas fa-check-circle"></i> : <i className="far fa-circle"></i>}
                </div>
                <div className="radio-content">
                  <h4>Advanced</h4>
                  <p>3-5 years of experience</p>
                </div>
              </div>
              
              <div 
                className={`radio-option ${experience === 'expert' ? 'selected' : ''}`}
                onClick={() => setExperience('expert')}
              >
                <div className="radio-icon">
                  {experience === 'expert' ? <i className="fas fa-check-circle"></i> : <i className="far fa-circle"></i>}
                </div>
                <div className="radio-content">
                  <h4>Expert</h4>
                  <p>5+ years of experience</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="onboarding-step">
            <h3>Technologies</h3>
            <p>Select the technologies you work with (at least one)</p>
            
            <div className="tech-badges-group">
              {techOptions.map(tech => (
                <button
                  key={tech}
                  type="button"
                  className={`tech-badge${technologies.includes(tech) ? ' selected' : ''}`}
                  onClick={() => handleTechToggle(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="onboarding-step">
            <h3>What are you looking for?</h3>
            <p>Select all that apply</p>
            <div className="lookingfor-badges-group">
              {lookingForOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`lookingfor-badge${lookingFor.includes(option) ? ' selected' : ''}`}
                  onClick={() => handleLookingForToggle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="onboarding-actions">
          {step > 1 && (
            <button 
              onClick={handlePrevStep}
              className="btn-secondary"
              disabled={loading}
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={handleNextStep}
              className="btn-primary"
              disabled={loading}
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleCompleteOnboarding}
              className="btn-primary"
              disabled={loading}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  <span>Saving...</span>
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;