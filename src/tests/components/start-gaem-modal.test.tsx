import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import StartGameModal from '@/features/game/ui/start-game-modal';
import { Difficulty } from '@/features/game/types';

import { useGameStore } from '@/features/game/store/useGameStore';
import { render, screen } from '../test-utils';

describe('StartGameModal Component', () => {
  const mockOnStartGame = vi.fn();
  const mockOnCancel = vi.fn();

  it('does not render when isOpen is false', () => {
    render(<StartGameModal isOpen={false} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);
    expect(screen.queryByTestId('start-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);
    expect(screen.getByTestId('start-modal')).toBeInTheDocument();
    expect(screen.getByText('Setup New Game')).toBeInTheDocument();
  });

  it('shows validation errors for empty names', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    const startButton = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton);

    expect(screen.getByText('Player 1 name is required')).toBeInTheDocument();
    expect(screen.getByText('Player 2 name is required')).toBeInTheDocument();
    expect(mockOnStartGame).not.toHaveBeenCalled();
  });

  it('shows validation errors for duplicate names', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    const player1Input = screen.getByLabelText(/Player 1/);
    const player2Input = screen.getByLabelText(/Player 2/);

    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Alice' } });

    const startButton = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton);

    expect(screen.getAllByText('Names must be different')).toHaveLength(2);
    expect(mockOnStartGame).not.toHaveBeenCalled();
  });

  it('calls onStartGame with valid names', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    const player1Input = screen.getByLabelText(/Player 1/);
    const player2Input = screen.getByLabelText(/Player 2/);

    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Bob' } });

    const startButton = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(startButton);

    expect(mockOnStartGame).toHaveBeenCalledWith('Alice', 'Bob');
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('changes difficulty level', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    const hardButton = screen.getByRole('button', { name: /Hard/i });
    fireEvent.click(hardButton);

    expect(useGameStore.getState().difficulty).toBe(Difficulty.HARD);
  });

  it('shows control instructions', () => {
    render(<StartGameModal isOpen={true} onStartGame={mockOnStartGame} onCancel={mockOnCancel} />);

    expect(screen.getByText('Controls:')).toBeInTheDocument();
    expect(screen.getByText(/^W$/)).toBeInTheDocument();
    expect(screen.getByText(/^S$/)).toBeInTheDocument();
    expect(screen.getByText(/Space/)).toBeInTheDocument();
  });
});
