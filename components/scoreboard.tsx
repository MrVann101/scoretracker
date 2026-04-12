'use client';

import React from 'react';
import { useGame } from '@/lib/game-context';

export function Scoreboard() {
  const { homeTeamName, guestTeamName, homeScore, guestScore, setHomeTeamName, setGuestTeamName } = useGame();

  return (
    <section className="card">
      <h2 className="card-title">Scoreboard</h2>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="text-center">
          <input
            type="text"
            value={homeTeamName}
            onChange={(e) => setHomeTeamName(e.target.value)}
            className="text-sm md:text-lg lg:text-xl font-semibold text-gold mb-2 md:mb-4 bg-transparent border-b border-gold text-center w-full"
          />
          <div className="text-xs md:text-sm text-muted mb-1 md:mb-2">Total</div>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold">{homeScore}</div>
        </div>

        <div className="text-center">
          <input
            type="text"
            value={guestTeamName}
            onChange={(e) => setGuestTeamName(e.target.value)}
            className="text-sm md:text-lg lg:text-xl font-semibold text-gold mb-2 md:mb-4 bg-transparent border-b border-gold text-center w-full"
          />
          <div className="text-xs md:text-sm text-muted mb-1 md:mb-2">Total</div>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold">{guestScore}</div>
        </div>
      </div>
    </section>
  );
}
