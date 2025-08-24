import Board from '@/modules/game/ui/board';
import Controls from '@/modules/game/ui/controls';
import LeaderBoard from '@/modules/game/ui/leaderboard';

function App() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-8 ">
      <header className="mb-8 flex flex-col items-center text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Ping Pong Game</h1>

        <p>
          Welcome to the Ping Pong Game! Use the W/S keys to move the left paddle and ArrowUp/Down
          keys to move the right paddle. Have fun!
        </p>
      </header>

      <section className="flex flex-col items-center gap-8">
        <Board />
        <Controls />
      </section>

      <LeaderBoard />
    </main>
  );
}

export default App;
