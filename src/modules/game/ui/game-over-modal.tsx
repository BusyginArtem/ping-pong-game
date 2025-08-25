import { Button } from '@/shared/ui/button';
import { Difficulty } from '../types';
import { useGameStore } from '../store/useGameStore';

interface GameOverModalProps {
  isOpen: boolean;
  onNewGame: () => void;
}

export default function GameOverModal({ isOpen, onNewGame }: GameOverModalProps) {
  const { playerNames, winner, score, difficulty } = useGameStore();

  if (!isOpen || !winner) return null;

  const winnerName = winner === 'playerLeft' ? playerNames.playerLeft : playerNames.playerRight;

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onNewGame} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-4 transform transition-all duration-200 scale-100">
        <div className="p-8 text-center">
          {/* Trophy/Winner Section */}
          <div className="mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {winnerName} Wins!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Congratulations on your victory!
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Final Score
            </h3>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${winner === 'playerLeft' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {score.playerLeft}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {playerNames.playerLeft}
                  {winner === 'playerLeft' && <span className="ml-1">👑</span>}
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">:</div>

              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${winner === 'playerRight' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {score.playerRight}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {playerNames.playerRight}
                  {winner === 'playerRight' && <span className="ml-1">👑</span>}
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBadge(difficulty)}`}
              >
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <div>🎮 Game saved to leaderboard</div>
              <div className="mt-1 text-blue-600 dark:text-blue-300">
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onNewGame} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Play Again
              <span className="ml-2">🔄</span>
            </Button>
            {/* <Button onClick={onNewGame} variant="outline" className="flex-1">
              New Players
              <span className="ml-2">👥</span>
            </Button> */}
          </div>

          <div className="mt-4">
            <Button
              onClick={onNewGame}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
