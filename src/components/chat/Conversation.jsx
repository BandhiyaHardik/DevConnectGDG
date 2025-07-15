import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { getMessages, sendMessage, markMessagesAsRead } from '../../services/chatService';
import { formatDistanceToNow } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import './Conversation.css';

const Conversation = () => {
  const { conversationId } = useParams();
  const { user, updateActivity } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Get conversation details and messages
  useEffect(() => {
    if (!conversationId || !user) return;
    
    const loadConversation = async () => {
      try {
        // Get conversation document
        const conversationDoc = await getDoc(doc(firestore, 'conversations', conversationId));
        
        if (!conversationDoc.exists()) {
          setError('Conversation not found');
          setLoading(false);
          return;
        }
        
        const conversationData = conversationDoc.data();
        
        // Find the other user's ID
        const otherUserId = conversationData.participants.find(id => id !== user.uid);
        
        if (otherUserId) {
          // Get the other user's details
          const userDoc = await getDoc(doc(firestore, 'users', otherUserId));
          if (userDoc.exists()) {
            setOtherUser({ id: userDoc.id, ...userDoc.data() });
          }
        }
        
        // Subscribe to messages with real-time updates
        const unsubscribe = getMessages(conversationId, async (messagesList) => {
          setMessages(messagesList);
          setLoading(false);
          
          // Mark messages as read
          await markMessagesAsRead(conversationId, user.uid);
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Failed to load conversation');
        setLoading(false);
      }
    };
    
    // Update user activity
    updateActivity();
    
    const unsubscribe = loadConversation();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [conversationId, user, updateActivity]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !conversationId) return;
    
    try {
      await sendMessage(conversationId, user.uid, newMessage.trim());
      setNewMessage('');
      // Update user activity when sending a message
      updateActivity();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };
  
  if (loading) {
    return (
      <div className="conversation-loading">
        <div className="spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="conversation-error">{error}</div>;
  }
  
  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <button 
          className="back-button"
          onClick={() => navigate('/chat')}
        >
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        
        <div className="conversation-user">
          {otherUser?.photoURL ? (
            <img src={otherUser.photoURL} alt={otherUser.displayName} />
          ) : (
            <div className="header-default-avatar">
              {otherUser?.displayName?.charAt(0) || '?'}
            </div>
          )}
          <h3>{otherUser?.displayName || 'Chat'}</h3>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages-yet">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => {
            const isSender = message.sentBy === user.uid;
            return (
              <div 
                key={message.id} 
                className={`message ${isSender ? 'sent' : 'received'}`}
              >
                <div className="message-bubble">
                  {message.text}
                </div>
                <div className="message-info">
                  {message.timestamp && (
                    <span className="message-time">
                      {formatDistanceToNow(new Date(message.timestamp.toDate()), {
                        addSuffix: true
                      })}
                    </span>
                  )}
                  {isSender && (
                    <span className="message-status">
                      {message.read ? 'Read' : 'Sent'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;