import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchChat.css';

const MatchChat = ({ match, onClose, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  // Initialize with any existing messages from the match or an empty array
  const [messages, setMessages] = useState(match.messages || []);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  // Focus the input field when the chat opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'me',
      timestamp: new Date()
    };
    
    // Update local state first for immediate feedback
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageText('');
    
    // Call parent handler to update global state/send to backend
    if (onSendMessage) {
      onSendMessage(match.id, newMessage);
    }
    
    // Simulate response for demo purposes
    if (messages.length === 0) {
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          text: `Hi there! Thanks for connecting with me. I'm excited to discuss potential collaboration opportunities.`,
          sender: 'them',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        
        // Also update parent state
        if (onSendMessage) {
          onSendMessage(match.id, response);
        }
      }, 1500);
    }
  };
  
  const formatTime = (date) => {
    if (!(date instanceof Date)) {
      // Convert string to Date if needed
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="match-chat">
      <div className="chat-header">
        <img 
          src={match.avatar} 
          alt={match.name} 
          className="match-avatar"
          onClick={() => navigate(`/profile/${match.id}`)}
        />
        <div className="match-info">
          <h3>{match.name}</h3>
          <p className="match-subtitle">{match.title || 'Developer'}</p>
        </div>
        <button className="chat-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="new-match-prompt">
            <div className="match-icon">
              <i className="fas fa-code-branch"></i>
            </div>
            <h4>You connected with {match.name}!</h4>
            <p>Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={`chat-message ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}
            >
              {msg.sender === 'them' && (
                <img src={match.avatar} alt="" className="message-avatar" />
              )}
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Send a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          ref={inputRef}
        />
        <button 
          type="submit"
          disabled={!messageText.trim()}
          className="send-button"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default MatchChat;