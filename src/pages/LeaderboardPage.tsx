import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Award, Flame, Zap, Crown, User, Info } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard, userProgress } = useApp();

  // Insert current user into leaderboard dynamically
  const currentUserEntry = {
    id: 'user-self',
    rank: 0,
    username: 'You (Current Session)',
    rating: userProgress.rating,
    problemsSolved: userProgress.solvedProblemIds.length,
    xp: userProgress.xp,
    streak: userProgress.streakDays,
    badge:
      userProgress.rating >= 2000
        ? 'Grandmaster'
        : userProgress.rating >= 1800
        ? 'Master'
        : userProgress.rating >= 1600
        ? 'Candidate Master'
        : userProgress.rating >= 1400
        ? 'Specialist'
        : userProgress.rating >= 1200
        ? 'Pupil'
        : 'Novice',
  };

  const combinedList = [...leaderboard, currentUserEntry].sort((a, b) => b.rating - a.rating);

  // Assign ranks
  const rankedList = combinedList.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-400" />
              Arena Benchmark Tiers
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-bold">
              LOCAL BENCHMARK
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Standardized competitive programming percentiles calibrated against your local rating and solved problems.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0e1a] border border-slate-800 text-slate-400 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>No external server: client-side benchmark</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#060911] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Programmer</th>
                <th className="py-3 px-4">Tier Badge</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Solved</th>
                <th className="py-3 px-4">Total XP</th>
                <th className="py-3 px-4">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedList.map((entry) => {
                const isSelf = entry.id === 'user-self';
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      isSelf ? 'bg-cyan-950/30 border-l-4 border-cyan-400 font-bold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4">
                      {entry.rank === 1 ? (
                        <Crown className="w-5 h-5 text-amber-400" />
                      ) : entry.rank === 2 ? (
                        <Crown className="w-5 h-5 text-slate-300" />
                      ) : entry.rank === 3 ? (
                        <Crown className="w-5 h-5 text-amber-700" />
                      ) : (
                        <span className="text-slate-400 font-mono">#{entry.rank}</span>
                      )}
                    </td>

                    {/* Username */}
                    <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      {isSelf && <User className="w-4 h-4 text-cyan-400" />}
                      <span className={isSelf ? 'text-cyan-300 font-bold' : ''}>
                        {entry.username}
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#060911] border border-slate-800 text-cyan-400">
                        {entry.badge}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{entry.rating}</span>
                    </td>

                    {/* Solved */}
                    <td className="py-3 px-4 text-slate-300 font-bold">
                      {entry.problemsSolved}
                    </td>

                    {/* XP */}
                    <td className="py-3 px-4 text-amber-300 font-bold">
                      {entry.xp} XP
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-4 text-orange-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{entry.streak}d</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
