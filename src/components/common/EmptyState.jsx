import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon,
  title,
  description,
  actionText,
  onAction,
  loading,
  geminiHackathons
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      
      {actionText && onAction && (
        <button 
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}

      {!loading && geminiHackathons.length === 0 && (
        <div className="empty-state">No current hackathons found.</div>
      )}
    </div>
  );
};

export default EmptyState;