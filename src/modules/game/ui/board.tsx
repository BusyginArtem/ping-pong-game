import { GameState } from '../types';
import { useGameActions, useGamePlayerNames, useGameState } from '../store/useGameStore';
import { useKeyboard } from '../hooks/useKeyboard';

import StartGameModal from './start-game-modal';
import GameOverModal from './game-over-modal';
import Field from './field';

export default function Board() {
  const gameState = useGameState();
  const playerNames = useGamePlayerNames();
  const { setGameState, updateControls, resetGame, setPlayerNames } = useGameActions();

  const isPlaying = gameState === GameState.PLAYING;
  const hasPlayerNames = playerNames.playerLeft && playerNames.playerRight;

  useKeyboard({
    onUpdateControls: (newControls) => {
      updateControls(newControls);
    },
    onPause: () => {
      if (isPlaying) {
        setGameState(GameState.PAUSED);
        updateControls({
          playerLeftUp: false,
          playerLeftDown: false,
          playerRightUp: false,
          playerRightDown: false,
        });
      }
    },
    onRestart: () => {
      if (hasPlayerNames) {
        resetGame();
      } else {
        setGameState(GameState.MENU);
      }
    },
    isGameActive: isPlaying,
  });

  const handleStartGame = (playerLeftName: string, playerRightName: string) => {
    setPlayerNames(playerLeftName, playerRightName);
    setGameState(GameState.PLAYING);
  };
  console.log('<<<<<<<<< gameState >>>>>>', gameState);
  console.log('<<<<<<<<< playerNames >>>>>>', playerNames);

  return (
    <div className="relative" data-testid="board">
      <Field />

      <StartGameModal
        isOpen={gameState === GameState.MENU && !playerNames.playerLeft}
        onStartGame={handleStartGame}
        onCancel={() => setGameState(GameState.IDLE)}
      />

      <GameOverModal isOpen={gameState === GameState.IDLE} onNewGame={resetGame} />
    </div>
  );
}
