import { Trophy, Medal, Award, Calendar, Users } from 'lucide-react';
import { useLeaderBoard } from '../hooks/useLeaderBoard';
import { getDifficultyColor, getWinner } from '@/shared/utils/game';
import { useGameEnded } from '../store/useGameStore';

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="w-5 h-5 text-gray-700" />;
    case 1:
      return <Medal className="w-5 h-5 text-gray-600" />;
    case 2:
      return <Award className="w-5 h-5 text-gray-500" />;
    default:
      return (
        <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
          #{index + 1}
        </span>
      );
  }
};

function LeaderBoard() {
  const { leaderboard } = useLeaderBoard();
  useGameEnded();

  const leaderboardLength = leaderboard.length;

  if (leaderboardLength === 0) {
    return (
      <div
        data-testid="leaderboard"
        className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="text-center">
          <div className="text-4xl mb-4 text-gray-400">🏓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Games Yet</h3>
          <p className="text-gray-600">Start playing to see your match history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="leaderboard"
      className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-800   px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-100">Match History</h3>
            <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm">
              {leaderboardLength} games
            </span>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="divide-y divide-gray-200">
        {leaderboard.reverse().map((entry, index) => {
          const { winner, loser, winnerScore, loserScore } = getWinner(entry);
          const actualIndex = leaderboardLength - 1 - index;

          return (
            <div
              key={`${entry.date}-${index}`}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">{getRankIcon(actualIndex)}</div>

                  {/* Match Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{winner}</span>
                      <span className="text-gray-500">defeated</span>
                      <span className="font-medium text-gray-600">{loser}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </div>
                      <div className="text-lg font-bold text-gray-700">
                        {winnerScore} - {loserScore}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(entry.difficulty)}`}
                  >
                    {entry.difficulty.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaderBoard;
