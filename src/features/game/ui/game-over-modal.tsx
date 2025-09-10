import { Button } from '@/shared/ui/button';
import {
  useGameDifficulty,
  useGamePlayerNames,
  useGameScore,
  useGameWinner,
} from '../store/useGameStore';
import { getDifficultyColor } from '@/features/game/utils';

interface GameOverModalProps {
  isOpen: boolean;
  onNewGame: () => void;
}

export default function GameOverModal({ isOpen, onNewGame }: GameOverModalProps) {
  const difficulty = useGameDifficulty();
  const playerNames = useGamePlayerNames();
  const score = useGameScore();
  const winner = useGameWinner();

  if (!isOpen || !winner) return null;

  const winnerName = winner === 'playerLeft' ? playerNames.playerLeft : playerNames.playerRight;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid="game-over-modal"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onNewGame} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-lg mx-4">
        <div className="p-8 text-center">
          {/* Winner Section */}
          <div className="mb-6">
            <div className="text-4xl mb-4 text-gray-600">🏆</div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">{winnerName} Wins</h2>
            <p className="text-lg text-gray-600">Congratulations on your victory!</p>
          </div>

          {/* Score Display */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Final Score</h3>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${winner === 'playerLeft' ? 'text-gray-800' : 'text-gray-500'}`}
                >
                  {score.playerLeft}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {playerNames.playerLeft}
                  {winner === 'playerLeft' && <span className="ml-1 text-gray-700">👑</span>}
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-400">:</div>

              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${winner === 'playerRight' ? 'text-gray-800' : 'text-gray-500'}`}
                >
                  {score.playerRight}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {playerNames.playerRight}
                  {winner === 'playerRight' && <span className="ml-1 text-gray-700">👑</span>}
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getDifficultyColor(difficulty)}`}
              >
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="text-sm text-gray-700">
              <div>📊 Game saved to match history</div>
              <div className="mt-1 text-gray-600">
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col">
            <Button onClick={onNewGame} className=" bg-gray-800 hover:bg-gray-700 text-white">
              Play Again
            </Button>

            <Button
              onClick={onNewGame}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
