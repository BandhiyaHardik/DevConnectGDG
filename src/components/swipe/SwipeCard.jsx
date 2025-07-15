import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import './SwipeCard.css';

const SwipeCard = ({
  profile,
  onSwipe,
  stackPosition = 0,
  onExpand,
  expandInfo,
  onExpandEnd,
  swipeAction,
  onSwipeActionEnd
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Card rotation and indicators
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe && onSwipe('right', profile);
    } else if (info.offset.x < -100) {
      onSwipe && onSwipe('left', profile);
    }
  };

  // Animate swipe up for info (if needed)
  useEffect(() => {
    if (expandInfo) {
      x.set(0);
      y.set(-400);
      setTimeout(() => {
        y.set(0);
        if (onExpandEnd) onExpandEnd();
        if (onExpand) onExpand(profile);
      }, 400);
    }
    // eslint-disable-next-line
  }, [expandInfo]);

  // Animate card when swipeAction is set from parent
  useEffect(() => {
    if (!swipeAction) return;
    if (swipeAction === "left") {
      animate(x, -500, { duration: 0.35 }).then(() => {
        onSwipe && onSwipe('left', profile);
        x.set(0);
        if (onSwipeActionEnd) onSwipeActionEnd();
      });
    } else if (swipeAction === "right") {
      animate(x, 500, { duration: 0.35 }).then(() => {
        onSwipe && onSwipe('right', profile);
        x.set(0);
        if (onSwipeActionEnd) onSwipeActionEnd();
      });
    } else if (swipeAction === "up") {
      animate(y, -500, { duration: 0.35 }).then(() => {
        if (onExpand) onExpand(profile);
        y.set(0);
        if (onSwipeActionEnd) onSwipeActionEnd();
      });
    }
    // eslint-disable-next-line
  }, [swipeAction]);

  // Stack effect for cards behind the top one
  const getStackStyles = () => ({
    zIndex: 10 - stackPosition,
    scale: 1 - (stackPosition * 0.05),
    y: stackPosition * -10,
    opacity: stackPosition > 2 ? 0 : 1 - (stackPosition * 0.2)
  });

  return (
    <motion.div
      className="swipe-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{
        x,
        y,
        rotate,
        ...getStackStyles()
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Like/Skip/Info indicators */}
      <motion.div
        className="swipe-action-indicator like"
        style={{ opacity: swipeAction === "right" ? 1 : likeOpacity }}
      >
        <span>CONNECT</span>
      </motion.div>
      <motion.div
        className="swipe-action-indicator skip"
        style={{ opacity: swipeAction === "left" ? 1 : skipOpacity }}
      >
        <span>SKIP</span>
      </motion.div>
      <motion.div
        className="swipe-action-indicator info"
        style={{
          opacity: swipeAction === "up" ? 1 : 0,
          top: 38,
          left: '50%',
          transform: 'translateX(-50%) rotate(-8deg)',
          background: '#4299e1',
          border: '3px solid white',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 10,
          padding: '10px 22px',
          borderRadius: '7px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
          pointerEvents: 'none',
          fontSize: '1.15rem',
          letterSpacing: '1px'
        }}
      >
        <span>INFO</span>
      </motion.div>

      {/* Card content */}
      <div className="swipe-card-inner">
        <div className="swipe-card-photo">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt={profile.displayName} />
          ) : (
            <div className="default-avatar">
              {profile.displayName?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className="swipe-card-content">
          <h2>{profile.displayName || 'Developer'}</h2>
          {profile.location && (
            <p className="location">
              <i className="fas fa-map-marker-alt"></i> {profile.location}
            </p>
          )}
          {profile.bio && (
            <p className="bio">{profile.bio}</p>
          )}
          {profile.technologies?.length > 0 && (
            <div className="technologies">
              <span className="label">Technologies:</span>
              <div className="tech-tags">
                {profile.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

  
    </motion.div>
  );
};

export default SwipeCard;

