import React, { useState, useEffect, useRef } from 'react';
import './ChatThread.css';

const ChatThread = ({ conversation, messages, onSendMessage, currentUser, onBack }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };
  
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="chat-thread">
      <div className="chat-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <div className="chat-header-avatar">
          <img src={conversation.photoURL} alt={conversation.displayName} />
        </div>
        <div className="chat-header-info">
          <h3>{conversation.displayName}</h3>
          <span className="chat-header-subtitle">{conversation.role}</span>
        </div>
        <div className="chat-header-actions">
          <button className="chat-action-button" aria-label="Video call">
            <i className="fas fa-video"></i>
          </button>
          <button className="chat-action-button" aria-label="View profile">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="message-date-group">
            <div className="date-divider">
              <span>{formatMessageDate(dateMessages[0].timestamp)}</span>
            </div>

            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`message-container ${
                  message.sender === currentUser?.uid ? 'outgoing' : 'incoming'
                }`}
              >
                {message.sender !== currentUser?.uid && (
                  <div className="message-avatar">
                    <img src={conversation.photoURL} alt={conversation.displayName} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{message.text}</p>
                  </div>
                  <div className="message-info">
                    <span className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </span>
                    {message.sender === currentUser?.uid && (
                      <span className="message-status">
                        {message.read ? (
                          <i className="fas fa-check-double"></i>
                        ) : (
                          <i className="fas fa-check"></i>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <button 
          type="button" 
          className="chat-input-button" 
          aria-label="Add attachment"
        >
          <i className="fas fa-paperclip"></i>
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button 
          type="button" 
          className="chat-input-button" 
          aria-label="Add emoji"
        >
          <i className="far fa-smile"></i>
        </button>
        <button 
          type="submit" 
          className="chat-input-button send-button" 
          disabled={!messageText.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>

      {/* Code snippets panel - hidden by default */}
      <div className="code-snippets-panel hidden">
        <div className="panel-header">
          <h4>Code Snippets</h4>
          <button className="close-panel-button">×</button>
        </div>
        <div className="panel-content">
          <div className="snippet-list">
            <div className="snippet-item">
              <div className="snippet-preview">
                <pre><code>function hello() {"{"} console.log('Hello!'); {"}"}</code></pre>
              </div>
              <div className="snippet-actions">
                <button>Insert</button>
              </div>
            </div>
          </div>
          <button className="add-snippet-button">
            <i className="fas fa-plus"></i> Add New Snippet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;