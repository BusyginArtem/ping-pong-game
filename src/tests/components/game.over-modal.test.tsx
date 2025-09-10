import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import GameOverModal from '@/features/game/ui/game-over-modal';
import { Difficulty } from '@/features/game/types';

import { useGameStore } from '@/features/game/store/useGameStore';
import { render, screen, act } from '../test-utils';

describe('GameOverModal Component', () => {
  const mockOnNewGame = vi.fn();

  it('does not render when isOpen is false', () => {
    render(<GameOverModal isOpen={false} onNewGame={mockOnNewGame} />);
    expect(screen.queryByTestId('game-over-modal')).not.toBeInTheDocument();
  });

  it('does not render when no winner', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      useGameStore.getState().actions.setWinner(null);
    });

    expect(screen.queryByTestId('game-over-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true and there is a winner', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.MEDIUM);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
    });

    expect(screen.getByTestId('game-over-modal')).toBeInTheDocument();
  });

  it('displays winner name correctly', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.MEDIUM);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
    });

    expect(screen.getByText('Alice Wins')).toBeInTheDocument();
    expect(screen.getByText('Congratulations on your victory!')).toBeInTheDocument();
  });

  it('displays final score correctly', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.MEDIUM);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
    });

    expect(screen.getByText('Final Score')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows crown for winner', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.MEDIUM);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
    });

    const aliceSection = screen.getByText('Alice').closest('div');
    expect(aliceSection).toHaveTextContent('👑');
  });

  it('displays difficulty badge', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.HARD);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
    });

    expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
  });

  it('calls onNewGame when play again button is clicked', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.HARD);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
    });

    const playAgainButton = screen.getByRole('button', { name: /Play Again/i });
    fireEvent.click(playAgainButton);

    expect(mockOnNewGame).toHaveBeenCalled();
  });

  it('calls resetGame when close button is clicked', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.HARD);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerLeft');
      actions.updateScore('playerRight');
    });

    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    expect(mockOnNewGame).toHaveBeenCalled();
  });

  it('displays right player as winner when they win', () => {
    render(<GameOverModal isOpen={true} onNewGame={mockOnNewGame} />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setDifficulty(Difficulty.HARD);
      actions.setPlayerNames('Alice', 'Bob');
      actions.setWinner('playerRight');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
      actions.updateScore('playerRight');
      actions.updateScore('playerLeft');
    });

    expect(screen.getByText('Bob Wins')).toBeInTheDocument();

    const bobSection = screen.getByText('Bob').closest('div');
    expect(bobSection).toHaveTextContent('👑');
  });
});
