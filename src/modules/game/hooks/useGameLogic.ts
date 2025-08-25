import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameEngine } from '../core';
import { GameState } from '../types';
import { useLeaderBoard } from './useLeaderBoard';

const WINNING_SCORE = 5;

export const useGameLogic = () => {
  const gameEngineRef = useRef(new GameEngine());
  const { onSaveLeaderboard } = useLeaderBoard();

  const {
    gameState,
    difficulty,
    ball,
    playerLeftPaddle,
    playerRightPaddle,
    score,
    controls,
    playerNames,
    setGameState,
    updateScore,
    updateControls,
    setWinner,
  } = useGameStore();

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
          setGameState(GameState.MENU);
        }, 100);
      }
    }
  }, [
    gameState,
    playerLeftPaddle,
    playerRightPaddle,
    controls,
    ball,
    difficulty,
    updateScore,
    score.playerLeft,
    score.playerRight,
    setWinner,
    playerNames.playerLeft,
    playerNames.playerRight,
    onSaveLeaderboard,
    setGameState,
    updateControls,
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
