import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase/config';
import './EditProfile.css';

const EditProfile = ({ onCancel }) => {
  const { user, profile, refreshProfile } = useFirebase();
  const navigate = useNavigate();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLookingFor, setSelectedLookingFor] = useState([]);
  
  // Photo upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Available options
  const technologies = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel',
    'Ruby', 'Rails', 'Go', 'Rust', 'C#', '.NET', 'AWS', 'Azure',
    'GCP', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'MySQL', 'Firebase', 'Swift', 'Kotlin', 'Flutter', 'React Native'
  ];
  
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const lookingForOptions = [
    'Hackathon Partner', 'Project Collaborator', 'Mentor', 'Mentee',
    'Study Group', 'Code Review', 'Job Opportunities', 'Networking'
  ];
  
  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      // Split the display name into first and last name if available
      if (profile.firstName) {
        setFirstName(profile.firstName || '');
      } else if (profile.displayName) {
        const nameParts = profile.displayName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
      
      setLastName(profile.lastName || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setGithubUsername(profile.githubUsername || '');
      setSelectedTechnologies(profile.technologies || []);
      setSelectedExperience(profile.experience || '');
      setSelectedLookingFor(profile.lookingFor || []);
      
      // Set photo preview if user has a profile photo
      if (profile.photoURL) {
        setPhotoPreview(profile.photoURL);
      }
    }
  }, [profile]);
  
  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setPhotoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setError(null);
  };
  
  // Handle technology selection
  const handleTechnologyToggle = (tech) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };
  
  // Handle looking for options
  const handleLookingForToggle = (option) => {
    setSelectedLookingFor(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option) 
        : [...prev, option]
    );
  };
  
  // Upload photo to Firebase Storage
  const uploadPhoto = async () => {
    if (!photoFile) return null;
    
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `profile_${user.uid}_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, `profile_photos/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, photoFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error("Error uploading photo:", err);
      throw err;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Prepare update data
      const profileUpdates = {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        bio,
        location,
        githubUsername,
        technologies: selectedTechnologies,
        experience: selectedExperience,
        lookingFor: selectedLookingFor,
        updatedAt: serverTimestamp()
      };
      
      // Upload photo if changed
      if (photoFile) {
        const photoURL = await uploadPhoto();
        if (photoURL) {
          profileUpdates.photoURL = photoURL;
        }
      }
      
      // Update profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, profileUpdates);
      
      // Refresh profile context
      await refreshProfile();
      
      setSuccess(true);
      setTimeout(() => {
        if (onCancel) {
          onCancel();
        } else {
          navigate('/profile');
        }
      }, 1500);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <div className="edit-profile-photo">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" />
          ) : (
            <div className="default-avatar">
              {firstName?.charAt(0) || user?.email?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="edit-profile-info">
          <h1>
            {firstName || lastName
              ? `${firstName} ${lastName}`.trim()
              : user?.displayName || "Developer"}
          </h1>
          <p>{location || "Location not specified"}</p>
          {githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub: {githubUsername}
            </a>
          )}
          <label className="edit-profile-avatar-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            Change Photo
          </label>
        </div>
      </div>

      <div className="edit-profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="edit-profile-section">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="edit-profile-section">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="edit-profile-section">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>
          <div className="edit-profile-section">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div className="edit-profile-section">
            <label htmlFor="githubUsername">GitHub Username</label>
            <input
              type="text"
              id="githubUsername"
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
            />
          </div>
          <div className="edit-profile-section">
            <label>Experience Level</label>
            <div className="edit-profile-tags">
              {experienceLevels.map(level => (
                <span
                  key={level}
                  className={`edit-profile-tag${selectedExperience === level ? " selected" : ""}`}
                  onClick={() => setSelectedExperience(level)}
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
          <div className="edit-profile-section">
            <label>Technologies</label>
            <div className="edit-profile-tags">
              {technologies.map(tech => (
                <span
                  key={tech}
                  className={`edit-profile-tag${selectedTechnologies.includes(tech) ? " selected" : ""}`}
                  onClick={() => handleTechnologyToggle(tech)}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="edit-profile-section">
            <label>Looking For</label>
            <div className="edit-profile-tags">
              {lookingForOptions.map(option => (
                <span
                  key={option}
                  className={`edit-profile-tag${selectedLookingFor.includes(option) ? " selected" : ""}`}
                  onClick={() => handleLookingForToggle(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
          <div className="edit-profile-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;