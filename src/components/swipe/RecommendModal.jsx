import React from 'react';
import './RecommendModal.css';

const RecommendModal = ({ profile, onClose }) => {
  if (!profile) return null;

  // Share logic using Web Share API or WhatsApp fallback
  const handleShare = () => {
    const shareText = `Check out ${profile.displayName} (${profile.github ? "@" + profile.github : ""}) on DevConnect!\n\n` +
      `Bio: ${profile.bio}\n` +
      `Tech stack: ${profile.technologies?.join(", ")}\n` +
      `Profile: https://github.com/${profile.githubUsername}`;

    if (navigator.share) {
      navigator.share({
        title: `DevConnect: ${profile.displayName}`,
        text: shareText,
        url: `https://github.com/${profile.githubUsername}`,
      });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="recommend-overlay" onClick={onClose}>
      <div className="recommend-modal" onClick={e => e.stopPropagation()}>
        <button className="recommend-close" onClick={onClose} title="Close">&times;</button>
        <img
          src={profile.photoURL || `https://github.com/${profile.github}.png`}
          alt={profile.displayName}
          className="recommend-profile-photo"
        />
        <div className="recommend-profile-name">{profile.displayName}</div>
        {profile.location && <div className="recommend-profile-location">{profile.location}</div>}
        <div className="recommend-profile-bio">{profile.bio}</div>
        <div className="recommend-profile-techs">
          {profile.technologies?.map((tech) => (
            <span key={tech} className="recommend-tech-tag">{tech}</span>
          ))}
        </div>
        <button className="recommend-share-btn" onClick={handleShare}>
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default RecommendModal;