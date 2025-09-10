import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import Leaderboard from '@/features/game/ui/leaderboard';
import { render, screen } from '../test-utils';
import type { LeaderboardEntry } from '@/features/game/types';
import { useLeaderBoard } from '@/features/game/hooks/useLeaderBoard';

// Mock the leaderboard hook
vi.mock('@/features/game/hooks/useLeaderBoard', () => ({
  useLeaderBoard: vi.fn(),
}));

// Mock the store hook
// vi.mock('@/features/game/store/useGameStore', () => ({
//   useGameEnded: vi.fn(() => false),
// }));

const mockLeaderboard: LeaderboardEntry[] = [
  {
    playerLeft: 'Alice',
    playerRight: 'Bob',
    difficulty: 'medium',
    score: '5-3',
    date: '12/25/2023',
  },
  {
    playerLeft: 'Charlie',
    playerRight: 'David',
    difficulty: 'hard',
    score: '5-4',
    date: '12/24/2023',
  },
];

describe('Leaderboard Component', () => {
  beforeEach(() => {
    (useLeaderBoard as Mock).mockReturnValue({
      leaderboard: mockLeaderboard,
    });
  });

  it('renders leaderboard with games', () => {
    render(<Leaderboard />);
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Match History')).toBeInTheDocument();
    expect(screen.getByText('2 games')).toBeInTheDocument();
  });

  it('displays game entries correctly', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getAllByText('defeated')).toHaveLength(2);
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('5 - 3')).toBeInTheDocument();
  });

  it('shows difficulty badges', () => {
    render(<Leaderboard />);
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('HARD')).toBeInTheDocument();
  });

  it('shows dates', () => {
    render(<Leaderboard />);
    expect(screen.getByText('12/25/2023')).toBeInTheDocument();
    expect(screen.getByText('12/24/2023')).toBeInTheDocument();
  });

  it('shows empty state when no games', () => {
    (useLeaderBoard as Mock).mockReturnValue({
      leaderboard: [],
    });

    render(<Leaderboard />);
    expect(screen.getByText('No Games Yet')).toBeInTheDocument();
    expect(screen.getByText('Start playing to see your match history here.')).toBeInTheDocument();
  });

  it('displays rank icons correctly', () => {
    const { container } = render(<Leaderboard />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
