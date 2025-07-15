import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

/**
 * Get all conversations for a user with real-time updates
 */
export const getConversations = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(firestore, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, async (snapshot) => {
    const conversations = [];
    

    const conversationPromises = snapshot.docs.map(async (docSnap) => {
      const conversationData = { id: docSnap.id, ...docSnap.data() };
      const otherUserId = conversationData.participants.find(id => id !== userId);

      if (otherUserId) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', otherUserId));
          if (userDoc.exists()) {
            conversationData.otherUser = { id: userDoc.id, ...userDoc.data() };
          }
        } catch (err) {
          console.error('Error getting other user:', err);
        }
      }

      conversations.push(conversationData);
    });

    await Promise.all(conversationPromises);

    conversations.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis() || 0;
      const timeB = b.updatedAt?.toMillis() || 0;
      return timeB - timeA;
    });

    callback(conversations);
  });
};

/**
 * Get or create a conversation between two users
 */
export const getOrCreateConversation = async (currentUserId, otherUserId) => {
  const conversationsRef = collection(firestore, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', currentUserId)
  );
  const querySnapshot = await getDocs(q);

  // Find if a conversation exists with both users
  const existing = querySnapshot.docs.find(docSnap => {
    const participants = docSnap.data().participants;
    return participants.includes(currentUserId) && participants.includes(otherUserId);
  });

  if (existing) {
    return { id: existing.id, ...existing.data() };
  }

  // Create new conversation
  const newConversation = {
    participants: [currentUserId, otherUserId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null
  };

  const docRef = await addDoc(conversationsRef, newConversation);
  return { id: docRef.id, ...newConversation };
};

/**
 * Get messages for a conversation with real-time updates
 */
export const getMessages = (conversationId, callback) => {
  if (!conversationId) return () => {};

  const q = query(
    collection(firestore, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

/**
 * Send a new message
 */
export const sendMessage = async (conversationId, senderId, text) => {
  try {
    const newMessage = {
      conversationId,
      text,
      sentBy: senderId,
      read: false,
      timestamp: serverTimestamp()
    };

    const messageRef = await addDoc(collection(firestore, 'messages'), newMessage);

    // Update conversation's last message
    const conversationRef = doc(firestore, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        text,
        sentBy: senderId,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });

    return { id: messageRef.id, ...newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId, userId) => {
  try {
    const q = query(
      collection(firestore, 'messages'),
      where('conversationId', '==', conversationId),
      where('sentBy', '!=', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(docSnap => {
      return updateDoc(docSnap.ref, { read: true });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

/**
 * Get user chats with real-time updates
 */
export const getUserChats = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(firestore, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(chats);
  });
};