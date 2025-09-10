import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';

import { useGameStore } from '@/features/game/store/useGameStore';
import { GameState } from '@/features/game/types';
import { render, screen, act } from '../test-utils';

import Board from '@/features/game/ui/board';
import Controls from '@/features/game/ui/controls';

// Mock hooks
vi.mock('@/features/game/hooks/useKeyboard', () => ({
  useKeyboard: vi.fn(),
}));

vi.mock('@/features/game/hooks/useLeaderBoard', () => ({
  useLeaderBoard: vi.fn(() => ({
    leaderboard: [],
    onSaveLeaderboard: vi.fn(),
  })),
}));

describe('Game Flow Integration Tests', () => {
  it('completes full game setup and start flow', async () => {
    const { rerender } = render(
      <div>
        <Board />
        <Controls />
      </div>
    );

    // Should show start modal initially
    expect(screen.getByTestId('start-modal')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();

    // Fill in player names
    const player1Input = screen.getByLabelText(/Player 1/);
    const player2Input = screen.getByLabelText(/Player 2/);

    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Bob' } });

    // Start the game
    const startButton = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      const state = useGameStore.getState();
      expect(state.gameState).toBe(GameState.PLAYING);
      expect(state.playerNames.playerLeft).toBe('Alice');
      expect(state.playerNames.playerRight).toBe('Bob');
    });

    // Re-render to reflect state changes
    rerender(
      <div>
        <Board />
        <Controls />
      </div>
    );

    // Should not show start modal anymore
    expect(screen.queryByTestId('start-modal')).not.toBeInTheDocument();

    // Should show player names in controls
    expect(screen.getAllByText('Alice')).toHaveLength(2);
    expect(screen.getAllByText('Bob')).toHaveLength(2);

    // Should show pause button
    expect(screen.getByText('Pause Game')).toBeInTheDocument();
  });

  it('handles game pause and resume', async () => {
    const { rerender } = render(<Controls />);

    // Set up game in playing state
    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PLAYING);
      actions.setPlayerNames('Alice', 'Bob');
    });

    // Should show pause button
    const pauseButton = screen.getByRole('button', { name: /Pause Game/i });
    fireEvent.click(pauseButton);

    expect(useGameStore.getState().gameState).toBe(GameState.PAUSED);

    // Re-render to show updated state
    rerender(<Controls />);

    // Should show resume button
    const resumeButton = screen.getByRole('button', { name: /Resume Game/i });
    fireEvent.click(resumeButton);

    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
  });

  it('handles game reset', () => {
    render(<Controls />);

    // Set up game with some progress
    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PLAYING);
      actions.setPlayerNames('Alice', 'Bob');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
    });

    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
    expect(useGameStore.getState().score).toEqual({
      playerLeft: 3,
      playerRight: 2,
    });

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /Reset Game/i });
    fireEvent.click(resetButton);

    const state = useGameStore.getState();
    expect(state.gameState).toBe(GameState.RESET);
    expect(state.score).toEqual({ playerLeft: 0, playerRight: 0 });
  });

  it('shows game over modal when game ends', () => {
    render(<Board />);

    // Set up game over state
    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.IDLE);
      actions.setPlayerNames('Alice', 'Bob');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
      actions.setWinner('playerLeft');
    });

    expect(screen.getByTestId('game-over-modal')).toBeInTheDocument();
    expect(screen.getByText('Alice Wins')).toBeInTheDocument();
    expect(screen.getByText('Final Score')).toBeInTheDocument();
  });

  it('validates player names correctly', () => {
    render(<Board />);

    // Try to start without names
    const startButton = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton);

    expect(screen.getByText('Player 1 name is required')).toBeInTheDocument();
    expect(screen.getByText('Player 2 name is required')).toBeInTheDocument();
    expect(useGameStore.getState().gameState).toBe(GameState.MENU);

    // Try with duplicate names
    const player1Input = screen.getByLabelText(/Player 1/);
    const player2Input = screen.getByLabelText(/Player 2/);

    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Alice' } });
    fireEvent.click(startButton);

    expect(screen.getAllByText('Names must be different')).toHaveLength(2);
    expect(useGameStore.getState().gameState).toBe(GameState.MENU);
  });
});
