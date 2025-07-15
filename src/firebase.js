// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyAhv3VuSPobg-l7QD1ytZSYsL-4BT4PM",
  authDomain: "devconnectgdg.firebaseapp.com",
  projectId: "devconnectgdg",
  storageBucket: "devconnectgdg.firebasestorage.app",
  messagingSenderId: "1099164187989",
  appId: "1:1099164187989:web:a8a2a1d4bf45005ecd03dc",
  measurementId: "G-Q4PVZM8SPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);