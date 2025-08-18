import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB9GAHVqzHgiEICdNWwy3j4YnsNqq6TjTw",
  authDomain: "xperiodkids.firebaseapp.com",
  projectId: "xperiodkids",
  storageBucket: "xperiodkids.appspot.com",
  messagingSenderId: "634661383546",
  appId: "1:634661383546:web:c35c7d8198a3791456bac3",
  measurementId: "G-NXXFE140ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;