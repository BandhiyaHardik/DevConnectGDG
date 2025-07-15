import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

export const useChat = (chatId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, 
      (snapshot) => {
        const messageData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messageData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (text) => {
    if (!text.trim() || !chatId || !userId) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text,
        senderId: userId,
        timestamp: serverTimestamp(),
        read: false
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    }
  };

  return { messages, loading, error, sendMessage };
};

export default useChat;