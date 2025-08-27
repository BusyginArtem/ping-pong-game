import { Play, Pause, RotateCcw, Users, GamepadIcon, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  useGameActions,
  useGameState,
  useGameWinner,
  useGamePlayerNames,
} from '../store/useGameStore';
import { GameState } from '../types';
import { cn } from '@/shared/utils/styling';

function Controls() {
  const { setGameState, updateControls, resetGame } = useGameActions();
  const gameState = useGameState();
  const playerNames = useGamePlayerNames();
  const winner = useGameWinner();

  const isPlaying = gameState === GameState.PLAYING;
  const hasPlayerNames = playerNames.playerLeft && playerNames.playerRight;

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
    resetGame();
  };

  const getStartButtonText = () => {
    if (isPlaying) return 'Pause Game';
    if (gameState === GameState.PAUSED && hasPlayerNames) return 'Resume Game';
    if (hasPlayerNames) return 'Start Game';
    return 'New Game';
  };

  return (
    <div className="w-full max-w-4xl mx-auto" data-testid="controls">
      {/* Game Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 dark:bg-gray-900 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-center gap-3">
            <GamepadIcon className="w-5 h-5 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-100">Game Controls</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Player Names Display */}
          {hasPlayerNames && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {playerNames.playerLeft}
                  </span>
                </div>
                <div className="text-gray-400 font-medium">VS</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
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
              className={cn('px-6 py-3 font-medium rounded-md transition-all duration-200', {
                'bg-gray-800 hover:bg-gray-700 text-white': !isPlaying,
                'bg-gray-600 hover:bg-gray-500 text-white': isPlaying,
              })}
              disabled={winner !== null}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {getStartButtonText()}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {getStartButtonText()}
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="px-6 py-3 font-medium rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={winner !== null}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {hasPlayerNames ? 'Reset Game' : 'Reset'}
            </Button>

            {hasPlayerNames && (
              <Button
                onClick={handleNewGame}
                size="lg"
                variant="outline"
                className="px-6 py-3 font-medium rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isPlaying}
              >
                <Users className="w-4 h-4 mr-2" />
                New Players
              </Button>
            )}
          </div>

          {/* Game Status Indicator */}
          {gameState !== GameState.MENU && gameState !== GameState.IDLE && (
            <div className="text-center">
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border',
                  {
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600':
                      isPlaying || winner,
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600':
                      gameState === GameState.PAUSED && !winner,
                  }
                )}
              >
                {isPlaying && (
                  <>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    Game in Progress
                  </>
                )}
                {gameState === GameState.PAUSED && !winner && (
                  <>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Game Paused
                  </>
                )}
                {winner && (
                  <>
                    <Settings className="w-4 h-4" />
                    Game Completed
                  </>
                )}
              </div>
            </div>
          )}

          {/* Controls Help */}
          {(isPlaying || gameState === GameState.PAUSED) && hasPlayerNames && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="text-center font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-2">
                <GamepadIcon className="w-4 h-4" />
                Keyboard Controls
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono border border-gray-300 dark:border-gray-600">
                    Space
                  </kbd>
                  <span>Pause</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono border border-gray-300 dark:border-gray-600">
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
