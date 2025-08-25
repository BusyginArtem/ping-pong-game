import { Difficulty } from '@/modules/game/types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;
export const PADDLE_HEIGHT = 80;
export const PADDLE_WIDTH = 10;
export const BALL_RADIUS = 8;
export const PADDLE_SPEED = 5;
export const WINNING_SCORE = 5;

export const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_CONFIGS: Record<Difficulty, { ballSpeed: number }> = {
  easy: {
    ballSpeed: 4,
  },
  medium: {
    ballSpeed: 6,
  },
  hard: {
    ballSpeed: 8,
  },
};

export const PADDLE_CONFIG = {
  width: 10,
  height: 80,
  offsetFromEdge: 20,
};

export const BALL_CONFIG = {
  radius: 8,
  initialSpeed: DIFFICULTY_CONFIGS.medium.ballSpeed,
};

export const CONTROLS = {
  PLAYER_LEFT_UP: 'KeyW',
  PLAYER_LEFT_DOWN: 'KeyS',
  PLAYER_RIGHT_UP: 'ArrowUp',
  PLAYER_RIGHT_DOWN: 'ArrowDown',
  PAUSE: 'Space',
  RESTART: 'KeyR',
};

export const COLORS = {
  background: '#1f2937',
  paddle: '#f3f4f6',
  ball: '#f3f4f6',
  trail: '#9ca3af',
  text: '#f9fafb',
  accent: '#3b82f6',
};
