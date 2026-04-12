'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  username: string | null;
  loading: boolean;
  error: string | null;
  signup: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get username from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (err) {
          console.error('Error fetching username:', err);
        }
      } else {
        setUser(null);
        setUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (usernameInput: string, password: string) => {
    try {
      setError(null);
      
      if (!usernameInput.trim()) {
        throw new Error('Username is required');
      }
      
      // Check if username already exists in Firestore
      const usersCollection = collection(db, 'users');
      const usernameQuery = query(usersCollection, where('username', '==', usernameInput.toLowerCase()));
      const snapshot = await getDocs(usernameQuery);
      
      if (!snapshot.empty) {
        throw new Error('Username already in use');
      }
      
      const email = `${usernameInput}@scoretracker.local`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store username in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: usernameInput.toLowerCase(),
        email: email,
        createdAt: new Date(),
      });
      
      setUsername(usernameInput);
    } catch (err: any) {
      let errorMessage = 'Signup failed';
      
      if (err.message === 'Username already in use') {
        errorMessage = 'Username already in use';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Username already in use';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (usernameInput: string, password: string) => {
    try {
      setError(null);
      
      if (!usernameInput.trim()) {
        throw new Error('Username is required');
      }
      
      const email = `${usernameInput.toLowerCase()}@scoretracker.local`;
      await signInWithEmailAndPassword(auth, email, password);
      setUsername(usernameInput);
    } catch (err: any) {
      let errorMessage = 'Login failed';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Username not found';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid username or password';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUsername(null);
      localStorage.removeItem('activeGameId');
      localStorage.removeItem('activeSportKey');
    } catch (err) {
      setError('Logout failed');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, username, loading, error, signup, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
