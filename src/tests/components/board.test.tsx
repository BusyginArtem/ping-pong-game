import { act, fireEvent, render, waitFor } from '../test-utils';
import { describe, it, expect } from 'vitest';

import Board from '@/features/game/ui/board';
import { GameState } from '@/features/game/types';
import { useGameStore } from '@/features/game/store/useGameStore';

describe('Board', () => {
  it('renders field and start game modal correctly', () => {
    const { queryByTestId } = render(<Board />);

    expect(queryByTestId('field-canvas')).toBeInTheDocument();
    expect(queryByTestId('start-modal')).toBeInTheDocument();
  });

  it('does not show game over modal when not in idle state', () => {
    const { queryByTestId } = render(<Board />);

    expect(queryByTestId('game-over-modal')).not.toBeInTheDocument();
  });

  it('shows start modal when in MENU state without player names', () => {
    const { getByTestId } = render(<Board />);

    expect(getByTestId('start-modal')).toBeInTheDocument();
  });

  it('hide start modal when start game button is clicked', async () => {
    const { getByRole, queryByTestId } = render(<Board />);

    fireEvent.input(getByRole('textbox', { name: 'Player 1 (Left Paddle - W/S keys)' }), {
      target: { value: 'Alice' },
    });
    fireEvent.input(getByRole('textbox', { name: 'Player 2 (Right Paddle - ↑/↓ keys)' }), {
      target: { value: 'Bob' },
    });
    fireEvent.click(getByRole('button', { name: /Start Game/i }));

    expect(queryByTestId('start-modal')).not.toBeInTheDocument();

    await waitFor(() => {
      const state = useGameStore.getState();
      expect(state.gameState).toBe(GameState.PLAYING);
      expect(state.playerNames.playerLeft).toBe('Alice');
      expect(state.playerNames.playerRight).toBe('Bob');
    });
  });

  it('shows game over modal when in IDLE state and there is a winner', () => {
    const { getByTestId } = render(<Board />);

    act(() => {
      const { actions } = useGameStore.getState();
      actions.setGameState(GameState.IDLE);
      actions.setPlayerNames('Player1', 'Player2');
      actions.setWinner('playerLeft');
    });

    expect(getByTestId('game-over-modal')).toBeInTheDocument();
  });
});
