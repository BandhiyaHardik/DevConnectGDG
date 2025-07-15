import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config';

export const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          
          // Get user profile from Firestore
          const userRef = doc(firestore, 'users', authUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setProfile(userData);
            
            // Check if onboarding is needed
            if (!userData.onboardingComplete) {
              console.log("User needs to complete onboarding");
              // You might want to redirect to onboarding page here
            }
          } else {
            console.error("User document doesn't exist in Firestore!");
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update user activity status
  const updateActivity = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        lastActive: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating user activity:", err);
    }
  };

  const refreshProfile = async () => {
    // Fetch the latest profile from Firestore and update state
    if (!user) return;
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setProfile(userSnap.data());
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    updateActivity,
    refreshProfile
  };

  return (
    <FirebaseContext.Provider value={{ currentUser: user, ...value }}>
      {children}
    </FirebaseContext.Provider>
  );
};