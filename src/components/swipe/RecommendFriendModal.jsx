import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // adjust path if needed
import './RecommendFriendModal.css';

const RecommendFriendModal = ({ userId, isOpen, onClose, onRecommend }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [userName, setUserName] = useState('');
  // Mock friends data - replace with your real friends/connections
  const mockFriends = [
    { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  ];

  // Fetch user info from Firestore when modal opens or userId changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setGithubUsername('');
        setUserName('');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Prefer githubUsername from profile if present, else fallback to OAuth githubUsername
          let githubId = '';
          if (data.profileGithubUsername && data.profileGithubUsername.trim() !== '') {
            githubId = data.profileGithubUsername.trim();
          } else if (data.githubUsername && data.githubUsername.trim() !== '') {
            githubId = data.githubUsername.trim();
          }
          setGithubUsername(githubId);
          setUserName(data.displayName || data.name || 'User');
        } else {
          setGithubUsername('');
          setUserName('User');
        }
      } catch (err) {
        setGithubUsername('');
        setUserName('User');
      }
    };
    if (isOpen) fetchUserInfo();
  }, [userId, isOpen]);

  // Filter friends by search term
  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle recommend button click
  const handleRecommend = (friend) => {
    if (onRecommend) {
      onRecommend({ userId, userName, githubUsername }, friend);
    }
    // Optionally show a success message or close modal
  };

  if (!isOpen) return null;

  return (
    <div className="recommend-modal-overlay" onClick={onClose}>
      <div className="recommend-modal" onClick={e => e.stopPropagation()}>
        <div className="recommend-modal-header">
          <h3>
            Recommend {userName}
            {githubUsername && (
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
                style={{ marginLeft: 10, fontSize: '1rem', color: '#6366f1' }}
              >
                @{githubUsername}
              </a>
            )}
          </h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="recommend-modal-body">
          <p>Select friends to recommend this developer to:</p>
          
          <div className="search-friends">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="friends-list">
            {filteredFriends.length === 0 && (
              <div className="no-friends">No friends found.</div>
            )}
            {filteredFriends.map(friend => (
              <div key={friend.id} className="friend-item">
                <img src={friend.avatar} alt={friend.name} />
                <span>{friend.name}</span>
                <button
                  className="recommend-to-friend-btn"
                  onClick={() => handleRecommend(friend)}
                >
                  Recommend
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendFriendModal;