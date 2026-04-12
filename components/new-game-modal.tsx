'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { SportKey, SPORTS } from '@/lib/sports-config';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSport?: SportKey;
}

export function NewGameModal({ isOpen, onClose, defaultSport = 'basketball' }: NewGameModalProps) {
  const { startGame, setSportKey } = useGame();
  const [selectedSport, setSelectedSport] = useState<SportKey>(defaultSport);
  const [gameLabel, setGameLabel] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [guestTeam, setGuestTeam] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      await startGame(selectedSport, homeTeam || 'Home', guestTeam || 'Guest', gameLabel);
      setSportKey(selectedSport);
      onClose();
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border-strong rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gold mb-6">New Game</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-ink mb-2">Game Label (Optional)</label>
          <input
            type="text"
            value={gameLabel}
            onChange={(e) => setGameLabel(e.target.value)}
            placeholder="e.g., Finals, Practice, Friendly Match"
            className="w-full px-3 py-2 bg-black/50 border border-border rounded-lg text-ink placeholder-muted"
          />
          <p className="text-xs text-muted mt-1">Give this game a name to identify it later</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-ink mb-2">Sport</label>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as SportKey)}
            className="w-full px-3 py-2 bg-black/50 border border-border rounded-lg text-ink"
          >
            {Object.entries(SPORTS).map(([key, sport]) => (
              <option key={key} value={key}>{sport.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-ink mb-2">Home Team</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="Home"
            className="w-full px-3 py-2 bg-black/50 border border-border rounded-lg text-ink"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-ink mb-2">Guest Team</label>
          <input
            type="text"
            value={guestTeam}
            onChange={(e) => setGuestTeam(e.target.value)}
            placeholder="Guest"
            className="w-full px-3 py-2 bg-black/50 border border-border rounded-lg text-ink"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start'}
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
  );
}
