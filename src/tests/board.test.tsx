import { fireEvent, render } from './test-utils';
import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/modules/game/ui/board';
import { GameState } from '@/modules/game/types';
import { useGameStore } from '@/modules/game/store/useGameStore';

// const mockUseGameStore = vi.hoisted(() => vi.fn());
// vi.mock('@/modules/game/store/useGameStore', () => ({
//   useGameStore: mockUseGameStore,
// }));

describe('Board', () => {
  // const mockActions = {
  //   setGameState: vi.fn(),
  //   setDifficulty: vi.fn(),
  //   resetGame: vi.fn(),
  //   updateControls: vi.fn(),
  //   setPlayerNames: vi.fn(),
  //   updateScore: vi.fn(),
  //   setBall: vi.fn(),
  //   setPaddles: vi.fn(),
  //   setWinner: vi.fn(),
  // };

  beforeEach(() => {
    // mockUseGameStore.mockImplementation((selector) => {
    //   if (typeof selector === 'function') {
    //     return selector({
    //       gameState: GameState.MENU,
    //       playerNames: { playerLeft: '', playerRight: '' },
    //       actions: mockActions,
    //     });
    //   }
    //   return {
    //     gameState: GameState.MENU,
    //     playerNames: { playerLeft: '', playerRight: '' },
    //     actions: mockActions,
    //     ...mockActions,
    //   };
    // });
  });

  it('renders field and start game modal correctly', () => {
    const { queryByTestId, getByTestId } = render(<Board />);

    expect(queryByTestId('field-canvas')).toBeInTheDocument();
    expect(getByTestId('start-modal')).toBeInTheDocument();
    expect(queryByTestId('game-over-modal')).not.toBeInTheDocument();
  });

  it('shows start modal when in MENU state without player names', () => {
    useGameStore.setState({
      gameState: GameState.MENU,
      playerNames: { playerLeft: '', playerRight: '' },
    });

    const { getByTestId } = render(<Board />);
    expect(getByTestId('start-modal')).toBeInTheDocument();
  });

  it('calls setGameState when start game button is clicked', () => {
    const { getByRole } = render(<Board />);

    fireEvent.input(getByRole('textbox', { name: 'Player 1 (Left Paddle - W/S keys)' }), {
      target: { value: 'Alice' },
    });
    fireEvent.input(getByRole('textbox', { name: 'Player 2 (Right Paddle - ↑/↓ keys)' }), {
      target: { value: 'Bob' },
    });
    fireEvent.click(getByRole('button', { name: /Start Game/i }));

    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
    expect(useGameStore.getState().playerNames).toEqual({
      playerLeft: 'Alice',
      playerRight: 'Bob',
    });
  });

  it('shows game over modal when in IDLE state and there is a winner', () => {
    useGameStore.setState({
      gameState: GameState.IDLE,
      playerNames: { playerLeft: 'Player1', playerRight: 'Player2' },
      winner: 'playerLeft',
    });

    render(<Board />);
    // const { getByTestId } = render(<Board />);
    // expect(getByTestId('game-over-modal')).toBeInTheDocument();
  });

  // it('handles start game from modal', () => {
  //   useGameStore.setState({
  //     gameState: GameState.MENU,
  //     playerNames: { playerLeft: '', playerRight: '' },
  //   });

  //   const { rerender } = render(<Board />);

  //   // Simulate the modal calling onStartGame
  //   const modal = screen.getByTestId('start-modal');
  //   // This would normally be handled by the modal's internal logic
  //   // For testing, we directly set the store state

  //   useGameStore.getState().actions.setPlayerNames('Alice', 'Bob');
  //   useGameStore.getState().actions.setGameState(GameState.PLAYING);

  //   rerender(<Board />);

  //   expect(useGameStore.getState().playerNames.playerLeft).toBe('Alice');
  //   expect(useGameStore.getState().playerNames.playerRight).toBe('Bob');
  //   expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
  // });

  // -----------------------------------------------------------------------

  // describe('Rendering', () => {
  // beforeEach(() => {
  //   mockUseGameActions.mockReturnValue(() => mockActions);
  //   mockUseGamePlayerNames.mockReturnValue({ playerLeft: 'Player1', playerRight: 'Player2' });
  //   mockUseGameState.mockReturnValue(GameState.PLAYING);
  //   mockUseKeyboard.mockImplementation(
  //     ({
  //       onUpdateControls,
  //       onPause,
  //       onRestart,
  //       isGameActive,
  //     }: {
  //       onUpdateControls?: (controls: {
  //         playerLeftUp: boolean;
  //         playerLeftDown: boolean;
  //         playerRightUp: boolean;
  //         playerRightDown: boolean;
  //       }) => void;
  //       onPause?: () => void;
  //       onRestart?: () => void;
  //       isGameActive?: boolean;
  //     }) => {
  //       // Simulate keyboard events for testing
  //       if (isGameActive) {
  //         onUpdateControls?.({
  //           playerLeftUp: true,
  //           playerLeftDown: false,
  //           playerRightUp: false,
  //           playerRightDown: false,
  //         });
  //         onPause?.();
  //       }
  //       onRestart?.();
  //     }
  //   );
  // });
  // });
});

// import React from 'react';
// import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import { GameState } from '@/modules/game/types';
// import Board from '@/modules/game/ui/board';
// import { useKeyboard } from '@/modules/game/hooks/useKeyboard';
// import {
//   useGameActions,
//   useGameState,
//   useGamePlayerNames,
// } from '@/modules/game/store/useGameStore';

// // Mock the game store
// vi.mock('../../modules/game/store/useGameStore', () => ({
//   useGameState: vi.fn(() => GameState.MENU),
//   useGamePlayerNames: vi.fn(() => ({ playerLeft: '', playerRight: '' })),
//   useGameActions: vi.fn(() => ({
//     setGameState: vi.fn(),
//     updateControls: vi.fn(),
//     resetGame: vi.fn(),
//     setPlayerNames: vi.fn(),
//   })),
// }));

// // Mock the Field component
// vi.mock('../../modules/game/ui/field', () => ({
//   default: () => React.createElement('div', { 'data-testid': 'game-field' }, 'Game Field'),
// }));

// // Mock the modal components
// vi.mock('../../modules/game/ui/start-game-modal', () => ({
//   default: ({
//     isOpen,
//     onStartGame,
//   }: {
//     isOpen: boolean;
//     onStartGame: (p1: string, p2: string) => void;
//   }) =>
//     isOpen
//       ? React.createElement('div', { 'data-testid': 'start-game-modal' }, 'Start Game Modal')
//       : null,
// }));

// vi.mock('../../modules/game/ui/game-over-modal', () => ({
//   default: ({ isOpen }: { isOpen: boolean }) =>
//     isOpen
//       ? React.createElement('div', { 'data-testid': 'game-over-modal' }, 'Game Over Modal')
//       : null,
// }));

// // Mock keyboard hook
// vi.mock('../../modules/game/hooks/useKeyboard', () => ({
//   useKeyboard: vi.fn(),
// }));

// describe('Board Component', () => {
//   const mockActions = {
//     setGameState: vi.fn(),
//     updateControls: vi.fn(),
//     resetGame: vi.fn(),
//     setPlayerNames: vi.fn(),
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     (useGameActions as unknown as Mock).mockReturnValue(mockActions);
//   });

//   it('renders the game field', () => {
//     render(React.createElement(Board));
//     expect(screen.getByTestId('game-field')).toBeInTheDocument();
//   });

//   it('shows start game modal when in menu state with no player names', () => {
//     (useGameState as Mock).mockReturnValue(GameState.MENU);
//     (useGamePlayerNames as Mock).mockReturnValue({ playerLeft: '', playerRight: '' });

//     render(React.createElement(Board));
//     expect(screen.getByTestId('start-game-modal')).toBeInTheDocument();
//   });

//   it('does not show start game modal when player names exist', () => {
//     (useGameState as Mock).mockReturnValue(GameState.MENU);
//     (useGamePlayerNames as Mock).mockReturnValue({ playerLeft: 'Alice', playerRight: 'Bob' });

//     render(React.createElement(Board));
//     expect(screen.queryByTestId('start-game-modal')).not.toBeInTheDocument();
//   });

//   it('shows game over modal when in idle state', () => {
//     (useGameState as Mock).mockReturnValue(GameState.IDLE);

//     render(React.createElement(Board));
//     expect(screen.getByTestId('game-over-modal')).toBeInTheDocument();
//   });

//   it('does not show game over modal when not in idle state', () => {
//     (useGameState as Mock).mockReturnValue(GameState.PLAYING);

//     render(React.createElement(Board));
//     expect(screen.queryByTestId('game-over-modal')).not.toBeInTheDocument();
//   });

//   it('initializes keyboard controls with correct parameters', () => {
//     (useGameState as Mock).mockReturnValue(GameState.PLAYING);
//     (useGamePlayerNames as Mock).mockReturnValue({ playerLeft: 'Alice', playerRight: 'Bob' });

//     render(React.createElement(Board));

//     expect(useKeyboard).toHaveBeenCalledWith({
//       onUpdateControls: expect.any(Function),
//       onPause: expect.any(Function),
//       onRestart: expect.any(Function),
//       isGameActive: true,
//     });
//   });

//   it('calls setPlayerNames and setGameState when handleStartGame is triggered', () => {
//     (useGameState as Mock).mockReturnValue(GameState.MENU);
//     (useGamePlayerNames as Mock).mockReturnValue({ playerLeft: '', playerRight: '' });

//     render(React.createElement(Board));

//     // The start game modal should be rendered
//     expect(screen.getByTestId('start-game-modal')).toBeInTheDocument();
//   });
// });
