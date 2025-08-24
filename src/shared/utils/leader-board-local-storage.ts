import type { LeaderboardEntry } from '@/modules/game/types';

const LEADERBOARD_KEY = 'ping_pong_leaderboard';

export const saveToLeaderboard = (entry: LeaderboardEntry): void => {
  try {
    const existing = getLeaderboard();
    const updated = [...existing, entry].sort((a, b) => {
      const difficultyOrder = { hard: 3, medium: 2, easy: 1 };

      if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }

      const aScores = a.score.split('-').map(Number);
      const bScores = b.score.split('-').map(Number);
      const aDiff = Math.abs(aScores[0] - aScores[1]);
      const bDiff = Math.abs(bScores[0] - bScores[1]);

      return bDiff - aDiff;
    });

    const top5Players = updated.slice(0, 5);
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
