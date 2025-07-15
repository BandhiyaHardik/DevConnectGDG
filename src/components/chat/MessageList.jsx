import React from 'react';
import './MessageList.css'; // Assuming you have a CSS file for styling

const MessageList = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.isUser ? 'user-message' : 'other-message'}`}>
                    <div className="message-avatar">
                        <img src={message.avatar} alt={`${message.sender}'s avatar`} />
                    </div>
                    <div className="message-content">
                        <span className="message-sender">{message.sender}</span>
                        <p className="message-text">{message.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;