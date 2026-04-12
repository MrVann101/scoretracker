'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, updateDoc, increment, onSnapshot, query, where, getDocs, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { SportKey, SPORTS } from './sports-config';

export interface Player {
  id: string;
  team: 'home' | 'guest';
  jerseyNumber: number;
  name: string;
  [key: string]: any;
}

export interface GameRecord {
  id: string;
  sport: SportKey;
  status: 'active' | 'ended';
  gameLabel?: string;
  homeTeamName: string;
  guestTeamName: string;
  startedAt: Date;
  endedAt?: Date;
  finalHome: number;
  finalGuest: number;
}

export interface GameContextType {
  activeGameId: string | null;
  sportKey: SportKey;
  homeTeamName: string;
  guestTeamName: string;
  homeScore: number;
  guestScore: number;
  isGameActive: boolean;
  players: Player[];
  gameHistory: GameRecord[];
  
  startGame: (sportKey: SportKey, homeTeam: string, guestTeam: string, gameLabel?: string) => Promise<void>;
  endGame: () => Promise<void>;
  setSportKey: (key: SportKey) => void;
  setHomeTeamName: (name: string) => Promise<void>;
  setGuestTeamName: (name: string) => Promise<void>;
  createOrUpdatePlayer: (team: 'home' | 'guest', jerseyNumber: number, playerName: string) => Promise<void>;
  recordAction: (team: 'home' | 'guest', jerseyNumber: number, actionId: string) => Promise<void>;
  loadGameHistory: (sport: SportKey) => Promise<void>;
  clearGameHistory: (sport: SportKey) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [sportKey, setSportKeyState] = useState<SportKey>('basketball');
  const [homeTeamName, setHomeTeamNameState] = useState('Home');
  const [guestTeamName, setGuestTeamNameState] = useState('Guest');
  const [homeScore, setHomeScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);

  const unsubscribers = React.useRef<(() => void)[]>([]);

  // Load game from localStorage on mount
  useEffect(() => {
    const savedGameId = localStorage.getItem('activeGameId');
    const savedSportKey = localStorage.getItem('activeSportKey') as SportKey;
    
    if (savedGameId && savedSportKey) {
      setSportKeyState(savedSportKey);
      bindToGame(savedGameId);
    }
    
    return () => {
      unsubscribers.current.forEach(unsub => unsub());
    };
  }, []);

  const bindToGame = (gameId: string) => {
    setActiveGameId(gameId);
    setPlayers([]);

    // Unsubscribe from previous listeners
    unsubscribers.current.forEach(unsub => unsub());
    unsubscribers.current = [];

    // Listen to game doc
    const unsubGame = onSnapshot(doc(db, 'games', gameId), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      const status = data.status || 'active';
      
      setHomeTeamNameState(data.homeTeamName || 'Home');
      setGuestTeamNameState(data.guestTeamName || 'Guest');
      setIsGameActive(status === 'active');
    });

    // Listen to totals
    const unsubTotals = onSnapshot(doc(db, 'games', gameId, 'scoreboard', 'totals'), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      setHomeScore(data.home || 0);
      setGuestScore(data.guest || 0);
    });

    // Listen to players
    const unsubPlayers = onSnapshot(collection(db, 'games', gameId, 'players'), (snapshot) => {
      const playersList: Player[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.team !== 'home' && data.team !== 'guest') return;
        
        playersList.push({
          id: docSnap.id,
          team: data.team,
          jerseyNumber: data.jerseyNumber || 0,
          name: data.name || '',
          ...data,
        });
      });
      
      playersList.sort((a, b) => a.jerseyNumber - b.jerseyNumber);
      setPlayers(playersList);
    });

    unsubscribers.current = [unsubGame, unsubTotals, unsubPlayers];
  };

  async function startGame(sport: SportKey, homeTeam: string, guestTeam: string, gameLabel?: string) {
    try {
      const gameDocRef = doc(collection(db, 'games'));
      const gameId = gameDocRef.id;
      
      await setDoc(gameDocRef, {
        sport,
        status: 'active',
        gameLabel: gameLabel || `${sport.charAt(0).toUpperCase() + sport.slice(1)} Game`,
        homeTeamName: homeTeam || 'Home',
        guestTeamName: guestTeam || 'Guest',
        startedAt: serverTimestamp(),
        endedAt: null,
        finalHome: 0,
        finalGuest: 0,
      });

      await setDoc(doc(db, 'games', gameId, 'scoreboard', 'totals'), { home: 0, guest: 0 });

      setSportKeyState(sport);
      setHomeTeamNameState(homeTeam || 'Home');
      setGuestTeamNameState(guestTeam || 'Guest');
      setHomeScore(0);
      setGuestScore(0);

      localStorage.setItem('activeGameId', gameId);
      localStorage.setItem('activeSportKey', sport);

      bindToGame(gameId);
    } catch (err) {
      console.error('Error starting game:', err);
      throw err;
    }
  }

  async function endGame() {
    if (!activeGameId) return;

    try {
      await updateDoc(doc(db, 'games', activeGameId), {
        status: 'ended',
        endedAt: serverTimestamp(),
        finalHome: homeScore,
        finalGuest: guestScore,
        homeTeamName: homeTeamName,
        guestTeamName: guestTeamName,
      });

      await loadGameHistory(sportKey);
      setActiveGameId(null);
      setIsGameActive(false);
      setPlayers([]);
      localStorage.removeItem('activeGameId');
      localStorage.removeItem('activeSportKey');

      unsubscribers.current.forEach(unsub => unsub());
      unsubscribers.current = [];
    } catch (err) {
      console.error('Error ending game:', err);
      throw err;
    }
  }

  function setSportKey(key: SportKey) {
    setSportKeyState(key);
    localStorage.setItem('activeSportKey', key);
  }

  async function setHomeTeamName(name: string) {
    setHomeTeamNameState(name);
    if (activeGameId) {
      await updateDoc(doc(db, 'games', activeGameId), { homeTeamName: name });
    }
  }

  async function setGuestTeamName(name: string) {
    setGuestTeamNameState(name);
    if (activeGameId) {
      await updateDoc(doc(db, 'games', activeGameId), { guestTeamName: name });
    }
  }

  async function createOrUpdatePlayer(team: 'home' | 'guest', jerseyNumber: number, playerName: string) {
    if (!activeGameId) throw new Error('No active game');
    
    const playerId = `${team}_${jerseyNumber}`;
    const playerDocRef = doc(db, 'games', activeGameId, 'players', playerId);
    const sportConfig = SPORTS[sportKey];
    
    await setDoc(playerDocRef, {
      team,
      jerseyNumber,
      name: playerName || `Player #${jerseyNumber}`,
      ...sportConfig.defaultStats,
    }, { merge: true });
  }

  async function recordAction(team: 'home' | 'guest', jerseyNumber: number, actionId: string) {
    if (!activeGameId) throw new Error('No active game');
    
    const playerId = `${team}_${jerseyNumber}`;
    const playerRef = doc(db, 'games', activeGameId, 'players', playerId);
    const sportConfig = SPORTS[sportKey];
    const action = sportConfig.actions.find(a => a.id === actionId);
    
    if (!action) throw new Error('Invalid action');

    const batch = writeBatch(db);

    // Update player stats
    const updateObj: any = {};
    Object.entries(action.statIncrements).forEach(([key, value]) => {
      if (value > 0) {
        updateObj[key] = increment(value);
      }
    });
    batch.update(playerRef, updateObj);

    // Update team score if action adds points
    if (action.pointsInc > 0) {
      const totalsRef = doc(db, 'games', activeGameId, 'scoreboard', 'totals');
      const scoreField = team === 'home' ? 'home' : 'guest';
      batch.update(totalsRef, {
        [scoreField]: increment(action.pointsInc),
      });
    }

    await batch.commit();
  }

  async function loadGameHistory(sport: SportKey) {
    try {
      const q = query(
        collection(db, 'games'),
        where('sport', '==', sport),
        where('status', '==', 'ended')
      );
      
      const snapshot = await getDocs(q);
      const history: GameRecord[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        history.push({
          id: docSnap.id,
          sport: data.sport,
          status: data.status,
          homeTeamName: data.homeTeamName || 'Home',
          guestTeamName: data.guestTeamName || 'Guest',
          startedAt: data.startedAt?.toDate?.() || new Date(),
          endedAt: data.endedAt?.toDate?.() || new Date(),
          finalHome: data.finalHome || 0,
          finalGuest: data.finalGuest || 0,
        });
      });

      history.sort((a, b) => (b.endedAt?.getTime() || 0) - (a.endedAt?.getTime() || 0));
      setGameHistory(history.slice(0, 10));
    } catch (err) {
      console.error('Error loading history:', err);
    }
  }

  async function clearGameHistory(sport: SportKey) {
    if (!window.confirm(`Clear ALL ${sport} game history?`)) return;

    try {
      const q = query(
        collection(db, 'games'),
        where('sport', '==', sport),
        where('status', '==', 'ended')
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      for (const docSnap of snapshot.docs) {
        // Delete players
        const playersCollection = collection(db, 'games', docSnap.id, 'players');
        const playersSnap = await getDocs(playersCollection);
        playersSnap.forEach(playerDoc => {
          batch.delete(playerDoc.ref);
        });

        // Delete scoreboard
        batch.delete(doc(db, 'games', docSnap.id, 'scoreboard', 'totals'));

        // Delete game
        batch.delete(docSnap.ref);
      }

      await batch.commit();
      await loadGameHistory(sport);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  }

  return (
    <GameContext.Provider value={{
      activeGameId,
      sportKey,
      homeTeamName,
      guestTeamName,
      homeScore,
      guestScore,
      isGameActive,
      players,
      gameHistory,
      startGame,
      endGame,
      setSportKey,
      setHomeTeamName,
      setGuestTeamName,
      createOrUpdatePlayer,
      recordAction,
      loadGameHistory,
      clearGameHistory,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
