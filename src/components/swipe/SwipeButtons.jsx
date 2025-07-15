import React from "react";
import "./SwipeButtons.css";

const SwipeButtons = ({ onSwipe }) => {
  // The active card would be managed by the parent component
  return (
    <div className="swipe-buttons">
      <button 
        className="swipe-button reject"
        onClick={() => onSwipe(null, 'left')}
        aria-label="Reject"
      >
        <i className="fas fa-times"></i>
      </button>
      
      <button 
        className="swipe-button superlike"
        onClick={() => onSwipe(null, 'up')}
        aria-label="Super Like"
      >
        <i className="fas fa-star"></i>
      </button>
      
      <button 
        className="swipe-button like"
        onClick={() => onSwipe(null, 'right')}
        aria-label="Like"
      >
        <i className="fas fa-check"></i>
      </button>
    </div>
  );
};

export default SwipeButtons;