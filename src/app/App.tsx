import { GamepadIcon, Users, Target, Settings } from 'lucide-react';

import Board from '@/modules/game/ui/board';
import Controls from '@/modules/game/ui/controls';
import LeaderBoard from '@/modules/game/ui/leaderboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <main className="relative min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="mb-6 lg:mb-8 flex flex-col items-center text-center max-w-4xl">
          {/* Main Title */}
          <div className="relative mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
              Ping Pong Game
            </h1>
            <h2>Test GitHub Workflow</h2>
          </div>

          {/* Subtitle */}
          <div className="bg-white  rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GamepadIcon className="w-6 h-6 text-gray-600" />
              <span className="text-lg font-semibold text-gray-700">Classic Arcade Game</span>
            </div>

            <p className="text-gray-600 leading-relaxed text-base sm:text-md max-w-2xl">
              Experience the timeless ping pong game with smooth controls and clean visuals.
              Challenge your friends in this classic arcade-style game.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Two Player Mode</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Target className="w-4 h-4" />
                <span>Multiple Difficulties</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Settings className="w-4 h-4" />
                <span>Match History</span>
              </div>
            </div>
          </div>
        </header>

        {/* Game Section */}
        <section className="flex flex-col items-center gap-4 lg:gap-6 w-full max-w-6xl">
          {/* Game Board */}
          <div className="w-full flex justify-center">
            <Board />
          </div>

          {/* Controls */}
          <div className="w-full">
            <Controls />
          </div>
        </section>

        {/* Leaderboard Section */}
        <div className="w-full max-w-6xl">
          <LeaderBoard />
        </div>
      </main>
    </div>
  );
}

export default App;
