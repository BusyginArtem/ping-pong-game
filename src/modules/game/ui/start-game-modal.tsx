import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/styling';
import { Settings } from 'lucide-react';
import { Difficulty, GameState } from '../types';
import {
  useGameActions,
  useGameDifficulty,
  useGamePlayerNames,
  useGameState,
  useGameWinner,
} from '../store/useGameStore';
import { Input } from '@/shared/ui/input';
import { DIFFICULTY_LEVELS } from '@/shared/constants';
import { getDifficultyColor } from '@/shared/utils/game';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';

interface StartGameModalProps {
  isOpen: boolean;
  onStartGame: (playerLeftName: string, playerRightName: string) => void;
  onCancel: () => void;
}

const Controls = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 /50 rounded-lg border border-gray-200 dark:border-gray-600">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Controls:</h3>
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div>
          Player 1:{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            W
          </kbd>{' '}
          /{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            S
          </kbd>{' '}
          keys
        </div>
        <div>
          Player 2:{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            ↑
          </kbd>{' '}
          /{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            ↓
          </kbd>{' '}
          keys
        </div>
        <div>
          Pause:{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            Space
          </kbd>
        </div>
        <div>
          Restart:{' '}
          <kbd className="bg-white dark:bg-gray-600 px-1 rounded border border-gray-300 dark:border-gray-500">
            R
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default function StartGameModal({ isOpen, onStartGame, onCancel }: StartGameModalProps) {
  const [errors, setErrors] = useState({ playerLeft: '', playerRight: '' });

  const difficulty = useGameDifficulty();
  const gameState = useGameState();
  const playerNames = useGamePlayerNames();
  const winner = useGameWinner();
  const { resetGame, setDifficulty } = useGameActions();
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    if (isOpen) {
      scrollToTop({ behavior: 'smooth' });
    }
  }, [isOpen, scrollToTop]);

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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Setup New Game
            </h2>
            <p className="text-gray-600">Enter player names to start</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="playerLeft" className="block text-sm font-medium text-gray-700 mb-2">
                Player 1 (Left Paddle - W/S keys)
              </label>
              <Input
                id="playerLeft"
                type="text"
                name="playerLeft"
                placeholder="Enter Player 1 name..."
                className={cn({
                  'border-red-500 focus:ring-red-500': errors.playerLeft,
                })}
                maxLength={20}
                autoFocus
              />
              {errors.playerLeft && (
                <p className="text-red-500 text-sm mt-1">{errors.playerLeft}</p>
              )}
            </div>

            <div>
              <label htmlFor="playerRight" className="block text-sm font-medium text-gray-700 mb-2">
                Player 2 (Right Paddle - ↑/↓ keys)
              </label>
              <Input
                id="playerRight"
                type="text"
                name="playerRight"
                placeholder="Enter Player 2 name..."
                className={cn({
                  'border-red-500 focus:ring-red-500': errors.playerLeft,
                })}
                maxLength={20}
              />
              {errors.playerRight && (
                <p className="text-red-500 text-sm mt-1">{errors.playerRight}</p>
              )}
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gray-50 /30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Difficulty Level</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {DIFFICULTY_LEVELS.map((diff) => (
                  <Button
                    key={diff}
                    type="button"
                    onClick={() => onDifficultyChange(diff)}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200',
                      getDifficultyColor(diff),
                      {
                        'bg-white text-gray-600 hover:bg-gray-50 border-gray-300':
                          difficulty !== diff,
                      }
                    )}
                    disabled={isPlaying || winner !== null}
                  >
                    <span className="flex items-center gap-2">
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white">
                Start Game
              </Button>
            </div>
          </form>

          <Controls />
        </div>
      </div>
    </div>
  );
}
