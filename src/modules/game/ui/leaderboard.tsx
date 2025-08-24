import { useLeaderBoard } from '../hooks/useLeaderBoard';

function LeaderBoard() {
  const { leaderboard } = useLeaderBoard();

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded">
      <h3 className="text-white text-xl font-bold mb-4 text-center">Recent Games</h3>
      {leaderboard.length === 0 ? (
        <p className="text-gray-400 text-center">No games played yet</p>
      ) : (
        <div className="space-y-2">
          {leaderboard
            .slice(-5)
            .reverse()
            .map((entry, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-sm text-white">
                <div className="flex justify-between">
                  <span>
                    P1: {entry.playerLeft} - P2: {entry.playerRight}
                  </span>
                  <span className="text-gray-300">{entry.difficulty}</span>
                </div>
                <div className="text-xs text-gray-400">{entry.date}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default LeaderBoard;
