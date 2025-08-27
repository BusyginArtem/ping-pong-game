import App from '@/app/App';
import { describe, it, expect } from 'vitest';

import { render } from './test-utils';

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
});
