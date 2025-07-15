import React, { useEffect } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, profile, loading } = useFirebase();

  useEffect(() => {}, [user, profile]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return <div className="error">Please sign in to view your profile</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-photo">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="Profile" />
          ) : (
            <div className="default-avatar">
              {profile.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.displayName || 'Developer'}</h1>
          <p className="profile-location">
            {profile.location || 'Location not specified'}
          </p>
          {profile.githubUsername && (
            <a
              href={`https://github.com/${profile.githubUsername}`}
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub: {profile.githubUsername}
            </a>
          )}
        </div>
      </div>

      {/* Move the Edit Profile button here */}
      <div style={{ margin: "0 0 24px 0", display: "flex", justifyContent: "center" }}>
        <Link
          to="/profile/edit"
          className="edit-profile-btn"
        >
              Edit Profile
        </Link>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          <p>{profile.bio || 'No bio provided yet.'}</p>
        </div>
        <div className="profile-section">
          <h2>Experience</h2>
          <p>{profile.experience || 'Not specified'}</p>
        </div>
        <div className="profile-section">
          <h2>Technologies</h2>
          {profile.technologies?.length > 0 ? (
            <div className="tech-tags">
              {profile.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          ) : (
            <p>No technologies specified</p>
          )}
        </div>
        <div className="profile-section">
          <h2>Looking For</h2>
          {profile.lookingFor?.length > 0 ? (
            <div className="looking-for-tags">
              {profile.lookingFor.map(item => (
                <span key={item} className="looking-for-tag">{item}</span>
              ))}
            </div>
          ) : (
            <p>Not specified</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;