import {
  useGameBall,
  useGameControls,
  useGameDifficulty,
  useGamePlayerLeftPaddle,
  useGamePlayerNames,
  useGamePlayerRightPaddle,
  useGameScore,
  useGameState,
} from './../store/useGameStore';
import { useCallback, useEffect, useRef } from 'react';
import { useGameActions, useGameStore } from '../store/useGameStore';
import { GameEngine } from '../core';
import { GameState } from '../types';
import { useLeaderBoard } from './useLeaderBoard';

const WINNING_SCORE = 5;

export const useGameLogic = () => {
  const gameEngineRef = useRef(new GameEngine());
  const { onSaveLeaderboard } = useLeaderBoard();

  const difficulty = useGameDifficulty();
  const gameState = useGameState();
  const playerNames = useGamePlayerNames();
  const controls = useGameControls();
  const score = useGameScore();
  const playerLeftPaddle = useGamePlayerLeftPaddle();
  const playerRightPaddle = useGamePlayerRightPaddle();
  const ball = useGameBall();
  const { setGameState, updateControls, updateScore, setWinner } = useGameActions();

  // Game update function that runs every frame
  const updateGame = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    const engine = gameEngineRef.current;

    // Update paddles based on controls
    const { leftPaddle, rightPaddle } = engine.updatePaddles(
      playerLeftPaddle,
      playerRightPaddle,
      controls
    );

    // Update ball position and check for collisions
    const { ball: updatedBall, scoringPlayer } = engine.updateBall(
      ball,
      leftPaddle,
      rightPaddle,
      difficulty
    );

    // Update store with new positions
    useGameStore.setState({
      ball: updatedBall,
      playerLeftPaddle: leftPaddle,
      playerRightPaddle: rightPaddle,
    });

    // Handle scoring
    if (scoringPlayer) {
      updateScore(scoringPlayer);

      // Reset ball after scoring
      const newBall = engine.resetBall(difficulty);
      useGameStore.setState({ ball: newBall });

      // Check for game end
      const newScore = {
        playerLeft: scoringPlayer === 'playerLeft' ? score.playerLeft + 1 : score.playerLeft,
        playerRight: scoringPlayer === 'playerRight' ? score.playerRight + 1 : score.playerRight,
      };

      const { gameEnded, winner } = engine.checkGameEnd(
        newScore.playerLeft,
        newScore.playerRight,
        WINNING_SCORE
      );

      if (gameEnded && winner) {
        setWinner(winner);
        const entry = {
          playerLeft: playerNames.playerLeft,
          playerRight: playerNames.playerRight,
          difficulty,
          score: `${newScore.playerLeft}-${newScore.playerRight}`,
          date: new Date().toLocaleDateString(),
        };
        onSaveLeaderboard(entry);

        // Stop game and show results
        setGameState(GameState.PAUSED);
        updateControls({
          playerLeftUp: false,
          playerLeftDown: false,
          playerRightUp: false,
          playerRightDown: false,
        });

        setTimeout(() => {
          setGameState(GameState.IDLE);
        }, 500);
      }
    }
  }, [
    ball,
    controls,
    difficulty,
    gameState,
    onSaveLeaderboard,
    playerLeftPaddle,
    playerNames.playerLeft,
    playerNames.playerRight,
    playerRightPaddle,
    score.playerLeft,
    score.playerRight,
    setGameState,
    setWinner,
    updateControls,
    updateScore,
  ]);

  // Reset game when needed
  useEffect(() => {
    if (gameState === GameState.RESET) {
      const engine = gameEngineRef.current;
      const newBall = engine.resetBall(difficulty);
      useGameStore.setState({
        ball: newBall,
        gameState: GameState.MENU,
      });
    }
  }, [gameState, difficulty]);

  return {
    updateGame,
    gameEngine: gameEngineRef.current,
  };
};
