'use client';

import React from 'react';
import { useGame } from '@/lib/game-context';
import { SPORTS } from '@/lib/sports-config';

export function PlayerStatsTable() {
  const { players, sportKey, isGameActive } = useGame();
  const sportConfig = SPORTS[sportKey];
  
  const homeTeamPlayers = players
    .filter((p) => p.team === 'home')
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber);

  const guestTeamPlayers = players
    .filter((p) => p.team === 'guest')
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber);

  function renderTeamTable(teamPlayers: typeof players, teamLabel: string) {
    return (
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gold mb-2 md:mb-3">{teamLabel}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-ink font-semibold">Player Info</th>
                {sportConfig.records.map((col) => (
                  <th key={col.key} className="text-center px-3 py-2 text-ink font-semibold">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamPlayers.length === 0 ? (
                <tr>
                  <td colSpan={sportConfig.records.length + 1} className="text-center py-4 text-muted italic">
                    No players yet
                  </td>
                </tr>
              ) : (
                teamPlayers.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-black/30">
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <span className="font-semibold text-gold">
                          {p.name || 'Player'}
                        </span>
                        <span className="text-muted"> | #{p.jerseyNumber}</span>
                      </div>
                    </td>
                    {sportConfig.records.map((col) => (
                      <td key={col.key} className="text-center px-3 py-2 text-gold font-semibold">
                        {p[col.key] || 0}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <section className="card">
        <h2 className="card-title">Player Statistics</h2>
        <div className="text-center text-muted py-8">
          Start a game to see player statistics
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="card-title">Player Statistics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {renderTeamTable(homeTeamPlayers, 'Home Team')}
        {renderTeamTable(guestTeamPlayers, 'Guest Team')}
      </div>
    </section>
  );
}
