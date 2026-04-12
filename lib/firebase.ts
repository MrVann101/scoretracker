import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7SVaX35yO78uuZJ9mMox-ivWtj7v60Z8",
  authDomain: "score-tracker-7bfc7.firebaseapp.com",
  projectId: "score-tracker-7bfc7",
  storageBucket: "score-tracker-7bfc7.firebasestorage.app",
  messagingSenderId: "783826652978",
  appId: "1:783826652978:web:acb8549aba2c7468ab112b",
  measurementId: "G-NQJJV3CDC7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only in browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export default app;
