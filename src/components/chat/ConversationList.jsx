import React from 'react';
import './ConversationList.css';

const ConversationList = ({ conversations, activeConversation, onSelectConversation, loading }) => {
  if (loading) {
    return (
      <div className="conversation-list-loading">
        <div className="spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversation-list-empty">
        <i className="fas fa-user-friends"></i>
        <p>No conversations yet</p>
        <p className="empty-subtext">Connect with developers to start chatting</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Show day of week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <div
          key={conversation.uid}
          className={`conversation-item ${
            activeConversation?.uid === conversation.uid ? 'active' : ''
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="conversation-avatar">
            <img src={conversation.photoURL} alt={conversation.displayName} />
            {conversation.unreadCount > 0 && (
              <span className="unread-badge">{conversation.unreadCount}</span>
            )}
          </div>
          <div className="conversation-info">
            <div className="conversation-header">
              <h3>{conversation.displayName}</h3>
              <span className="conversation-time">
                {formatTime(conversation.lastMessageTime)}
              </span>
            </div>
            <div className="conversation-preview">
              <p 
                className={conversation.unreadCount > 0 ? 'unread' : ''}
              >
                {conversation.lastMessage}
              </p>
              <div className="conversation-tags">
                <span className="tag">{conversation.role}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;