'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/lib/game-context';

interface GameHistoryProps {
  onClose?: () => void;
}

export function GameHistory({ onClose }: GameHistoryProps) {
  const { gameHistory, sportKey, loadGameHistory, clearGameHistory } = useGame();

  useEffect(() => {
    loadGameHistory(sportKey);
  }, [sportKey, loadGameHistory]);

  const handleClearHistory = async () => {
    if (confirm('Clear all game history for this sport?')) {
      await clearGameHistory(sportKey);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearHistory}
          disabled={gameHistory.length === 0}
          className="px-3 md:px-4 py-1 md:py-2 bg-red-600/50 text-red-200 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {gameHistory.length === 0 ? (
          <div className="text-center text-muted py-8 italic text-sm">
            No past games yet
          </div>
        ) : (
          gameHistory.map((game) => (
            <div
              key={game.id}
              className="bg-black/30 border border-border rounded-lg p-3 md:p-4 hover:border-gold transition-colors"
            >
              {game.gameLabel && (
                <div className="text-xs font-bold text-gold uppercase tracking-wide mb-2 pb-2 border-b border-border/50">
                  {game.gameLabel}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className="text-xs md:text-sm font-semibold text-ink">
                  {game.homeTeamName} vs {game.guestTeamName}
                </div>
                <div className="text-base md:text-lg font-bold text-gold">
                  {game.finalHome} - {game.finalGuest}
                </div>
              </div>

              <div className="text-xs text-muted space-y-1">
                {game.startedAt && (
                  <div>
                    Started: {new Date(game.startedAt).toLocaleString()}
                  </div>
                )}
                {game.endedAt && (
                  <div>
                    Ended: {new Date(game.endedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
