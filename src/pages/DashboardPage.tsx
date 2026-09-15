import React from 'react';
import { useApp } from '../context/AppContext';
import { Topic } from '../types';
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Code2,
  Calendar,
  ArrowUpRight,
  BarChart2,
  Play,
  Clock,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    userProgress,
    problems,
    openProblemForSolve,
    setActiveTab,
    dailyChallengeProblem,
  } = useApp();

  const solvedSet = new Set(userProgress.solvedProblemIds);
  const totalSolved = solvedSet.size;

  // Difficulty distribution
  const easyTotal = problems.filter(
    (p) => p.difficulty === 'Easy'
  ).length;

  const easySolved = problems.filter(
    (p) =>
      p.difficulty === 'Easy' &&
      solvedSet.has(p.id)
  ).length;

  const mediumTotal = problems.filter(
    (p) => p.difficulty === 'Medium'
  ).length;

  const mediumSolved = problems.filter(
    (p) =>
      p.difficulty === 'Medium' &&
      solvedSet.has(p.id)
  ).length;

  const hardTotal = problems.filter(
    (p) => p.difficulty === 'Hard'
  ).length;

  const hardSolved = problems.filter(
    (p) =>
      p.difficulty === 'Hard' &&
      solvedSet.has(p.id)
  ).length;

  // All 12 DSA topics
  const topics: Topic[] = [
    'Arrays',
    'Strings',
    'Hash Maps',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Recursion',
    'Sorting',
    'Searching',
    'Dynamic Programming',
  ];

  const topicStats = topics.map((top) => {
    const topProbs = problems.filter(
      (p) => p.topic === top
    );

    const topSolved = topProbs.filter(
      (p) => solvedSet.has(p.id)
    ).length;

    const pct =
      topProbs.length > 0
        ? Math.round(
            (topSolved / topProbs.length) * 100
          )
        : 0;

    return {
      topic: top,
      total: topProbs.length,
      solved: topSolved,
      pct,
    };
  });

  // Daily Challenge problem from deterministic calendar day
  const dailyProblem =
    dailyChallengeProblem || problems[0];

  // Rating History calculations
  const history =
    userProgress.ratingHistory || [];

  const hasHistory = history.length > 0;

  const maxRating = hasHistory
    ? Math.max(
        ...history.map((h) => h.rating),
        userProgress.rating
      )
    : userProgress.rating;

  const minRating = hasHistory
    ? Math.min(
        ...history.map((h) => h.rating),
        userProgress.rating - 50
      )
    : userProgress.rating - 50;

  const chartPoints =
    hasHistory && history.length > 1
      ? history
          .map((pt, idx) => {
            const x =
              (idx /
                Math.max(
                  1,
                  history.length - 1
                )) *
              100;

            const y =
              100 -
              ((pt.rating - minRating) /
                Math.max(
                  1,
                  maxRating - minRating
                )) *
                80 -
              10;

            return `${x},${y}`;
          })
          .join(' ')
      : '';

  // Determine user rating tier
  const getRatingTier = (r: number) => {
    if (r >= 1200) return 'Grandmaster';
    if (r >= 800) return 'Master';
    if (r >= 500) return 'Candidate Master';
    if (r >= 250) return 'Expert';
    if (r >= 100) return 'Specialist';
    if (r > 0) return 'Pupil';
    return 'Novice';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              Developer Dashboard
            </h1>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              12 TOPICS
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono mt-1">
            Track your competitive programming progress,
            solve daily tasks, and benchmark algorithmic skill.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('arena')}
            className="px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Enter Timed Arena</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>All Problems</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top-level Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        {/* Rating */}
        <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold text-slate-300">
              Rating
            </span>

            <Award className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="text-3xl font-extrabold text-white">
            {userProgress.rating}
          </div>

          <div className="text-[11px] text-cyan-400 mt-1 font-semibold">
            {getRatingTier(userProgress.rating)}
          </div>
        </div>

        {/* Total XP */}
        <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold text-slate-300">
              Total XP
            </span>

            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="text-3xl font-extrabold text-amber-300">
            {userProgress.xp}
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            Algorithmic Points
          </div>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold text-slate-300">
              Streak
            </span>

            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>

          <div className="text-3xl font-extrabold text-orange-400">
            {userProgress.streakDays}{' '}
            <span className="text-sm font-normal text-slate-400">
              Days
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            Daily Discipline
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold text-slate-300">
              Problems Solved
            </span>

            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-3xl font-extrabold text-emerald-300">
            {totalSolved}{' '}
            <span className="text-xs text-slate-400">
              / {problems.length}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round(
              (totalSolved / problems.length) * 100
            )}
            % Curated Set
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Challenge */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0c1324] via-[#090e1c] to-[#070b16] border-2 border-cyan-500/40 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold bg-cyan-950 border border-cyan-500/40 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                DAILY CHALLENGE
              </span>

              <span className="text-xs text-amber-300 font-mono font-semibold bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                +100 XP • +15 Rating
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
              <h3 className="text-xl font-bold text-white tracking-wide">
                {dailyProblem.title}
              </h3>

              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  dailyProblem.difficulty === 'Easy'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : dailyProblem.difficulty === 'Medium'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {dailyProblem.difficulty}
              </span>

              <span className="text-xs text-slate-400">
                • {dailyProblem.topic}
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-6 font-mono">
              {dailyProblem.description.replace(
                /```[\s\S]*?```/g,
                ''
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-mono text-slate-400">
              Complete your daily solve to extend your{' '}
              {userProgress.streakDays}-day streak.
            </span>

            <button
              onClick={() =>
                openProblemForSolve(dailyProblem)
              }
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-cyan-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SOLVE CHALLENGE ↗</span>
            </button>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Difficulty Breakdown
            </h3>

            <span className="text-xs text-slate-400">
              {totalSolved} / {problems.length}
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-emerald-400 font-bold">
                  Easy
                </span>

                <span className="text-slate-300">
                  {easySolved} / {easyTotal}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${
                      easyTotal
                        ? (easySolved / easyTotal) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-400 font-bold">
                  Medium
                </span>

                <span className="text-slate-300">
                  {mediumSolved} / {mediumTotal}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${
                      mediumTotal
                        ? (mediumSolved / mediumTotal) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-rose-400 font-bold">
                  Hard
                </span>

                <span className="text-slate-300">
                  {hardSolved} / {hardTotal}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{
                    width: `${
                      hardTotal
                        ? (hardSolved / hardTotal) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating History */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />

            <h3 className="text-sm font-bold text-slate-100">
              Rating History
            </h3>
          </div>

          <span className="text-xs text-cyan-400 font-semibold">
            Current: {userProgress.rating}
          </span>
        </div>

        {hasHistory && history.length > 1 ? (
          <div className="relative h-36 w-full bg-[#060911] border border-slate-800/80 rounded-xl p-4 overflow-hidden">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="25"
                x2="100"
                y2="25"
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeDasharray="2"
              />

              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeDasharray="2"
              />

              <line
                x1="0"
                y1="75"
                x2="100"
                y2="75"
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeDasharray="2"
              />

              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                points={chartPoints}
              />
            </svg>

            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{history[0]?.date}</span>

              <span>
                {history[history.length - 1]?.date}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#060911] border border-slate-800/80 text-center space-y-1">
            <p className="text-xs font-semibold text-slate-300">
              No rating history yet.
            </p>

            <p className="text-[11px] text-slate-400 font-sans">
              Solve problems and compete in the Arena to
              start tracking your competitive rating progress
              over time.
            </p>
          </div>
        )}
      </div>

      {/* Skill Progress Grid */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Skill Progress by Topic (12 Topics)
          </h3>

          <span className="text-xs text-slate-400">
            Curated Foundations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {topicStats.map((item) => (
            <div
              key={item.topic}
              className="p-3 rounded-xl bg-[#060911] border border-slate-800/80 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                <span className="truncate">
                  {item.topic}
                </span>

                <span className="text-[10px] text-cyan-400">
                  {item.pct}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{
                    width: `${item.pct}%`,
                  }}
                />
              </div>

              <div className="text-[10px] text-slate-400 mt-1">
                {item.solved} of {item.total} solved
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Submissions
          </h3>

          {userProgress.submissions.length > 0 && (
            <button
              onClick={() =>
                setActiveTab('progress')
              }
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {userProgress.submissions.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#060911] border border-slate-800/80 text-center space-y-3 font-mono">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Code2 className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                YOUR JOURNEY STARTS HERE
              </h4>

              <p className="text-xs text-slate-400 font-sans mt-1">
                Solve your first problem to begin building
                your DSA profile, rating, and streak.
              </p>
            </div>

            <button
              onClick={() =>
                setActiveTab('practice')
              }
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>START PRACTICING →</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#060911] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">
                    Problem
                  </th>
                  <th className="py-2.5 px-3">
                    Difficulty
                  </th>
                  <th className="py-2.5 px-3">
                    Topic
                  </th>
                  <th className="py-2.5 px-3">
                    Status
                  </th>
                  <th className="py-2.5 px-3">
                    Runtime
                  </th>
                  <th className="py-2.5 px-3">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {userProgress.submissions
                  .slice(0, 5)
                  .map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-900/40"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-100">
                        {sub.problemTitle}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.difficulty === 'Easy'
                              ? 'text-emerald-400 bg-emerald-950/60'
                              : sub.difficulty === 'Medium'
                              ? 'text-amber-400 bg-amber-950/60'
                              : 'text-rose-400 bg-rose-950/60'
                          }`}
                        >
                          {sub.difficulty}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-400">
                        {sub.topic}
                      </td>

                      <td className="py-2.5 px-3">
                        {sub.passed ? (
                          <span className="text-emerald-400 font-bold">
                            Passed
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold">
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-slate-400">
                        {sub.runtimeMs} ms
                      </td>

                      <td className="py-2.5 px-3 text-slate-400">
                        {sub.submittedAt.split('T')[0]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};