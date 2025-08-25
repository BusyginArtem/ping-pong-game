import { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Calendar,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLeaderBoard } from '../hooks/useLeaderBoard';
import { Button } from '@/shared/ui/button';
import type { Difficulty } from '../types';

function LeaderBoard() {
  const { leaderboard } = useLeaderBoard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  const getDifficultyIcon = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
            #{index + 1}
          </span>
        );
    }
  };

  const getWinner = (entry: (typeof leaderboard)[0]) => {
    const scores = entry.score.split('-').map(Number);
    const leftScore = scores[0];
    const rightScore = scores[1];

    if (leftScore > rightScore) {
      return {
        winner: entry.playerLeft,
        loser: entry.playerRight,
        winnerScore: leftScore,
        loserScore: rightScore,
      };
    } else {
      return {
        winner: entry.playerRight,
        loser: entry.playerLeft,
        winnerScore: rightScore,
        loserScore: leftScore,
      };
    }
  };

  const filteredLeaderboard = leaderboard.filter(
    (entry) => filterDifficulty === 'all' || entry.difficulty === filterDifficulty
  );

  const displayedGames = isExpanded ? filteredLeaderboard : filteredLeaderboard.slice(0, 3);

  if (leaderboard.length === 0) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🏓</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Games Yet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start playing to see your match history here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <h3 className="text-xl font-bold text-white">Match History</h3>
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {leaderboard.length} games
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filterDifficulty === diff
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              {diff === 'all'
                ? 'All'
                : `${getDifficultyIcon(diff as Difficulty)} ${diff.charAt(0).toUpperCase() + diff.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {displayedGames.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No games found for {filterDifficulty} difficulty
            </p>
          </div>
        ) : (
          displayedGames.reverse().map((entry, index) => {
            const { winner, loser, winnerScore, loserScore } = getWinner(entry);
            const actualIndex = filteredLeaderboard.length - 1 - index;

            return (
              <div
                key={`${entry.date}-${index}`}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">{getRankIcon(actualIndex)}</div>

                    {/* Match Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {winner}
                        </span>
                        <span className="text-gray-400">defeated</span>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {loser}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                          {winnerScore} - {loserScore}
                        </div>
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(entry.difficulty)}`}
                    >
                      {getDifficultyIcon(entry.difficulty)} {entry.difficulty.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show More/Less Button */}
      {filteredLeaderboard.length > 3 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show {filteredLeaderboard.length - 3} More Games <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-center">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{leaderboard.length} Total Games</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>
              Best of{' '}
              {Math.max(
                ...leaderboard.map((entry) => Math.max(...entry.score.split('-').map(Number)))
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
