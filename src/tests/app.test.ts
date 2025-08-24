import { describe, it, expect, beforeEach } from 'vitest';

import { render, screen } from '@testing-library/react';
import React from 'react';

import App from '../app/App';

describe('App', () => {
  beforeEach(() => {
    render(React.createElement(App));
  });

  it('renders the header', () => {
    expect(screen.getByText('Ping Pong Game')).toBeInTheDocument();
  });
});
