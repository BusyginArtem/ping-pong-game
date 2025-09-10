import type { Difficulty, LeaderboardEntry } from '../types';

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-gray-100 text-gray-700 border-gray-300 ';
    case 'medium':
      return 'bg-gray-200 text-gray-800 border-gray-400 ';
    case 'hard':
      return 'bg-gray-300 text-gray-900 border-gray-500 ';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 ';
  }
};

export const getWinner = (entry: LeaderboardEntry) => {
  const scores = entry.score.split('-').map(Number);
  const leftScore = scores[0];
  const rightScore = scores[1];

  if (leftScore > rightScore) {
    return {
      winner: entry.playerLeft,
      loser: entry.playerRight,
      winnerScore: leftScore,
      loserScore: rightScore,
    };
  } else {
    return {
      winner: entry.playerRight,
      loser: entry.playerLeft,
      winnerScore: rightScore,
      loserScore: leftScore,
    };
  }
};
