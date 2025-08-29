import App from '@/app/App';
import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '../test-utils';

// Mock the leaderboard hook
vi.mock('@/modules/game/hooks/useLeaderBoard', () => ({
  useLeaderBoard: vi.fn(() => ({
    leaderboard: [],
    onSaveLeaderboard: vi.fn(),
  })),
}));

// Mock keyboard hook
vi.mock('@/modules/game/hooks/useKeyboard', () => ({
  useKeyboard: vi.fn(),
}));

describe('App', () => {
  it('renders the App header', () => {
    const { getByText } = render(<App />);

    expect(getByText('Ping Pong Game')).toBeInTheDocument();
  });

  it('renders the Board, Leaderboard and Controls components', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('board')).toBeInTheDocument();
    expect(getByTestId('controls')).toBeInTheDocument();
    expect(getByTestId('leaderboard')).toBeInTheDocument();
  });

  it('starts with start game modal visible', () => {
    render(<App />);
    expect(screen.getByTestId('start-modal')).toBeInTheDocument();
  });
});
