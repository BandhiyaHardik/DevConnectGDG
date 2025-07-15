import React, { useState, useRef } from "react";
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import "./CardStack.css";

const CardStack = ({ profiles = [], onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gone] = useState(() => new Set());
  
  // Check if profiles exist and have length before trying to use them
  if (!profiles || profiles.length === 0) {
    return (
      <div className="card-stack">
        <div className="empty-state">
          <h3>No profiles found</h3>
          <p>There are no more developers to show right now. Check back later!</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="card-stack">
        <div className="empty-state">
          <h3>No more profiles</h3>
          <p>You've viewed all available developers. Check back later for more!</p>
          <button className="btn-primary" onClick={() => setCurrentIndex(0)}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-stack">
      {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
        <Card 
          key={profile.id} 
          profile={profile} 
          index={index}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
          onSwipe={onSwipe}
          gone={gone}
        />
      ))}
    </div>
  );
};

const Card = ({ profile, index, setCurrentIndex, currentIndex, onSwipe, gone }) => {
  const [props, api] = useSpring(() => ({ 
    x: 0, 
    y: 0, 
    rotation: 0,
    scale: 1,
    config: { friction: 50, tension: 500 }
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], direction: [dx], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = dx < 0 ? -1 : 1;
      
      if (!down && trigger) {
        gone.add(index);
        const direction = dir === 1 ? 'right' : 'left';
        onSwipe?.(profile, direction);
        setCurrentIndex(i => i + 1);
      }
      
      api.start({ 
        x: down ? mx : 0, 
        rotation: down ? mx / 20 : 0,
        scale: down ? 1.05 : 1,
        immediate: down 
      });
    }
  });

  return (
    <animated.div 
      {...bind()} 
      style={{ 
        x: props.x, 
        rotate: props.rotation, 
        scale: props.scale,
        zIndex: 1000 - index
      }}
      className="profile-card"
    >
      <div className="card-overlay">
        <div className="swipe-info left">NOPE</div>
        <div className="swipe-info right">CONNECT</div>
      </div>

      {profile.photoURL && (
        <img src={profile.photoURL} alt={profile.displayName} className="profile-image" />
      )}
      
      <div className="profile-info">
        <div className="profile-name-role">
          <h2 className="profile-name">{profile.displayName}</h2>
          <span className="profile-role">{profile.role}</span>
        </div>
        
        <p className="profile-location">{profile.location}</p>
        <p className="profile-bio">{profile.bio || "No bio provided"}</p>
        
        {profile.skills && profile.skills.length > 0 && (
          <div className="profile-skills">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>
        )}
        
        <div className="profile-details">
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>Looking for:</strong> {profile.lookingFor}</p>
        </div>
      </div>
    </animated.div>
  );
};

export default CardStack;