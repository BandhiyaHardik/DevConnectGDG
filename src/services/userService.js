import { db, storage } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Mock user service to simulate API calls

// Demo profile data
const mockProfile = {
  uid: 'user-123',
  displayName: 'Alex Johnson',
  photoURL: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
  bio: 'Full-stack developer with a passion for React and Node.js. Looking for hackathon teammates and interesting projects to collaborate on.',
  role: 'Senior Frontend Developer',
  location: 'San Francisco, CA',
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'GraphQL'],
  experience: '5-10 years',
  availabilityStatus: 'Open to collaborate',
  email: 'alex@example.com',
  phone: '(555) 123-4567',
  showEmail: true,
  showPhone: false,
  
  // Social links
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com/in/alexjohnson',
  portfolioUrl: 'https://alexjohnson.dev',
  stackoverflowUrl: 'https://stackoverflow.com/users/123456/alex',
  
  // Projects
  projects: [
    {
      name: 'TaskFlow',
      description: 'A productivity app that helps teams manage their projects with an intuitive Kanban interface.',
      url: 'https://taskflow-demo.netlify.app',
      technologies: ['React', 'Redux', 'Firebase', 'Styled Components']
    },
    {
      name: 'CodeChat',
      description: 'Real-time code sharing and collaboration platform for remote teams and pair programming.',
      url: 'https://github.com/alexj/codechat',
      technologies: ['WebSockets', 'Express', 'MongoDB', 'CodeMirror']
    }
  ],
  
  // Work experience
  workExperience: [
    {
      company: 'TechCorp Inc',
      title: 'Senior Frontend Developer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: 'Leading the frontend team in developing a SaaS platform used by over 50,000 customers.'
    },
    {
      company: 'DevStart',
      title: 'Frontend Developer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      description: 'Developed responsive web applications and contributed to the company\'s component library.'
    }
  ],
  
  // Education
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      startYear: '2014',
      endYear: '2018'
    }
  ],
  
  // Preferences
  lookingFor: ['Project partners', 'Hackathon teammates', 'Mentorship'],
  availableHours: '10+ hours/week',
  timezone: 'UTC-8 (Pacific)',
  contactPreference: 'email',
  
  // Privacy settings
  profileVisibility: 'public',
};

// Function to create a new user profile
export const createUserProfile = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, 'users'), userData);
        return { id: docRef.id, ...userData };
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw new Error("Could not create user profile");
    }
};

// Function to get all user profiles
export const getUserProfiles = async () => {
    try {
        const profiles = [];
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach((doc) => {
            profiles.push({ id: doc.id, ...doc.data() });
        });
        return profiles;
    } catch (error) {
        console.error("Error fetching user profiles: ", error);
        throw new Error("Could not fetch user profiles");
    }
};

// Function to filter user profiles based on criteria
export const filterUserProfiles = async (criteria) => {
    try {
        const profiles = [];
        const q = query(collection(db, 'users'), where('skills', 'array-contains', criteria.skill));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            profiles.push({ id: doc.id, ...doc.data() });
        });
        return profiles;
    } catch (error) {
        console.error("Error filtering user profiles: ", error);
        throw new Error("Could not filter user profiles");
    }
};

// Get user profile data
export const getUserProfile = async (userId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, return the mock profile
    return mockProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Profile data saved:', profileData);
    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  try {
    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile with the new picture URL
    await updateDoc(doc(db, 'users', userId), {
      photoURL: downloadURL,
      updatedAt: new Date().toISOString()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Search users by skills
export const searchUsersBySkills = async (skills) => {
  try {
    // This is a simplified implementation
    // For production, you would need a more sophisticated search approach
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => {
        if (!user.skills) return false;
        return skills.some(skill => 
          user.skills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Package all functions into a service object
const userService = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  searchUsersBySkills
};

export default userService;

// Simulate fetching matches
export const getUserMatches = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      uid: 'user-456',
      displayName: 'Sam Rivera',
      photoURL: 'https://ui-avatars.com/api/?name=Sam+Rivera&background=FF5733&color=fff',
      role: 'UX/UI Designer',
      location: 'Austin, TX',
      matchDate: '2023-07-01'
    },
    {
      uid: 'user-789',
      displayName: 'Jordan Lee',
      photoURL: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=27AE60&color=fff',
      role: 'Backend Developer',
      location: 'Chicago, IL',
      matchDate: '2023-06-28'
    }
  ];
};