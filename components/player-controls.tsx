'use client';

import React from 'react';
import { useGame } from '@/lib/game-context';
import { SPORTS } from '@/lib/sports-config';

export function PlayerControls() {
  const { players, sportKey, recordAction, isGameActive } = useGame();
  const sportConfig = SPORTS[sportKey];

  const homeTeamPlayers = players
    .filter((p) => p.team === 'home')
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber);

  const guestTeamPlayers = players
    .filter((p) => p.team === 'guest')
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber);

  const handleActionClick = async (team: 'home' | 'guest', jersey: number, actionId: string) => {
    try {
      await recordAction(team, jersey, actionId);
    } catch (err) {
      console.error('Error recording action:', err);
    }
  };

  function renderTeamControls(teamPlayers: typeof players, teamLabel: string, teamKey: 'home' | 'guest') {
    return (
      <div className="controls-team">
        <div className="controls-team-title font-bold text-gold text-lg mb-4 pb-2 border-b border-border">
          {teamLabel} — Controls
        </div>
        <div className="player-controls space-y-3">
          {teamPlayers.length === 0 ? (
            <div className="ghost text-muted italic text-sm py-4 text-center">
              No {teamLabel.toLowerCase()} players yet
            </div>
          ) : (
            teamPlayers.map((p) => (
              <div key={p.id} className="player-control-row bg-black/40 border border-border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="player-jersey bg-gold text-black font-bold rounded px-2 py-1 min-w-[40px] text-center">
                    #{p.jerseyNumber}
                  </div>
                  <div className="player-name text-ink font-semibold text-sm">
                    {p.name || `Player #${p.jerseyNumber}`}
                  </div>
                </div>

                <div className="player-control-buttons grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-2">
                  {sportConfig.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(teamKey, p.jerseyNumber, action.id)}
                      disabled={!isGameActive}
                      className={`small-btn px-1 md:px-2 py-1 md:py-2 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                        isGameActive
                          ? 'bg-gold text-black hover:bg-gold-2 active:scale-95'
                          : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={action.label}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <div className="controls-team">
        <div className="text-center text-muted italic py-8">
          Start a game and add players to see controls
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderTeamControls(homeTeamPlayers, 'Home', 'home')}
      {renderTeamControls(guestTeamPlayers, 'Guest', 'guest')}
    </div>
  );
}
