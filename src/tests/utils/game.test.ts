import { describe, it, expect } from 'vitest';
import { getDifficultyColor, getWinner } from '@/shared/utils/game';
import { Difficulty } from '@/modules/game/types';
import type { LeaderboardEntry } from '@/modules/game/types';

describe('Game Utilities', () => {
  describe('getDifficultyColor', () => {
    it('returns correct colors for each difficulty', () => {
      expect(getDifficultyColor(Difficulty.EASY)).toBe(
        'bg-gray-100 text-gray-700 border-gray-300 '
      );
      expect(getDifficultyColor(Difficulty.MEDIUM)).toBe(
        'bg-gray-200 text-gray-800 border-gray-400 '
      );
      expect(getDifficultyColor(Difficulty.HARD)).toBe(
        'bg-gray-300 text-gray-900 border-gray-500 '
      );
    });

    it('returns default color for invalid difficulty', () => {
      expect(getDifficultyColor('invalid' as Difficulty)).toBe(
        'bg-gray-100 text-gray-700 border-gray-300 '
      );
    });
  });

  describe('getWinner', () => {
    it('returns correct winner when left player wins', () => {
      const entry: LeaderboardEntry = {
        playerLeft: 'Alice',
        playerRight: 'Bob',
        difficulty: Difficulty.MEDIUM,
        score: '5-3',
        date: '12/25/2023',
      };

      const result = getWinner(entry);
      expect(result.winner).toBe('Alice');
      expect(result.loser).toBe('Bob');
      expect(result.winnerScore).toBe(5);
      expect(result.loserScore).toBe(3);
    });

    it('returns correct winner when right player wins', () => {
      const entry: LeaderboardEntry = {
        playerLeft: 'Alice',
        playerRight: 'Bob',
        difficulty: Difficulty.MEDIUM,
        score: '2-5',
        date: '12/25/2023',
      };

      const result = getWinner(entry);
      expect(result.winner).toBe('Bob');
      expect(result.loser).toBe('Alice');
      expect(result.winnerScore).toBe(5);
      expect(result.loserScore).toBe(2);
    });
  });
});
