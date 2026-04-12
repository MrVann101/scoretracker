'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { SportKey, SPORTS } from '@/lib/sports-config';
import { Scoreboard } from '@/components/scoreboard';
import { ActionPanel } from '@/components/action-panel';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { GameHistory } from '@/components/game-history';

interface GamePageProps {
  sport: SportKey;
}

export function GamePage({ sport }: GamePageProps) {
  const router = useRouter();
  const { isGameActive, endGame, loadGameHistory } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const sportConfig = SPORTS[sport];

  useEffect(() => {
    loadGameHistory(sport);
  }, [sport, loadGameHistory]);

  const handleEndGame = async () => {
    if (confirm('Are you sure you want to end the game?')) {
      await endGame();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg/95">
      <header className="app-header border-b border-border">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <h1 className="text-center flex-1">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gold mb-1 md:mb-2">
              {sportConfig.title}
            </div>
          </h1>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 md:px-6 py-2 text-xs md:text-sm border border-border text-ink rounded-lg hover:border-gold hover:text-gold transition-colors font-semibold whitespace-nowrap"
            >
              History
            </button>
            <button
              onClick={handleEndGame}
              disabled={!isGameActive}
              className="px-3 md:px-6 py-2 text-xs md:text-sm border border-border text-ink rounded-lg hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold whitespace-nowrap"
            >
              End Game
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border-strong rounded-lg p-6 md:p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gold">Game History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-muted hover:text-gold text-xl"
                >
                  ✕
                </button>
              </div>
              <GameHistory onClose={() => setShowHistory(false)} />
            </div>
          </div>
        )}

        {/* Main Game Sections */}
        <div className="space-y-6 md:space-y-8">
          <Scoreboard />
          <ActionPanel />
          <PlayerStatsTable />
        </div>
      </div>
    </div>
  );
}
