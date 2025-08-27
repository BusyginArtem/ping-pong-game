// import { GameState } from '@/modules/game/types';
// import Controls from '@/modules/game/ui/controls';
// import { render, screen, fireEvent } from './test-utils';
// import { describe, expect, vi, beforeEach, type Mock } from 'vitest';

// // Mock store
// const mockSetGameState = vi.fn();
// const mockUpdateControls = vi.fn();
// const mockResetGame = vi.fn();

// vi.mock('../store/useGameStore', () => ({
//   useGameActions: () => ({
//     setGameState: mockSetGameState,
//     updateControls: mockUpdateControls,
//     resetGame: mockResetGame,
//   }),
//   useGameState: vi.fn(),
//   useGameWinner: vi.fn(),
//   useGamePlayerNames: vi.fn(),
// }));

// const importedStore = await import('../modules/game/store/useGameStore');
// const useGameState = importedStore.useGameState as unknown as Mock;
// const useGameWinner = importedStore.useGameWinner as unknown as Mock;
// const useGamePlayerNames = importedStore.useGamePlayerNames as unknown as Mock;

// beforeEach(() => {
//   vi.clearAllMocks();
//   useGameState.mockReturnValue(GameState.IDLE);
//   useGameWinner.mockReturnValue(null);
//   useGamePlayerNames.mockReturnValue({ playerLeft: 'Alice', playerRight: 'Bob' });
// });

// describe('renders with player names', () => {
//   render(<Controls />);
//   expect(screen.getByText(/Alice/i)).toBeInTheDocument();
//   expect(screen.getByText(/Bob/i)).toBeInTheDocument();
// });

// describe('start button shows "Start Game" when idle with players', () => {
//   render(<Controls />);
//   expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument();
// });

// describe('clicking start calls setGameState', () => {
//   render(<Controls />);
//   fireEvent.click(screen.getByRole('button', { name: /Start Game/i }));
//   expect(mockSetGameState).toHaveBeenCalled();
// });

// describe('reset button calls resetGame when players exist', () => {
//   render(<Controls />);
//   fireEvent.click(screen.getByRole('button', { name: /Reset Game/i }));
//   expect(mockResetGame).toHaveBeenCalled();
// });

// describe('new players button appears when names exist', () => {
//   render(<Controls />);
//   expect(screen.getByRole('button', { name: /New Players/i })).toBeInTheDocument();
// });
