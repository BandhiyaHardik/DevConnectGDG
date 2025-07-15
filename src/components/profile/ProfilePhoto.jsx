import React, { useRef } from 'react';
import './ProfilePhoto.css';

const ProfilePhoto = ({ photos, isEditMode, onPhotoChange }) => {
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onPhotoChange(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-photos">
      <h2>Photos</h2>
      <div className="photos-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`Profile ${index + 1}`} />
            {isEditMode && index !== 0 && (
              <button className="remove-photo" title="Remove photo">
                <i className="fas fa-times"></i>
              </button>
            )}
            {index === 0 && <div className="main-photo-badge">Main</div>}
          </div>
        ))}
        
        {isEditMode && photos.length < 6 && (
          <div className="add-photo-item" onClick={triggerFileInput}>
            <div className="add-photo-content">
              <i className="fas fa-plus"></i>
              <span>Add Photo</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
      {isEditMode && (
        <div className="photo-tips">
          <p>
            <i className="fas fa-info-circle"></i> Tips: Upload clear, professional photos. 
            Your main photo will be shown first to other developers.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;