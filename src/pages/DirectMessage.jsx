import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import ChatMessages from '../components/chat/ChatMessages';
import './DirectMessage.css';

const DirectMessage = () => {
  const { userId } = useParams();
  const { user } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const findOrCreateConversation = async () => {
      try {
        if (!user || !userId) {
          setError("Missing user information");
          return;
        }
        
        // Don't allow messaging yourself
        if (user.uid === userId) {
          setError("You cannot message yourself");
          return;
        }
        
        // Check if the target user exists
        const targetUserRef = doc(firestore, 'users', userId);
        const targetUserSnap = await getDoc(targetUserRef);
        
        if (!targetUserSnap.exists()) {
          setError("User not found");
          return;
        }
        
        // Look for existing conversation between these users
        const q1 = query(
          collection(firestore, 'conversations'),
          where('participants', 'array-contains', user.uid)
        );
        
        const snapshot = await getDocs(q1);
        
        let existingConversation = null;
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.participants.includes(userId)) {
            existingConversation = {
              id: doc.id,
              ...data
            };
          }
        });
        
        // If conversation exists, redirect to it
        if (existingConversation) {
          console.log("Existing conversation found:", existingConversation.id);
          navigate(`/chat/${existingConversation.id}`);
          return;
        }
        
        // If no conversation exists, create one
        console.log("Creating new conversation");
        
        // First check if there's a match between these users
        const matchQuery1 = query(
          collection(firestore, 'likes'),
          where('fromUser', '==', user.uid),
          where('toUser', '==', userId)
        );
        
        const matchQuery2 = query(
          collection(firestore, 'likes'),
          where('fromUser', '==', userId),
          where('toUser', '==', user.uid)
        );
        
        const [likes1Snapshot, likes2Snapshot] = await Promise.all([
          getDocs(matchQuery1),
          getDocs(matchQuery2)
        ]);
        
        const isMatch = !likes1Snapshot.empty && !likes2Snapshot.empty;
        
        // Create a match if both users liked each other
        let matchId = null;
        
        if (isMatch) {
          const matchData = {
            users: [user.uid, userId],
            timestamp: serverTimestamp(),
            lastActivity: serverTimestamp()
          };
          
          const matchRef = await addDoc(collection(firestore, 'matches'), matchData);
          matchId = matchRef.id;
          console.log("Created match:", matchId);
        } else {
          console.log("No match exists between users");
        }
        
        // Create the conversation
        const conversationData = {
          participants: [user.uid, userId], // <-- Always both UIDs!
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          matchId
        };
        
        const conversationRef = await addDoc(collection(firestore, 'conversations'), conversationData);
        const conversationId = conversationRef.id;
        
        // If it's a match, add a system message
        if (isMatch) {
          await addDoc(collection(firestore, 'messages'), {
            conversationId,
            text: "You're now connected! Say hello 👋",
            sentBy: 'system',
            timestamp: serverTimestamp(),
            read: false
          });
        }
        
        // Redirect to the new conversation
        navigate(`/chat/${conversationId}?otherUserId=${userId}`);
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError("Failed to start conversation. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    findOrCreateConversation();
  }, [user, userId, navigate]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      // Add the message to the Firestore collection
      await addDoc(collection(firestore, 'messages'), {
        conversationId: userId, // Assuming userId is the conversation ID here
        text: input,
        sentBy: user.uid,
        timestamp: serverTimestamp(),
        read: false
      });
      
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Starting conversation...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/messages')}>
          Back to Messages
        </button>
      </div>
    );
  }
  
  const participants = messages[0]?.participants || [];
  let otherUid = participants.find(uid => uid !== user.uid);
  
  if (!otherUid && userId) {
    otherUid = userId;
  }

  return (
    <div className="direct-message-page">
      <div className="chat-header">
        <h3>Chat with {otherUid === "dummy-1" ? "Alex Kim" : "User"}</h3>
      </div>
      <ChatMessages messages={messages} currentUserId="me" />
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default DirectMessage;