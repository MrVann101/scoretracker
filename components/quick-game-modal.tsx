'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { SportKey, SPORTS } from '@/lib/sports-config';

interface QuickGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameStarted?: () => void;
  sport: SportKey;
}

export function QuickGameModal({ isOpen, onClose, onGameStarted, sport }: QuickGameModalProps) {
  const { startGame, setSportKey } = useGame();
  const [homeTeam, setHomeTeam] = useState('');
  const [guestTeam, setGuestTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!homeTeam.trim()) {
      setError('Home team name is required');
      return;
    }
    if (!guestTeam.trim()) {
      setError('Guest team name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await startGame(sport, homeTeam, guestTeam);
      setSportKey(sport);
      setHomeTeam('');
      setGuestTeam('');
      
      // Call the success callback if provided
      if (onGameStarted) {
        setTimeout(() => onGameStarted(), 500);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sportConfig = SPORTS[sport];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-strong rounded-lg p-6 md:p-8 w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold text-gold mb-2">{sportConfig.title}</h2>
        <p className="text-xs md:text-sm text-muted mb-4 md:mb-6">Enter team names to start</p>

        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-ink mb-2">Home Team Name</label>
            <input
              type="text"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              placeholder="e.g., Team A"
              className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-ink mb-2">Guest Team Name</label>
            <input
              type="text"
              value={guestTeam}
              onChange={(e) => setGuestTeam(e.target.value)}
              placeholder="e.g., Team B"
              className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-xs md:text-sm p-3 rounded bg-red-600/30 text-red-200 font-semibold">
              {error}
            </div>
          )}

          <div className="flex gap-2 md:gap-4 pt-3 md:pt-4">
            <button
              onClick={handleStart}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm md:text-base bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-ink hover:bg-black/50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
