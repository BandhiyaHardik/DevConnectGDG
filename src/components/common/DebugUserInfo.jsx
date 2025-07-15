import React from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';

const DebugUserInfo = () => {
  const { user, profile } = useFirebase();

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Debug: User Auth Info</h3>
      {user ? (
        <div>
          <p><strong>Auth User ID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Display Name:</strong> {user.displayName}</p>
          <p><strong>Photo URL:</strong> {user.photoURL ? 'Has photo' : 'No photo'}</p>
        </div>
      ) : (
        <p>No authenticated user</p>
      )}

      <h3>Debug: User Profile Info</h3>
      {profile ? (
        <div>
          <p><strong>Profile UID:</strong> {profile.uid}</p>
          <p><strong>Display Name:</strong> {profile.displayName}</p>
          <p><strong>Onboarding Complete:</strong> {profile.onboardingComplete ? 'Yes' : 'No'}</p>
          <p><strong>GitHub Username:</strong> {profile.githubUsername || 'Not set'}</p>
          <p><strong>Technologies:</strong> {profile.technologies?.join(', ') || 'None'}</p>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      ) : (
        <p>No profile data loaded</p>
      )}
    </div>
  );
};

export default DebugUserInfo;