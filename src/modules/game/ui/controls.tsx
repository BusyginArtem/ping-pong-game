import { Button } from '@/shared/ui/button';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store/useGameStore';
import { Difficulty, GameState } from '../types';

function Controls() {
  const {
    updateControls,
    setGameState,
    resetGame,
    gameState,
    setDifficulty,
    difficulty,
    controls,
  } = useGameStore();
  console.log('%c gameState', 'color: green; font-weight: bold;', gameState);
  console.log('%c difficulty', 'color: green; font-weight: bold;', difficulty);
  console.log('%c controls', 'color: green; font-weight: bold;', controls);
  const isPlaying = gameState === GameState.PLAYING;

  useKeyboard({
    onUpdateControls: (newControls) => {
      updateControls(newControls);
    },
    onPause: () => {
      setGameState(GameState.PAUSED);
      updateControls({
        playerLeftUp: false,
        playerLeftDown: false,
        playerRightUp: false,
        playerRightDown: false,
      });
    },
    onRestart: () => {
      resetGame();
      setGameState(GameState.PLAYING);
    },
    isGameActive: isPlaying,
  });

  const onStart = () => {
    if (isPlaying) {
      setGameState(GameState.PAUSED);
      updateControls({
        playerLeftUp: false,
        playerLeftDown: false,
        playerRightUp: false,
        playerRightDown: false,
      });
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  };

  const onReset = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  };

  const onDifficultyChange = (level: Difficulty) => {
    if (gameState !== GameState.PLAYING) {
      setDifficulty(level);
      resetGame();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="flex gap-4">
        <Button
          onClick={onStart}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Start Game'}
        </Button>
        <Button
          onClick={onReset}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reset Game
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-white">Difficulty:</span>
        {(['easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              difficulty === diff
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
            disabled={isPlaying}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Controls;
