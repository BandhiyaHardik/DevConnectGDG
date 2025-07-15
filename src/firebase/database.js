import { firestore, database } from './config';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, 
  arrayUnion, arrayRemove, query, where, orderBy, limit,
  serverTimestamp, deleteDoc
} from 'firebase/firestore';
import { ref, set, push, onValue, remove } from 'firebase/database';

// User Profile Functions
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile: ", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

// Match & Connection Functions
export const getPotentialMatches = async (userId, preferences) => {
  try {
    // Complex query logic to find potential matches based on preferences
    const usersRef = collection(firestore, 'users');
    
    // Example filters (adjust based on your app's requirements)
    const q = query(
      usersRef,
      where('uid', '!=', userId),
      // Add more filters based on preferences
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting potential matches: ", error);
    throw error;
  }
};

export const createMatch = async (userId, matchedUserId) => {
  try {
    // Create or update match record for current user
    const userMatchRef = doc(firestore, 'matches', userId);
    await setDoc(userMatchRef, {
      likes: arrayUnion(matchedUserId),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Check if this is a mutual match
    const matchUserRef = doc(firestore, 'matches', matchedUserId);
    const matchSnap = await getDoc(matchUserRef);
    
    if (matchSnap.exists() && matchSnap.data().likes && 
        matchSnap.data().likes.includes(userId)) {
      // It's a match! Create a connection
      const connectionId = [userId, matchedUserId].sort().join('_');
      const connectionRef = doc(firestore, 'connections', connectionId);
      await setDoc(connectionRef, {
        users: [userId, matchedUserId],
        createdAt: serverTimestamp(),
        lastMessage: null
      });
      return { isMatch: true, connectionId };
    }
    
    return { isMatch: false };
  } catch (error) {
    console.error("Error creating match: ", error);
    throw error;
  }
};

export const passOnProfile = async (userId, passedUserId) => {
  try {
    const userMatchRef = doc(firestore, 'matches', userId);
    await setDoc(userMatchRef, {
      passes: arrayUnion(passedUserId),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error passing on profile: ", error);
    throw error;
  }
};

// Chat Functions
export const getConnections = async (userId) => {
  try {
    const connectionsRef = collection(firestore, 'connections');
    const q = query(
      connectionsRef,
      where('users', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting connections: ", error);
    throw error;
  }
};

export const sendMessage = async (connectionId, userId, content) => {
  try {
    // Add message to Realtime Database (for better real-time performance)
    const messageRef = push(ref(database, `messages/${connectionId}`));
    await set(messageRef, {
      userId,
      content,
      timestamp: Date.now()
    });
    
    // Update last message in Firestore for quick access/listing
    const connectionRef = doc(firestore, 'connections', connectionId);
    await updateDoc(connectionRef, {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      lastMessageFrom: userId
    });
    
    return messageRef.key;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const listenToMessages = (connectionId, callback) => {
  const messagesRef = ref(database, `messages/${connectionId}`);
  return onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.data()
      });
    });
    callback(messages);
  });
};

// Additional helper functions as needed