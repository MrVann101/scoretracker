'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { PlayerControls } from '@/components/player-controls';

export function ActionPanel() {
  const { createOrUpdatePlayer, isGameActive } = useGame();

  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPlayer = async (team: 'home' | 'guest') => {
    const jersey = parseInt(jerseyNumber, 10);
    
    if (!playerName.trim()) {
      setStatus('Enter player name.');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    if (!jerseyNumber || jersey <= 0) {
      setStatus('Enter a valid jersey number (positive integer).');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    if (!isGameActive) {
      setStatus('Start a game first (New Game).');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setStatus(`Adding ${playerName} (#${jersey}) to ${team}...`);
      await createOrUpdatePlayer(team, jersey, playerName);
      setStatus(`Ready: controls created for ${team.charAt(0).toUpperCase() + team.slice(1)} #${jersey}.`);
      
      // Clear inputs
      setJerseyNumber('');
      setPlayerName('');
      
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error('Error adding player:', err);
      setStatus(`Error adding player: ${err}`);
      setTimeout(() => setStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" id="actionSection">
      <h2 className="card-title">Action Panel</h2>

      <div className="action-panel-body grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left: Add Player Form */}
        <div className="action-panel-left">
          <div className="action-form space-y-3 md:space-y-4">
            <div>
              <label className="label block text-xs md:text-sm font-semibold text-ink mb-2">
                Player Name
              </label>
              <input
                id="playerNameInput"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && jerseyNumber) {
                    handleAddPlayer('home');
                  }
                }}
                placeholder="e.g., John Doe"
                disabled={loading}
                className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted disabled:opacity-50"
              />
            </div>

            <div>
              <label className="label block text-xs md:text-sm font-semibold text-ink mb-2">
                Jersey #
              </label>
              <input
                id="jerseyInput"
                type="number"
                min="1"
                step="1"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && playerName) {
                    handleAddPlayer('home');
                  }
                }}
                placeholder="e.g., 23"
                disabled={loading}
                className="w-full px-3 py-2 text-sm bg-black/50 border border-border rounded-lg text-ink placeholder-muted disabled:opacity-50"
              />
            </div>

            <div className="action-buttons flex gap-2">
              <button
                id="addHomeBtn"
                onClick={() => handleAddPlayer('home')}
                disabled={loading || !isGameActive}
                className="flex-1 px-3 md:px-4 py-2 text-xs md:text-sm bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 disabled:opacity-50 transition-colors"
              >
                Add to Home
              </button>
              <button
                id="addGuestBtn"
                onClick={() => handleAddPlayer('guest')}
                disabled={loading || !isGameActive}
                className="flex-1 px-3 md:px-4 py-2 text-xs md:text-sm bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 disabled:opacity-50 transition-colors"
              >
                Add to Guest
              </button>
            </div>

            <div id="status" className="status">
              {status && (
                <div className={`text-xs md:text-sm p-3 rounded font-semibold text-center ${
                  status.includes('Error') || status.includes('Enter')
                    ? 'bg-red-600/30 text-red-200'
                    : 'bg-green-600/30 text-green-200'
                }`}>
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Player Controls */}
        <div id="actionControlsWrap" className="action-panel-right lg:col-span-2">
          <PlayerControls />
        </div>
      </div>
    </section>
  );
}
