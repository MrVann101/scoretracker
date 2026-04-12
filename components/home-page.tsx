'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SportKey, SPORTS } from '@/lib/sports-config';
import { AuthModal } from '@/components/auth-modal';
import { QuickGameModal } from '@/components/quick-game-modal';

export function HomePage() {
  const router = useRouter();
  const { user, username, logout, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportKey | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [savedGameSport, setSavedGameSport] = useState<SportKey | null>(null);

  // Check localStorage for saved game on component mount
  useEffect(() => {
    const savedGameId = localStorage.getItem('activeGameId');
    const savedSporte = localStorage.getItem('activeSportKey') as SportKey | null;
    
    if (savedGameId && savedSporte) {
      setSavedGameSport(savedSporte);
    }
  }, []);

  const handleGameButtonClick = (sport: SportKey) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Check if there's a saved active game for this sport
      if (savedGameSport === sport) {
        // Continue the existing game - navigate directly without showing modal
        router.push(`/${sport}`);
      } else {
        // Start a new game - show modal
        setSelectedSport(sport);
        setShowGameModal(true);
      }
    }
  };

  const handleGameStarted = (sport: SportKey) => {
    setShowGameModal(false);
    router.push(`/${sport}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const sports: SportKey[] = ['basketball', 'volleyball', 'badminton', 'tennis'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg/95">
      {/* Header with Auth */}
      <header className="app-header border-b border-border">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gold text-center md:text-left">Sports Score Tracker</h1>
          <div className="flex gap-2 md:gap-4 items-center flex-wrap justify-center">
            {authLoading ? (
              <div className="text-muted">Loading...</div>
            ) : user ? (
              <>
                <span className="text-sm text-muted">@{username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gold text-gold hover:bg-gold/10 rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-2 transition-colors"
              >
                Sign Up / Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-ink mb-2">Select a Sport</h2>
          <p className="text-xs md:text-sm text-muted">Choose a sport to start or continue a game</p>
        </div>

        {/* Game Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {sports.map((sport) => {
            const sportConfig = SPORTS[sport];
            const hasActiveGame = savedGameSport === sport;
            
            return (
              <button
                key={sport}
                onClick={() => handleGameButtonClick(sport)}
                className={`p-4 md:p-6 lg:p-8 rounded-lg transition-all hover:scale-105 ${
                  hasActiveGame
                    ? 'bg-gold/20 border-2 border-gold hover:border-gold-2'
                    : 'bg-black/30 border-2 border-gold/50 hover:border-gold hover:bg-black/40'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-4">
                    {sport === 'basketball'
                      ? '🏀'
                      : sport === 'volleyball'
                      ? '🏐'
                      : sport === 'badminton'
                      ? '🏸'
                      : '🎾'}
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gold mb-1 md:mb-2">
                    {sportConfig.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted">
                    {hasActiveGame ? '▶ Continue game' : 'Start new game'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        {user && (
          <div className="text-center p-6 bg-black/20 border border-border rounded-lg">
            <p className="text-ink">
              {savedGameSport 
                ? `You have an active game in ${SPORTS[savedGameSport].title.split(' ')[0]}. Click to continue or choose another sport to start a new game.`
                : 'Ready to track scores? Click on any sport to start a new game.'}
            </p>
          </div>
        )}

        {!user && !authLoading && (
          <div className="text-center p-6 bg-gold/10 border border-gold/30 rounded-lg">
            <p className="text-ink mb-2">Sign up or log in to start tracking games</p>
            <p className="text-sm text-muted">
              Your games will be saved to your account so you can access them anytime.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />

      {selectedSport && (
        <QuickGameModal
          isOpen={showGameModal}
          onClose={() => {
            setShowGameModal(false);
            setSelectedSport(null);
          }}
          onGameStarted={() => handleGameStarted(selectedSport)}
          sport={selectedSport}
        />
      )}
    </div>
  );
}
