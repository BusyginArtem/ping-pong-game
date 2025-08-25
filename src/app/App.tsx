import { Sparkles, GamepadIcon, Trophy, Users, Target } from 'lucide-react';

import Board from '@/modules/game/ui/board';
import Controls from '@/modules/game/ui/controls';
import LeaderBoard from '@/modules/game/ui/leaderboard';

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className={`relative min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 `}>
        {/* Header Section */}
        <header className="mb-8 lg:mb-12 flex flex-col items-center text-center max-w-4xl">
          {/* Main Title */}
          <div className="relative mb-6">
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Ping Pong Game
            </h1>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GamepadIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Welcome to the Arena
              </span>
              <GamepadIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl">
              Experience the classic ping pong game with modern controls and stunning visuals.
              Challenge your friends and climb the leaderboard in this exciting arcade-style
              adventure!
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Two Player Mode</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4 text-green-500" />
                <span>Multiple Difficulties</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Leaderboard System</span>
              </div>
            </div>
          </div>

          {/* Quick Controls Preview */}
          <div className="mt-6 bg-gradient-to-r from-gray-100/80 to-blue-100/80 dark:from-gray-800/80 dark:to-blue-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
              Quick Controls:
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow-sm text-xs font-mono border">
                  W/S
                </kbd>
                <span>Player 1</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow-sm text-xs font-mono border">
                  ↑/↓
                </kbd>
                <span>Player 2</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow-sm text-xs font-mono border">
                  Space
                </kbd>
                <span>Pause</span>
              </div>
            </div>
          </div>
        </header>

        {/* Game Section */}
        <section className="flex flex-col items-center gap-6 lg:gap-8 w-full max-w-6xl">
          {/* Game Board */}
          <div className="w-full flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl scale-110"></div>
              <div className="relative">
                <Board />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full">
            <Controls />
          </div>
        </section>

        {/* Leaderboard Section */}
        <div className="w-full max-w-6xl mt-8 lg:mt-12">
          <LeaderBoard />
        </div>
      </main>
    </div>
  );
}

export default App;
