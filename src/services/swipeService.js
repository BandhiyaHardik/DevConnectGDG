import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  limit 
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

/**
 * Like a user profile
 * @param {string} currentUserId - ID of current user
 * @param {string} likedUserId - ID of user being liked
 * @returns {Promise<Object>} - Result with match status
 */
export const likeUser = async (currentUserId, likedUserId) => {
  try {
    // Check if this would create a match
    const likeRef = doc(firestore, 'likes', `${likedUserId}_${currentUserId}`);
    const likeDoc = await getDoc(likeRef);
    
    // Create the like document
    await setDoc(doc(firestore, 'likes', `${currentUserId}_${likedUserId}`), {
      fromUser: currentUserId,
      toUser: likedUserId,
      timestamp: serverTimestamp()
    });
    
    // If the other user already liked current user, it's a match!
    if (likeDoc.exists()) {
      // Create a match
      const matchData = {
        users: [currentUserId, likedUserId],
        timestamp: serverTimestamp(),
        lastActivity: serverTimestamp()
      };
      
      const matchRef = await addDoc(collection(firestore, 'matches'), matchData);
      
      // Create a conversation for the match
      const conversationData = {
        participants: [currentUserId, likedUserId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        matchId: matchRef.id
      };
      
      const conversationRef = await addDoc(collection(firestore, 'conversations'), conversationData);
      
      // Create a welcome message
      await addDoc(collection(firestore, 'messages'), {
        conversationId: conversationRef.id,
        text: "You're now connected! Say hello 👋",
        sentBy: 'system',
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Create notifications for both users
      await createNotification(currentUserId, 'match', {
        matchId: matchRef.id,
        conversationId: conversationRef.id,
        userId: likedUserId
      });
      
      await createNotification(likedUserId, 'match', {
        matchId: matchRef.id,
        conversationId: conversationRef.id, 
        userId: currentUserId
      });
      
      // Return match status
      return { 
        liked: true, 
        match: true,
        matchId: matchRef.id,
        conversationId: conversationRef.id
      };
    }
    
    // Create notification for the liked user
    await createNotification(likedUserId, 'like', {
      fromUser: currentUserId,
      timestamp: serverTimestamp()
    });
    
    return { liked: true, match: false };
  } catch (error) {
    console.error("Error liking user:", error);
    throw error;
  }
};

/**
 * Skip/pass on a user profile
 * @param {string} currentUserId - ID of current user 
 * @param {string} skippedUserId - ID of user being skipped
 */
export const skipUser = async (currentUserId, skippedUserId) => {
  try {
    await setDoc(doc(firestore, 'skips', `${currentUserId}_${skippedUserId}`), {
      fromUser: currentUserId,
      toUser: skippedUserId,
      timestamp: serverTimestamp()
    });
    
    return { skipped: true };
  } catch (error) {
    console.error("Error skipping user:", error);
    throw error;
  }
};

/**
 * Create a notification
 * @param {string} userId - User to notify
 * @param {string} type - Type of notification (like, match)
 * @param {object} data - Notification data
 */
export const createNotification = async (userId, type, data) => {
  try {
    await addDoc(collection(firestore, 'notifications'), {
      userId,
      type,
      read: false,
      timestamp: serverTimestamp(),
      data
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * Get recommended profiles to swipe
 * @param {string} userId - Current user ID
 * @param {number} count - Number of profiles to get
 * @returns {Promise<Array>} - Array of profiles
 */
export const getRecommendedProfiles = async (userId, count = 10) => {
  try {
    // Get user preferences first
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const lookingFor = userData.lookingFor || [];
    const technologies = userData.technologies || [];
    
    // Get IDs of users current user has already liked or skipped
    const [likesSnapshot, skipsSnapshot] = await Promise.all([
      getDocs(query(collection(firestore, 'likes'), where('fromUser', '==', userId))),
      getDocs(query(collection(firestore, 'skips'), where('fromUser', '==', userId)))
    ]);
    
    const alreadyInteractedIds = new Set();
    likesSnapshot.forEach(doc => {
      const data = doc.data();
      alreadyInteractedIds.add(data.toUser);
    });
    
    skipsSnapshot.forEach(doc => {
      const data = doc.data();
      alreadyInteractedIds.add(data.toUser);
    });
    
    // Always exclude self
    alreadyInteractedIds.add(userId);
    
    // Build the query
    // First get all users we haven't interacted with yet
    const usersQuery = query(
      collection(firestore, 'users'),
      limit(50) // Get more than we need to filter
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    // Filter and sort profiles
    const profiles = [];
    usersSnapshot.forEach(doc => {
      const profile = { id: doc.id, ...doc.data() };
      
      // Skip if already interacted or if it's current user
      if (alreadyInteractedIds.has(profile.uid)) return;
      
      // Calculate match score based on technologies and what they're looking for
      let matchScore = 0;
      
      // Boost score for matching technologies
      if (technologies.length > 0 && profile.technologies) {
        const matchingTechs = technologies.filter(tech => 
          profile.technologies.includes(tech)
        );
        matchScore += matchingTechs.length * 10;
      }
      
      // Boost score for matching "looking for"
      if (lookingFor.length > 0 && profile.lookingFor) {
        const matchingLookingFor = lookingFor.filter(item => 
          profile.lookingFor.includes(item)
        );
        matchScore += matchingLookingFor.length * 5;
      }
      
      // Add the profile with its match score
      profiles.push({
        ...profile,
        matchScore
      });
    });
    
    // Sort by match score (highest first) and take requested count
    return profiles
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, count);
      
  } catch (error) {
    console.error("Error getting recommended profiles:", error);
    throw error;
  }
};

/**
 * Get a user's pending likes (people who liked them)
 * @param {string} userId - Current user ID
 * @returns {Promise<Array>} - Array of users who liked the current user
 */
export const getPendingLikes = async (userId) => {
  try {
    const q = query(
      collection(firestore, 'likes'),
      where('toUser', '==', userId)
    );
    
    const likesSnapshot = await getDocs(q);
    const pendingLikes = [];
    
    // For each like, get the user who liked
    const likePromises = likesSnapshot.docs.map(async (doc) => {
      const likeData = doc.data();
      
      // Check if this is a match already
      const reverseCheck = await getDoc(doc(firestore, 'likes', `${userId}_${likeData.fromUser}`));
      if (reverseCheck.exists()) {
        // This is a match, not a pending like
        return;
      }
      
      // Get the user profile
      const userDoc = await getDoc(doc(firestore, 'users', likeData.fromUser));
      if (userDoc.exists()) {
        pendingLikes.push({
          id: likeData.fromUser,
          timestamp: likeData.timestamp,
          ...userDoc.data()
        });
      }
    });
    
    await Promise.all(likePromises);
    
    // Sort by most recent first
    return pendingLikes.sort((a, b) => {
      return b.timestamp?.toMillis() - a.timestamp?.toMillis();
    });
    
  } catch (error) {
    console.error("Error getting pending likes:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of notification
 */
export const markNotificationRead = async (notificationId) => {
  try {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error("Error marking notification read:", error);
  }
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of notifications to get
 * @returns {Promise<Array>} - Array of notifications
 */
export const getNotifications = async (userId, limit = 20) => {
  try {
    const q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId),
      limit(limit)
    );
    
    const snapshot = await getDocs(q);
    const notifications = [];
    
    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return notifications.sort((a, b) => {
      return b.timestamp?.toMillis() - a.timestamp?.toMillis();
    });
    
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};