import { describe, it, expect } from 'vitest';
import { useGameStore } from '@/features/game/store/useGameStore';
import { GameState, Difficulty } from '@/features/game/types';

describe('useGameStore', () => {
  it('has correct initial state', () => {
    const state = useGameStore.getState();

    expect(state.gameState).toBe(GameState.MENU);
    expect(state.difficulty).toBe(Difficulty.MEDIUM);
    expect(state.score).toEqual({ playerLeft: 0, playerRight: 0 });
    expect(state.playerNames).toEqual({ playerLeft: '', playerRight: '' });
    expect(state.winner).toBeNull();
  });

  it('sets game state correctly', () => {
    const { actions } = useGameStore.getState();

    actions.setGameState(GameState.PLAYING);
    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
  });

  it('sets difficulty correctly', () => {
    const { actions } = useGameStore.getState();

    actions.setDifficulty(Difficulty.HARD);
    expect(useGameStore.getState().difficulty).toBe(Difficulty.HARD);
  });

  it('updates score correctly', () => {
    const { actions } = useGameStore.getState();

    actions.updateScore('playerLeft');
    expect(useGameStore.getState().score.playerLeft).toBe(1);
    expect(useGameStore.getState().score.playerRight).toBe(0);

    actions.updateScore('playerRight');
    expect(useGameStore.getState().score.playerLeft).toBe(1);
    expect(useGameStore.getState().score.playerRight).toBe(1);
  });

  it('sets player names correctly', () => {
    const { actions } = useGameStore.getState();

    actions.setPlayerNames('Alice', 'Bob');
    const { playerNames } = useGameStore.getState();

    expect(playerNames.playerLeft).toBe('Alice');
    expect(playerNames.playerRight).toBe('Bob');
  });

  it('sets winner correctly', () => {
    const { actions } = useGameStore.getState();

    actions.setWinner('playerLeft');
    expect(useGameStore.getState().winner).toBe('playerLeft');
  });

  it('updates controls correctly', () => {
    const { actions } = useGameStore.getState();

    actions.updateControls({ playerLeftUp: true, playerRightDown: true });
    const { controls } = useGameStore.getState();

    expect(controls.playerLeftUp).toBe(true);
    expect(controls.playerLeftDown).toBe(false);
    expect(controls.playerRightUp).toBe(false);
    expect(controls.playerRightDown).toBe(true);
  });

  it('resets game correctly', () => {
    const { actions } = useGameStore.getState();

    // Set some state
    actions.setGameState(GameState.PLAYING);
    actions.setPlayerNames('Alice', 'Bob');
    actions.updateScore('playerLeft');
    actions.setWinner('playerLeft');

    // Reset the game
    actions.resetGame();
    const state = useGameStore.getState();

    expect(state.gameState).toBe(GameState.RESET);
    expect(state.score).toEqual({ playerLeft: 0, playerRight: 0 });
    expect(state.playerNames).toEqual({ playerLeft: '', playerRight: '' });
    expect(state.winner).toBeNull();
  });
});
