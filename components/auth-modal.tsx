'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const { login, signup, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Check if username already exists (real-time as user types)
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameTaken(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to check after 500ms of not typing
    debounceTimer.current = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const usersCollection = collection(db, 'users');
        const usernameQuery = query(usersCollection, where('username', '==', username.toLowerCase()));
        const snapshot = await getDocs(usernameQuery);
        setUsernameTaken(!snapshot.empty);
      } catch (err) {
        console.error('Error checking username:', err);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [username, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password.trim()) {
      return;
    }

    if (mode === 'signup' && usernameTaken) {
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        await signup(username, password);
      } else {
        await login(username, password);
      }
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setUsernameTaken(false);
      onClose();
    } catch (err) {
      console.error(`${mode} failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    clearError();
    setMode(mode === 'login' ? 'signup' : 'login');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setUsernameTaken(false);
    setCheckingUsername(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-strong rounded-lg p-6 md:p-8 w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold text-gold mb-4 md:mb-6">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-ink mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className={`w-full px-3 py-2 text-sm bg-black/50 border rounded-lg text-ink placeholder-muted ${
                mode === 'signup' && username.trim()
                  ? usernameTaken
                    ? 'border-red-500'
                    : 'border-green-500'
                  : 'border-border'
              }`}
              disabled={loading}
              required
            />
            
            {mode === 'signup' && username.trim() && (
              <div className="mt-2 text-xs md:text-sm font-semibold">
                {checkingUsername ? (
                  <div className="text-muted">✓ Checking username...</div>
                ) : usernameTaken ? (
                  <div className="text-red-400">✗ This username has already been taken</div>
                ) : (
                  <div className="text-green-400">✓ Username available</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-ink mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted"
              disabled={loading}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs md:text-sm font-semibold text-ink mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted"
                disabled={loading}
                required
              />
            </div>
          )}

          {error && (
            <div className="text-xs md:text-sm p-3 rounded bg-red-600/30 text-red-200 font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'signup' && (usernameTaken || checkingUsername))}
            className="w-full px-4 py-2 text-sm md:text-base bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-muted">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-gold hover:text-gold-2 font-semibold"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-gold hover:text-gold-2 font-semibold"
              >
                Login
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 border border-border rounded-lg text-ink hover:bg-black/50"
        >
          Close
        </button>
      </div>
    </div>
  );
}
