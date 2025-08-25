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
  playerNames: {
    playerLeft: string;
    playerRight: string;
  };
  winner: Players | null;

  actions: {
    setGameState: (state: GameState) => void;
    setDifficulty: (level: Difficulty) => void;
    resetGame: () => void;
    updateControls: (newControls: Partial<Controls>) => void;
    updateScore: (player: Players) => void;
    setBall: (ball: Ball) => void;
    setPaddles: (leftPaddle: Paddle, rightPaddle: Paddle) => void;
    setPlayerNames: (player1: string, player2: string) => void;
    setWinner: (winner: Players | null) => void;
  };
};

const createInitialBall = (difficulty: Difficulty): Ball => ({
  position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
  velocity: {
    x: DIFFICULTY_CONFIGS[difficulty].ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    y: 0,
  },
  radius: BALL_CONFIG.radius,
  trails: [],
});

const createInitialPaddles = () => ({
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
});

export const useGameStore = create<GameStore>()((set, get) => ({
  // gameState: GameState.PLAYING,
  gameState: GameState.MENU,
  difficulty: Difficulty.MEDIUM,
  ball: createInitialBall(Difficulty.MEDIUM),
  ...createInitialPaddles(),
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

  actions: {
    setGameState: (state) => set({ gameState: state }),

    setDifficulty: (level) => {
      set(() => ({
        difficulty: level,
        ball: createInitialBall(level),
      }));
    },

    resetGame: () => {
      const difficulty = get().difficulty;
      set({
        gameState: GameState.RESET,
        ball: createInitialBall(difficulty),
        ...createInitialPaddles(),
        score: { playerLeft: 0, playerRight: 0 },
        controls: {
          playerLeftUp: false,
          playerLeftDown: false,
          playerRightUp: false,
          playerRightDown: false,
        },
        winner: null,
        playerNames: {
          playerLeft: '',
          playerRight: '',
        },
      });
    },

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

    setBall: (ball) => set({ ball }),

    setPaddles: (leftPaddle, rightPaddle) =>
      set({ playerLeftPaddle: leftPaddle, playerRightPaddle: rightPaddle }),

    setPlayerNames: (player1, player2) =>
      set({ playerNames: { playerLeft: player1, playerRight: player2 } }),

    setWinner: (winner) => set({ winner }),
  },
}));

export const useGameState = () => useGameStore((state) => state.gameState);
export const useGamePlayerNames = () => useGameStore((state) => state.playerNames);
export const useGameWinner = () => useGameStore((state) => state.winner);
export const useGameDifficulty = () => useGameStore((state) => state.difficulty);
export const useGameControls = () => useGameStore((state) => state.controls);
export const useGameBall = () => useGameStore((state) => state.ball);
export const useGamePlayerLeftPaddle = () => useGameStore((state) => state.playerLeftPaddle);
export const useGamePlayerRightPaddle = () => useGameStore((state) => state.playerRightPaddle);
export const useGameScore = () => useGameStore((state) => state.score);

export const useGameActions = () => useGameStore((state) => state.actions);
