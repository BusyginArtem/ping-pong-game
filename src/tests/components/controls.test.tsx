import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/react';

import Controls from '@/modules/game/ui/controls';
import { GameState } from '@/modules/game/types';
import { useGameStore } from '@/modules/game/store/useGameStore';

import { render, screen, act } from '../test-utils';

describe('Controls Component', () => {
  beforeEach(() => {
    const { actions } = useGameStore.getState();
    actions.setGameState(GameState.IDLE);
    actions.setPlayerNames('', '');
    actions.setWinner(null);
  });

  it('renders controls component', () => {
    render(<Controls />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByText('Game Controls')).toBeInTheDocument();
  });

  it('shows "New Game" button when no players', () => {
    render(<Controls />);
    expect(screen.getByRole('button', { name: /New Game/i })).toBeInTheDocument();
  });

  it('shows player names when they exist', () => {
    render(<Controls />);

    act(() => {
      useGameStore.getState().actions.setPlayerNames('Alice', 'Bob');
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows "Start Game" button when players exist but game is idle', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.IDLE);
      actions.setPlayerNames('Alice', 'Bob');
    });

    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument();
  });

  it('shows "Pause Game" button when game is playing', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PLAYING);
      actions.setPlayerNames('Alice', 'Bob');
    });

    expect(screen.getByRole('button', { name: /Pause Game/i })).toBeInTheDocument();
  });

  it('shows "Resume Game" button when game is paused', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PAUSED);
      actions.setPlayerNames('Alice', 'Bob');
    });

    expect(screen.getByRole('button', { name: /Resume Game/i })).toBeInTheDocument();
  });

  it('handles start/pause button click', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PAUSED);
      actions.setPlayerNames('Alice', 'Bob');
    });

    const startButton = screen.getByRole('button', { name: /Resume Game/i });
    fireEvent.click(startButton);

    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
  });

  it('handles reset button click', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PAUSED);
      actions.setPlayerNames('Alice', 'Bob');
      actions.updateScore('playerLeft');
    });

    const resetButton = screen.getByRole('button', { name: /Reset Game/i });
    fireEvent.click(resetButton);

    const state = useGameStore.getState();
    expect(state.gameState).toBe(GameState.RESET);
    expect(state.score).toEqual({ playerLeft: 0, playerRight: 0 });
    expect(state.playerNames).toEqual({ playerLeft: '', playerRight: '' });
  });

  it('shows keyboard controls when game is active', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.PLAYING);
      actions.setPlayerNames('Alice', 'Bob');
    });

    expect(screen.getByText('Keyboard Controls')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('disables buttons when there is a winner', () => {
    render(<Controls />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.IDLE);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
    });

    const startButton = screen.getByRole('button', { name: /Start Game/i });
    const resetButton = screen.getByRole('button', { name: /Reset Game/i });

    expect(startButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });
});
