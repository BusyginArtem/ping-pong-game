import { create } from 'zustand';

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DIFFICULTY_CONFIGS,
  BALL_CONFIG,
  PADDLE_CONFIG,
} from '@/shared/constants';
import {
  GameState,
  Difficulty,
  type Ball,
  type Paddle,
  type Controls,
  type Score,
  type Players,
} from '../types';

type GameStore = {
  gameState: GameState;
  difficulty: Difficulty;
  ball: Ball;
  playerLeftPaddle: Paddle;
  playerRightPaddle: Paddle;
  score: Score;
  controls: Controls;
  setGameState: (state: GameState) => void;
  setDifficulty: (level: Difficulty) => void;
  resetGame: () => void;
  updateControls: (newControls: Partial<GameStore['controls']>) => void;
  updateScore: (player: Players) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: GameState.MENU,
  difficulty: Difficulty.MEDIUM,
  ball: {
    position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    velocity: { x: DIFFICULTY_CONFIGS[Difficulty.MEDIUM].ballSpeed, y: 0 },
    radius: BALL_CONFIG.radius,
    trails: [],
  },
  playerLeftPaddle: {
    position: { x: PADDLE_CONFIG.offsetFromEdge, y: CANVAS_HEIGHT / 2 - PADDLE_CONFIG.height / 2 },
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

  setGameState: (state) => set({ gameState: state }),
  setDifficulty: (level) => {
    const ballSpeed = DIFFICULTY_CONFIGS[level].ballSpeed;

    set((state) => ({
      difficulty: level,
      ball: {
        ...state.ball,
        velocity: { x: ballSpeed * Math.sign(state.ball.velocity.x), y: state.ball.velocity.y },
      },
    }));
  },
  resetGame: () =>
    set({
      gameState: GameState.RESET,
      ball: {
        position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
        velocity: {
          x: DIFFICULTY_CONFIGS[get().difficulty].ballSpeed * (Math.random() > 0.5 ? 1 : -1),
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
    }),
  updateControls: (newControls) =>
    set((state) => ({ controls: { ...state.controls, ...newControls } })),
  updateScore: (player) =>
    set((state) => ({
      score: {
        playerLeft: player === 'playerLeft' ? state.score.playerLeft + 1 : state.score.playerLeft,
        playerRight:
          player === 'playerRight' ? state.score.playerRight + 1 : state.score.playerRight,
      },
    })),
}));
