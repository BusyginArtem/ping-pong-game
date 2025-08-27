import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';

import { Difficulty, GameState } from '@/modules/game/types';
import { useGameStore } from '@/modules/game/store/useGameStore';
import {
  PADDLE_CONFIG,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_CONFIG,
  DIFFICULTY_CONFIGS,
} from '@/shared/constants';

// Reset the store before each test
export const resetGameStore = () => {
  useGameStore.setState({
    gameState: GameState.MENU,
    difficulty: Difficulty.MEDIUM,
    ball: {
      position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      velocity: {
        x: DIFFICULTY_CONFIGS[Difficulty.MEDIUM].ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        y: 0,
      },
      radius: BALL_CONFIG.radius,
      trails: [],
    },
    playerLeftPaddle: {
      position: {
        x: PADDLE_CONFIG.offsetFromEdge,
        y: CANVAS_HEIGHT / 2 - PADDLE_CONFIG.height / 2,
      },
      width: PADDLE_CONFIG.width,
      height: PADDLE_CONFIG.height,
    },
    playerRightPaddle: {
      position: {
        x: CANVAS_WIDTH - PADDLE_CONFIG.offsetFromEdge - PADDLE_CONFIG.width,
        y: CANVAS_HEIGHT / 2 - PADDLE_CONFIG.height / 2,
      },
      width: PADDLE_CONFIG.width,
      height: PADDLE_CONFIG.height,
    },
    score: { playerLeft: 0, playerRight: 0 },
    controls: {
      playerLeftUp: false,
      playerLeftDown: false,
      playerRightUp: false,
      playerRightDown: false,
    },
    playerNames: {
      playerLeft: '',
      playerRight: '',
    },
    winner: null,
  });
};

// Custom render with store reset
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  resetGameStore();
  return render(ui, options);
};

// Export everything
// Explicitly export required members from @testing-library/react
export {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  within,
} from '@testing-library/react';
export { customRender as render };
