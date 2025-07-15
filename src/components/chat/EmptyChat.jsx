import React from 'react';
import './EmptyChat.css';

const EmptyChat = () => {
  return (
    <div className="empty-chat">
      <div className="empty-chat-content">
        <i className="fas fa-comments empty-chat-icon"></i>
        <h3>Select a conversation</h3>
        <p>Choose a developer from the list to start chatting</p>
        <div className="empty-chat-tips">
          <h4>DevConnect Chat Tips:</h4>
          <ul>
            <li>Share code snippets using the paperclip button</li>
            <li>Collaborate on projects in real-time</li>
            <li>Schedule video calls for deeper technical discussions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;