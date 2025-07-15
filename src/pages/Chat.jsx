import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import './Chat.css';

const Chat = () => {
  const { conversationId } = useParams();
  const { user, profile } = useFirebase();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Improved scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (!shouldScrollToBottom) return;
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }, 100);
  }, [shouldScrollToBottom]);
  
  // Detect when user manually scrolls up
  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      // Only auto-scroll if user is already near the bottom
      setShouldScrollToBottom(isAtBottom);
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Load conversation and setup real-time listener
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const fetchConversation = async () => {
      try {
        setLoading(true);
        
        // Get conversation details
        const conversationRef = doc(firestore, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (!conversationSnap.exists()) {
          setError("Conversation not found");
          return;
        }
        
        const conversationData = conversationSnap.data();
        
        // Check if current user is part of this conversation
        if (!conversationData.participants.includes(user.uid)) {
          setError("You don't have access to this conversation");
          return;
        }
        
        // Get the other participant's profile
        const otherUserId = conversationData.participants.find(id => id !== user.uid);
        const otherUserRef = doc(firestore, 'users', otherUserId);
        const otherUserSnap = await getDoc(otherUserRef);
        
        if (otherUserSnap.exists()) {
          setOtherUser(otherUserSnap.data());
        }
        
        try {
          // Set up real-time listener for messages - with error handling
          const messagesQuery = query(
            collection(firestore, 'messages'),
            where('conversationId', '==', conversationId),
            orderBy('timestamp', 'asc')
          );
          
          const unsubscribe = onSnapshot(
            messagesQuery, 
            (querySnapshot) => {
              const fetchedMessages = [];
              querySnapshot.forEach((doc) => {
                fetchedMessages.push({
                  id: doc.id,
                  ...doc.data()
                });
              });
              
              setMessages(fetchedMessages);
              scrollToBottom();
              
              // Mark messages as read
              querySnapshot.docs.forEach(async (doc) => {
                const messageData = doc.data();
                if (!messageData.read && messageData.sentBy !== user.uid) {
                  await updateDoc(doc.ref, { read: true });
                }
              });
            },
            (error) => {
              // Handle snapshot listener errors
              console.error("Error in messages listener:", error);
              // Fall back to non-realtime method if index error
              if (error.code === 'failed-precondition') {
                fetchMessagesNonRealtime();
              } else {
                setError("Error loading messages. Please try again.");
              }
            }
          );
          
          return () => unsubscribe();
        } catch (err) {
          console.error("Error setting up messages listener:", err);
          // Fall back to non-realtime method
          fetchMessagesNonRealtime();
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [user, conversationId]);
  
  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      await addDoc(collection(firestore, 'messages'), {
        conversationId,
        text: newMessage,
        sentBy: user.uid,
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Update conversation's lastActivity
      await updateDoc(doc(firestore, 'conversations', conversationId), {
        updatedAt: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Go back to conversations list
  const handleBack = () => {
    navigate('/messages');
  };
  
  // Add this fallback function for when indexes aren't ready
  const fetchMessagesNonRealtime = async () => {
    try {
      console.log("Falling back to non-realtime messages fetch");
      
      // Get all messages for this conversation without ordering
      const simpleQuery = query(
        collection(firestore, 'messages'),
        where('conversationId', '==', conversationId)
      );
      
      const messagesSnapshot = await getDocs(simpleQuery);
      
      const fetchedMessages = [];
      messagesSnapshot.forEach((doc) => {
        fetchedMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort client-side by timestamp
      fetchedMessages.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.toMillis() - b.timestamp.toMillis();
      });
      
      setMessages(fetchedMessages);
      scrollToBottom();
      
      // Set up a timer to refresh messages periodically
      const interval = setInterval(async () => {
        const refreshSnapshot = await getDocs(simpleQuery);
        const refreshedMessages = [];
        refreshSnapshot.forEach((doc) => {
          refreshedMessages.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        refreshedMessages.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return a.timestamp.toMillis() - b.timestamp.toMillis();
        });
        
        setMessages(refreshedMessages);
        scrollToBottom();
      }, 3000);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error("Error in non-realtime fetch:", err);
      setError("Failed to load messages. Please try again.");
    }
  };
  
  // Scroll down button
  const scrollDownButton = (
    <button
      className={`scroll-to-bottom ${shouldScrollToBottom ? 'hidden' : ''}`}
      onClick={() => {
        setShouldScrollToBottom(true);
        scrollToBottom();
      }}
    >
      <i className="fas fa-arrow-down"></i>
    </button>
  );
  
  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
        
        {otherUser && (
          <div className="chat-user-info">
            <div className="chat-user-photo">
              {otherUser.photoURL ? (
                <img src={otherUser.photoURL} alt={otherUser.displayName} />
              ) : (
                <div className="default-avatar">
                  {otherUser.displayName?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="chat-user-details">
              <h3>{otherUser.displayName}</h3>
              {otherUser.githubUsername && (
                <p className="github-username">
                  <i className="fab fa-github"></i> {otherUser.githubUsername}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat messages */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {loading ? (
          <div className="loading-messages">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          <ChatMessages messages={messages} currentUserId={user.uid} />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading || error}
        />
        <button 
          type="submit" 
          disabled={loading || error || !newMessage.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
      
      {/* Scroll down button */}
      {scrollDownButton}
    </div>
  );
};

const ChatMessages = ({ messages, currentUserId }) => {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sentBy === currentUserId ? 'sent' : 'received'} ${message.sentBy === 'system' ? 'system' : ''}`}
        >
          <div className="message-content">
            <p>{message.text}</p>
            <span className="message-time">
              {formatMessageTime(message.timestamp)}
              {message.sentBy === currentUserId && (
                <span className={`read-status ${message.read ? 'read' : 'unread'}`}>
                  {message.read ? (
                    <i className="fas fa-check-double"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}
                </span>
              )}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

export default Chat;