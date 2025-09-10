import { getLeaderboard, saveToLeaderboard } from '@/shared/utils/leader-board-local-storage';
import type { LeaderboardEntry } from '../types';

export const useLeaderBoard = () => {
  const leaderboard = getLeaderboard();

  const onSaveLeaderboard = (entry: LeaderboardEntry) => {
    saveToLeaderboard(entry);
  };

  return { leaderboard, onSaveLeaderboard };
};
