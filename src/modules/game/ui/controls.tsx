import { Play, Pause, RotateCcw, Users, GamepadIcon, Trophy } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store/useGameStore';
import { GameState } from '../types';
import { cn } from '@/shared/utils/styling';

function Controls() {
  const { updateControls, setGameState, resetGame, gameState, playerNames, winner } =
    useGameStore();

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

  const handleStartPause = () => {
    if (isPlaying) {
      setGameState(GameState.PAUSED);
      updateControls({
        playerLeftUp: false,
        playerLeftDown: false,
        playerRightUp: false,
        playerRightDown: false,
      });
    } else if (gameState === GameState.PAUSED && hasPlayerNames) {
      setGameState(GameState.PLAYING);
    } else {
      setGameState(GameState.MENU);
    }
  };

  const handleReset = () => {
    if (hasPlayerNames) {
      resetGame();
    } else {
      setGameState(GameState.MENU);
    }
  };

  const handleNewGame = () => {
    setGameState(GameState.MENU);
  };

  const getStartButtonText = () => {
    if (isPlaying) return 'Pause Game';
    if (gameState === GameState.PAUSED && hasPlayerNames) return 'Resume Game';
    if (hasPlayerNames) return 'Start Game';
    return 'New Game';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Game Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <GamepadIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Game Controls</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Player Names Display */}
          {hasPlayerNames && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {playerNames.playerLeft}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold">VS</span>
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-semibold text-red-700 dark:text-red-300">
                    {playerNames.playerRight}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleStartPause}
              size="lg"
              className={cn(
                'px-8 py-3 font-semibold text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105',
                {
                  'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200/50 dark:shadow-green-900/30':
                    !isPlaying,
                  'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-yellow-200/50 dark:shadow-yellow-900/30':
                    isPlaying,
                }
              )}
              disabled={winner !== null}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  {getStartButtonText()}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {getStartButtonText()}
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30"
              disabled={winner !== null}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {hasPlayerNames ? 'Reset Game' : 'Reset'}
            </Button>

            {hasPlayerNames && (
              <Button
                onClick={handleNewGame}
                size="lg"
                variant="outline"
                className="px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30"
                disabled={isPlaying}
              >
                <Users className="w-5 h-5 mr-2" />
                New Players
              </Button>
            )}
          </div>

          {/* Game Status Indicator */}
          {gameState !== GameState.MENU && (
            <div className="text-center">
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  {
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700':
                      isPlaying,
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700':
                      gameState === GameState.PAUSED && !winner,
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700':
                      winner,
                  }
                )}
              >
                {isPlaying && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Game in Progress
                  </>
                )}
                {gameState === GameState.PAUSED && !winner && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Game Paused
                  </>
                )}
                {winner && (
                  <>
                    <Trophy className="w-4 h-4" />
                    Game Completed
                  </>
                )}
              </div>
            </div>
          )}

          {/* Controls Help */}
          {(isPlaying || gameState === GameState.PAUSED) && hasPlayerNames && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-center font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-2">
                <GamepadIcon className="w-4 h-4" />
                Keyboard Controls
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                    {playerNames.playerLeft}
                  </div>
                  <div className="space-x-2">
                    <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono border border-gray-300 dark:border-gray-600">
                      W
                    </kbd>
                    <span className="text-gray-500">/</span>
                    <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono border border-gray-300 dark:border-gray-600">
                      S
                    </kbd>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Up / Down</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="font-medium text-red-600 dark:text-red-400 mb-2">
                    {playerNames.playerRight}
                  </div>
                  <div className="space-x-2">
                    <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono border border-gray-300 dark:border-gray-600">
                      ↑
                    </kbd>
                    <span className="text-gray-500">/</span>
                    <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono border border-gray-300 dark:border-gray-600">
                      ↓
                    </kbd>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Arrow Keys</div>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono border">
                    Space
                  </kbd>
                  <span>Pause</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono border">
                    R
                  </kbd>
                  <span>Restart</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Controls;
