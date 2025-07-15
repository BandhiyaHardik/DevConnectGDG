import { 
  signInWithPopup,
  signInWithRedirect,
  GithubAuthProvider, 
  signOut,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './config';

// Create GitHub auth provider
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user');
githubProvider.setCustomParameters({
  'allow_signup': 'true'
});

// Sign in with GitHub popup
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    const isNewUser = result.additionalUserInfo?.isNewUser;
    const githubUser = result.additionalUserInfo?.profile;
    
    // Save or update user in Firestore
    await saveUserToFirestore(user, githubUser, isNewUser);
    
    return user;
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

// Process redirect result
export const processRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    // User successfully signed in
    const user = result.user;
    const credential = GithubAuthProvider.credentialFromResult(result);
    const isNewUser = result.additionalUserInfo?.isNewUser;
    const githubUser = result.additionalUserInfo?.profile;
    
    // Save or update user in Firestore
    await saveUserToFirestore(user, githubUser, isNewUser);
    
    return user;
  } catch (error) {
    console.error("Error processing redirect result:", error);
    throw error;
  }
};

// Helper function to save user to Firestore
const saveUserToFirestore = async (user, githubUser, isNewUser) => {
  const userRef = doc(firestore, 'users', user.uid);
  
  // Check if user document already exists
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists() || isNewUser) {
    // Create new user document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || githubUser?.name || '',
      photoURL: githubUser?.avatar_url || user.photoURL || '',
      githubUsername: githubUser?.login || '',
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      onboardingComplete: false,
      // Default values for new users
      bio: '',
      location: githubUser?.location || '',
      technologies: [],
      lookingFor: [],
      experience: '',
      profileVisibility: 'public'
    });
    
    console.log("New user profile created in Firestore");
  } else {
    // Update existing user document
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Update these fields if they might have changed
      displayName: user.displayName || githubUser?.name || userDoc.data().displayName,
      photoURL: githubUser?.avatar_url || user.photoURL || userDoc.data().photoURL,
      email: user.email || userDoc.data().email
    });
    
    console.log("Existing user profile updated in Firestore");
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Check user inactivity
export const checkUserInactivity = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // If lastLoginAt exists and is more than a month ago
      if (userData.lastLoginAt) {
        const lastLogin = userData.lastLoginAt.toDate();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        if (lastLogin < oneMonthAgo) {
          console.log('User has been inactive for over a month, logging out');
          await signOut(auth);
          return true; // User was inactive and logged out
        }
      }
      
      // Update the last login timestamp
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
    return false; // User is active
  } catch (error) {
    console.error("Error checking user inactivity:", error);
    return false;
  }
};

export { auth };