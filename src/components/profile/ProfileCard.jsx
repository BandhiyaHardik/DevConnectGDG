import React from 'react';
import './ProfileCard.css'; // Assuming you will create a CSS file for styling

const ProfileCard = ({ user, onLike, onPass }) => {
    return (
        <div className="profile-card">
            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="profile-avatar" />
            <h2 className="profile-name">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="profile-role">{user.role}</p>
            <p className="profile-skills">{user.skills.join(', ')}</p>
            <p className="profile-location">{user.location}</p>
            <div className="profile-actions">
                <button onClick={() => onLike(user.id)} className="like-button">Like</button>
                <button onClick={() => onPass(user.id)} className="pass-button">Pass</button>
            </div>
        </div>
    );
};

export default ProfileCard;