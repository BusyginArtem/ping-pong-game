import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/styling';
import { Settings, Zap, Target } from 'lucide-react';
import { GameState, type Difficulty } from '../types';
import { useGameStore } from '../store/useGameStore';

interface StartGameModalProps {
  isOpen: boolean;
  onStartGame: (playerLeftName: string, playerRightName: string) => void;
  onCancel: () => void;
}

const Controls = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Controls:</h3>
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div>
          Player 1: <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">W</kbd> /{' '}
          <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">S</kbd> keys
        </div>
        <div>
          Player 2: <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">↑</kbd> /{' '}
          <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">↓</kbd> keys
        </div>
        <div>
          Pause: <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Space</kbd>
        </div>
        <div>
          Restart: <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded">R</kbd>
        </div>
      </div>
    </div>
  );
};

const getDifficultyIcon = (diff: Difficulty) => {
  switch (diff) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '⚪';
  }
};

const getDifficultyColor = (diff: Difficulty, isActive: boolean) => {
  if (!isActive) {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600';
  }

  switch (diff) {
    case 'easy':
      return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-400 dark:border-green-600 shadow-lg shadow-green-200/50 dark:shadow-green-900/30';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-400 dark:border-yellow-600 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30';
    case 'hard':
      return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600 shadow-lg shadow-red-200/50 dark:shadow-red-900/30';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  }
};

export default function StartGameModal({ isOpen, onStartGame, onCancel }: StartGameModalProps) {
  const [errors, setErrors] = useState({ playerLeft: '', playerRight: '' });

  const { resetGame, setDifficulty, gameState, difficulty, winner, playerNames } = useGameStore();

  const hasPlayerNames = playerNames.playerLeft && playerNames.playerRight;
  const isPlaying = gameState === GameState.PLAYING;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const playerLeftName = formData.get('playerLeft')?.toString() || '';
    const playerRightName = formData.get('playerRight')?.toString() || '';

    const newErrors = { playerLeft: '', playerRight: '' };

    if (!playerLeftName.trim()) {
      newErrors.playerLeft = 'Player 1 name is required';
    }

    if (!playerRightName.trim()) {
      newErrors.playerRight = 'Player 2 name is required';
    }

    if (playerLeftName.trim() === playerRightName.trim() && playerLeftName.trim()) {
      newErrors.playerLeft = 'Names must be different';
      newErrors.playerRight = 'Names must be different';
    }

    setErrors(newErrors);

    if (!newErrors.playerLeft && !newErrors.playerRight) {
      onStartGame(playerLeftName.trim(), playerRightName.trim());
      setErrors({ playerLeft: '', playerRight: '' });
      e.currentTarget.reset();
    }
  };

  const handleCancel = () => {
    setErrors({ playerLeft: '', playerRight: '' });
    onCancel?.();
  };

  const onDifficultyChange = (level: Difficulty) => {
    if (gameState !== GameState.PLAYING) {
      setDifficulty(level);
      if (hasPlayerNames) {
        resetGame();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 transform transition-all duration-200 scale-100">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🏓 Ready to Play?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Enter player names to start the game</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="playerLeft"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Player 1 (Left Paddle - W/S keys)
              </label>
              <input
                id="playerLeft"
                type="text"
                name="playerLeft"
                placeholder="Enter Player 1 name..."
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.playerLeft
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                maxLength={20}
                autoFocus
              />
              {errors.playerLeft && (
                <p className="text-red-500 text-sm mt-1">{errors.playerLeft}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="playerRight"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Player 2 (Right Paddle - ↑/↓ keys)
              </label>
              <input
                id="playerRight"
                type="text"
                name="playerRight"
                placeholder="Enter Player 2 name..."
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.playerRight
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                maxLength={20}
              />
              {errors.playerRight && (
                <p className="text-red-500 text-sm mt-1">{errors.playerRight}</p>
              )}
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Difficulty Level
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <Button
                    key={diff}
                    onClick={() => onDifficultyChange(diff)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                      getDifficultyColor(diff, difficulty === diff)
                    )}
                    disabled={isPlaying || winner !== null}
                  >
                    <span className="flex items-center gap-2">
                      {getDifficultyIcon(diff)}
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      {diff === 'hard' && <Zap className="w-3 h-3" />}
                      {diff === 'medium' && <Target className="w-3 h-3" />}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Start Game 🚀
              </Button>
            </div>
          </form>

          <Controls />
        </div>
      </div>
    </div>
  );
}
