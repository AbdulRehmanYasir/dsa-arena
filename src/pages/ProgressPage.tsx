import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Topic } from '../types';
import {
  LineChart as LineChartIcon,
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Code2,
  Clock,
  RotateCcw,
  BarChart2,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { userProgress, achievements, problems, resetAllProgress } = useApp();

  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [submissionSearch, setSubmissionSearch] = useState('');

  const unlockedSet = new Set(userProgress.unlockedAchievementIds);
  const solvedSet = new Set(userProgress.solvedProblemIds);

  // Difficulty counts
  const easyTotal = problems.filter((p) => p.difficulty === 'Easy').length;
  const easySolved = problems.filter((p) => p.difficulty === 'Easy' && solvedSet.has(p.id)).length;

  const mediumTotal = problems.filter((p) => p.difficulty === 'Medium').length;
  const mediumSolved = problems.filter((p) => p.difficulty === 'Medium' && solvedSet.has(p.id)).length;

  const hardTotal = problems.filter((p) => p.difficulty === 'Hard').length;
  const hardSolved = problems.filter((p) => p.difficulty === 'Hard' && solvedSet.has(p.id)).length;

  // 12 DSA Topics Breakdown
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
    const topProbs = problems.filter((p) => p.topic === top);
    const topSolved = topProbs.filter((p) => solvedSet.has(p.id)).length;
    const pct = topProbs.length > 0 ? Math.round((topSolved / topProbs.length) * 100) : 0;
    return { topic: top, total: topProbs.length, solved: topSolved, pct };
  });

  // SVG Line Chart calculations for Rating History (honest: only if real points exist)
  const history = userProgress.ratingHistory || [];
  const hasHistory = history.length > 0;
  const maxRating = hasHistory ? Math.max(...history.map((h) => h.rating), userProgress.rating) : userProgress.rating;
  const minRating = hasHistory ? Math.min(...history.map((h) => h.rating), userProgress.rating - 100) : userProgress.rating - 100;

  const chartPoints = hasHistory && history.length > 1
    ? history.map((pt, idx) => {
        const x = (idx / Math.max(1, history.length - 1)) * 100;
        const y = 100 - ((pt.rating - minRating) / Math.max(1, maxRating - minRating)) * 80 - 10;
        return `${x},${y}`;
      }).join(' ')
    : '';

  // Filtered submissions
  const filteredSubmissions = userProgress.submissions.filter((sub) => {
    if (submissionFilter === 'passed' && !sub.passed) return false;
    if (submissionFilter === 'failed' && sub.passed) return false;
    if (submissionSearch.trim()) {
      return sub.problemTitle.toLowerCase().includes(submissionSearch.toLowerCase().trim());
    }
    return true;
  });

  // Calculate past 7 days activity metrics
  const now = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const submissionsByDay = past7Days.map((dayStr) => {
    const daySubs = userProgress.submissions.filter((s) => s.submittedAt.startsWith(dayStr));
    return {
      day: dayStr.slice(5),
      count: daySubs.length,
      passed: daySubs.filter((s) => s.passed).length,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-7 h-7 text-cyan-400" />
            Performance & Analytics
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real competitive metrics, 12 DSA topics breakdown, and submission auditing.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Reset Progress Data</span>
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0a0e1a] border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Rating</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{userProgress.rating}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e1a] border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Total XP</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{userProgress.xp}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e1a] border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{userProgress.streakDays} Days</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e1a] border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Unique Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {solvedSet.size} <span className="text-xs text-slate-400">/ {problems.length}</span>
          </div>
        </div>
      </div>

      {/* Rating History Timeline & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating History SVG Timeline (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Competitive Rating Progression
            </h3>
            <span className="text-xs text-cyan-400 font-bold">Rating: {userProgress.rating}</span>
          </div>

          {hasHistory && history.length > 1 ? (
            <div className="relative h-48 w-full bg-[#060911] border border-slate-800/80 rounded-xl p-4 overflow-hidden">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />

                <polygon
                  points={`0,100 ${chartPoints} 100,100`}
                  fill="rgba(6, 182, 212, 0.12)"
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
                <span>{history[history.length - 1]?.date}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#060911] border border-slate-800/80 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">No rating history yet.</p>
              <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
                Solve problems and compete in Arena to start tracking your progress over time.
              </p>
            </div>
          )}
        </div>

        {/* Weekly Performance Breakdown (1 col) */}
        <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            7-Day Activity
          </h3>

          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {submissionsByDay.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <div className="w-full h-24 bg-[#060911] border border-slate-800 rounded-lg flex flex-col justify-end p-1">
                  <div
                    className={`w-full rounded-md transition-all ${
                      d.count > 0 ? (d.passed > 0 ? 'bg-cyan-500' : 'bg-slate-700') : 'bg-transparent'
                    }`}
                    style={{ height: `${Math.min(100, d.count * 25)}%` }}
                    title={`${d.count} submissions (${d.passed} passed)`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
            <span>Total Attempts (7d):</span>
            <strong className="text-slate-200">
              {submissionsByDay.reduce((acc, curr) => acc + curr.count, 0)}
            </strong>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & 12 Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            Difficulty Breakdown
          </h3>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-bold">Easy</span>
                <span className="text-slate-300">{easySolved} / {easyTotal}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${easyTotal ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-bold">Medium</span>
                <span className="text-slate-300">{mediumSolved} / {mediumTotal}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${mediumTotal ? (mediumSolved / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-bold">Hard</span>
                <span className="text-slate-300">{hardSolved} / {hardTotal}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${hardTotal ? (hardSolved / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 12 DSA Topics Visualizer (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              12 DSA Foundations Mastery
            </h3>
            <span className="text-xs text-slate-400">Curated Progression</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {topicStats.map((t) => (
              <div key={t.topic} className="p-2.5 rounded-lg bg-[#060911] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="truncate text-slate-200">{t.topic}</span>
                  <span className="text-[10px] text-cyan-400 font-bold">{t.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-400 mt-1">
                  {t.solved} / {t.total} solved
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Matrix */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Achievements Matrix ({unlockedSet.size} / {achievements.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((ach) => {
            const isUnlocked = unlockedSet.has(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                    : 'bg-[#060911] border-slate-800/80 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-200">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Logs Table with Filter & Search */}
      <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 font-mono space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Submission Log History ({filteredSubmissions.length})
          </h3>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search problem..."
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="w-full bg-[#060911] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#060911] border border-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setSubmissionFilter('all')}
                className={`px-2 py-1 rounded ${
                  submissionFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSubmissionFilter('passed')}
                className={`px-2 py-1 rounded ${
                  submissionFilter === 'passed' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setSubmissionFilter('failed')}
                className={`px-2 py-1 rounded ${
                  submissionFilter === 'failed' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        {userProgress.submissions.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-mono">
            No submissions recorded yet. Head over to the Practice or Arena pages to solve your first challenge!
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">
            No submissions matched your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#060911] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Problem</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3">Tests Passed</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-100">{sub.problemTitle}</td>
                    <td className="py-2.5 px-3 text-slate-400 uppercase text-[10px]">{sub.mode}</td>
                    <td className="py-2.5 px-3">
                      {sub.passed ? (
                        <span className="text-emerald-400 font-bold">Passed</span>
                      ) : (
                        <span className="text-rose-400 font-bold">Failed</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {sub.testsPassed} / {sub.totalTests}
                    </td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">{sub.score} pts</td>
                    <td className="py-2.5 px-3 text-slate-400">{sub.submittedAt.split('T')[0]}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => setSelectedSubmissionCode(sub.code)}
                        className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
                      >
                        Inspect Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Inspector Modal */}
      {selectedSubmissionCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Submitted Code Inspector
              </h3>
              <button
                onClick={() => setSelectedSubmissionCode(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#050810] border border-slate-800 text-slate-200 text-xs overflow-x-auto max-h-80 leading-relaxed font-mono">
              {selectedSubmissionCode}
            </pre>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b101d] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 font-mono text-center">
            <h3 className="text-lg font-bold text-rose-300">Reset All Progress?</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This will reset your rating to 1200, clear solved problems, wipe achievements, and clear submission logs from LocalStorage.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
