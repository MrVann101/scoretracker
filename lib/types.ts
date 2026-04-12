// Game types
export interface Player {
  id: string;
  team: 'home' | 'guest';
  jerseyNumber: number;
  name: string;
  [key: string]: any; // Dynamic stat fields based on sport
}

export interface GameState {
  id: string;
  sport: SportKey;
  homeTeam: string;
  guestTeam: string;
  homeScore: number;
  guestScore: number;
  players: Player[];
  createdAt: Date;
}

export interface SportAction {
  id: string;
  label: string;
  pointsInc: number;
  statIncrements: Record<string, number>;
}

export interface SportRecord {
  key: string;
  label: string;
}

export interface SportConfig {
  title: string;
  defaultStats: Record<string, number>;
  records: SportRecord[];
  actions: SportAction[];
}

export type SportKey = 'basketball' | 'volleyball' | 'badminton' | 'tennis';
