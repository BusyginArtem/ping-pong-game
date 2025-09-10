import type { LeaderboardEntry } from '@/features/game/types';

const LEADERBOARD_KEY = 'ping_pong_leaderboard';

export const saveToLeaderboard = (entry: LeaderboardEntry): void => {
  try {
    const existing = getLeaderboard();
    const top5Players = [...existing, entry].slice(0, 5);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top5Players));
  } catch (error) {
    console.error('Failed to save to leaderboard:', error);
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
};

export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Failed to clear leaderboard:', error);
  }
};

export const generateGameId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
