export interface Position {
  x: number;
  y: number;
}

export interface Trail {
  position: Position;
  // opacity: number;
  timestamp: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Ball {
  position: Position;
  velocity: Velocity;
  radius: number;
  trails: Trail[];
}

export interface Paddle {
  position: Position;
  width: number;
  height: number;
}

export interface Score {
  playerLeft: number;
  playerRight: number;
}

export interface DifficultyLevel {
  name: string;
  ballSpeed: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const Difficulty = {
  EASY: 'easy' as Difficulty,
  MEDIUM: 'medium' as Difficulty,
  HARD: 'hard' as Difficulty,
};

export type GameState = 'menu' | 'playing' | 'paused' | 'reset' | 'idle';

export const GameState = {
  MENU: 'menu' as GameState,
  PLAYING: 'playing' as GameState,
  PAUSED: 'paused' as GameState,
  RESET: 'reset' as GameState,
  IDLE: 'idle' as GameState,
};

export interface Controls {
  playerLeftUp: boolean;
  playerLeftDown: boolean;
  playerRightUp: boolean;
  playerRightDown: boolean;
}

export interface LeaderboardEntry {
  playerLeft: string;
  playerRight: string;
  difficulty: Difficulty;
  score: string;
  date: string;
}

export type Players = 'playerLeft' | 'playerRight';
