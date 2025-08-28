import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '@/modules/game/hooks/useGameLogic';
import { useGameStore } from '@/modules/game/store/useGameStore';
import { GameState, Difficulty } from '@/modules/game/types';

// Mock the leaderboard hook
vi.mock('@/modules/game/hooks/useLeaderBoard', () => ({
  useLeaderBoard: vi.fn(() => ({
    onSaveLeaderboard: vi.fn(),
  })),
}));

describe('useGameLogic Hook', () => {
  beforeEach(() => {
    useGameStore.setState({
      gameState: GameState.PLAYING,
      difficulty: Difficulty.MEDIUM,
      playerNames: { playerLeft: 'Alice', playerRight: 'Bob' },
      score: { playerLeft: 0, playerRight: 0 },
      controls: {
        playerLeftUp: false,
        playerLeftDown: false,
        playerRightUp: false,
        playerRightDown: false,
      },
      winner: null,
    });
  });

  it('returns updateGame function and gameEngine', () => {
    const { result } = renderHook(() => useGameLogic());

    expect(result.current.updateGame).toBeInstanceOf(Function);
    expect(result.current.gameEngine).toBeDefined();
  });

  it('does not update when game is not playing', () => {
    useGameStore.setState({ gameState: GameState.PAUSED });

    const { result } = renderHook(() => useGameLogic());
    const initialBallPosition = useGameStore.getState().ball.position;

    act(() => {
      result.current.updateGame();
    });

    const finalBallPosition = useGameStore.getState().ball.position;
    expect(finalBallPosition).toEqual(initialBallPosition);
  });

  it('resets ball when game state changes to RESET', () => {
    renderHook(() => useGameLogic());

    act(() => {
      useGameStore.setState({ gameState: GameState.RESET });
    });

    expect(useGameStore.getState().gameState).toBe(GameState.MENU);
  });
});
