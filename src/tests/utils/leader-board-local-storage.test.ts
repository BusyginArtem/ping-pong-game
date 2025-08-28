import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveToLeaderboard,
  getLeaderboard,
  clearLeaderboard,
  generateGameId,
} from '@/shared/utils/leader-board-local-storage';
import type { LeaderboardEntry } from '@/modules/game/types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Leaderboard Local Storage Utils', () => {
  const mockEntry: LeaderboardEntry = {
    playerLeft: 'Alice',
    playerRight: 'Bob',
    difficulty: 'medium',
    score: '5-3',
    date: '12/25/2023',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveToLeaderboard', () => {
    it('saves entry to localStorage', () => {
      saveToLeaderboard(mockEntry);

      const saved = JSON.parse(localStorage.getItem('ping_pong_leaderboard') || '[]');
      expect(saved).toHaveLength(1);
      expect(saved[0]).toEqual(mockEntry);
    });

    it('limits to 5 entries', () => {
      for (let i = 0; i < 6; i++) {
        saveToLeaderboard({ ...mockEntry, date: `12/${i + 1}/2023` });
      }

      const saved = JSON.parse(localStorage.getItem('ping_pong_leaderboard') || '[]');
      expect(saved).toHaveLength(5);
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveToLeaderboard(mockEntry)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledOnce();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to leaderboard:', expect.any(Error));

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('getLeaderboard', () => {
    it('returns empty array when no data', () => {
      const result = getLeaderboard();
      expect(result).toEqual([]);
    });

    it('returns saved entries', () => {
      saveToLeaderboard(mockEntry);
      const result = getLeaderboard();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockEntry);
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = getLeaderboard();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledOnce();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load leaderboard:', expect.any(Error));

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('ping_pong_leaderboard', 'invalid json');

      const result = getLeaderboard();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load leaderboard:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('clearLeaderboard', () => {
    it('removes leaderboard from localStorage', () => {
      saveToLeaderboard(mockEntry);
      expect(getLeaderboard()).toHaveLength(1);

      clearLeaderboard();
      expect(getLeaderboard()).toHaveLength(0);
    });

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearLeaderboard()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear leaderboard:', expect.any(Error));

      removeItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('generateGameId', () => {
    it('generates unique IDs', () => {
      const id1 = generateGameId();
      const id2 = generateGameId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('generates string IDs', () => {
      const id = generateGameId();
      expect(typeof id).toBe('string');
    });
  });
});
