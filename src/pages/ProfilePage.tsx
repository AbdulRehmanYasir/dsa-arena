import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Calendar,
  Code2,
  Shield,
  Clock,
  LogOut,
  Edit3,
  Download,
  Terminal,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/starterTemplates';
import { Language } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    userProgress,
    problems,
    achievements,
    onUserLogout,
    updateUserBio,
    resetAllProgress,
    openProblemForSolve,
  } = useApp();

  if (!currentUser) return null;

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(currentUser.bio || '');
  const [newLang, setNewLang] = useState<Language>(currentUser.preferredLanguage || 'javascript');
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<{
    title: string;
    code: string;
    lang: string;
  } | null>(null);

  // Derive stats
  const totalProblems = problems.length;
  const solvedCount = userProgress.solvedProblemIds.length;
  const attemptedCount = userProgress.attemptedProblemIds.length;

  const easyProblems = problems.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = problems.filter((p) => p.difficulty === 'Medium');
  const hardProblems = problems.filter((p) => p.difficulty === 'Hard');

  const easySolved = easyProblems.filter((p) => userProgress.solvedProblemIds.includes(p.id)).length;
  const mediumSolved = mediumProblems.filter((p) => userProgress.solvedProblemIds.includes(p.id)).length;
  const hardSolved = hardProblems.filter((p) => userProgress.solvedProblemIds.includes(p.id)).length;

  const currentLevel = Math.floor(userProgress.xp / 250) + 1;
  const xpIntoCurrentLevel = userProgress.xp % 250;
  const xpForNextLevel = 250;
  const levelProgressPct = Math.min(100, Math.round((xpIntoCurrentLevel / xpForNextLevel) * 100));

  // Global ranking derivation based on user rating
  const getRankTitle = (rating: number) => {
    if (rating >= 1200) return { title: 'Grandmaster', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' };
    if (rating >= 800) return { title: 'Master', color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' };
    if (rating >= 500) return { title: 'Candidate Master', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' };
    if (rating >= 250) return { title: 'Expert', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' };
    if (rating >= 100) return { title: 'Specialist', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' };
    if (rating > 0) return { title: 'Pupil', color: 'text-blue-400 border-blue-500/40 bg-blue-950/30' };
    return { title: 'Apprentice', color: 'text-slate-400 border-slate-700 bg-slate-900/50' };
  };

  const rankInfo = getRankTitle(userProgress.rating);

  // Group problems by category
  const categories = Array.from(new Set(problems.map((p) => p.topic)));
  const categoryStats = categories.map((cat) => {
    const catProblems = problems.filter((p) => p.topic === cat);
    const catSolved = catProblems.filter((p) => userProgress.solvedProblemIds.includes(p.id)).length;
    return {
      name: cat,
      total: catProblems.length,
      solved: catSolved,
      pct: Math.round((catSolved / Math.max(1, catProblems.length)) * 100),
    };
  });

  const handleSaveProfile = () => {
    updateUserBio(newBio, newLang);
    setIsEditingBio(false);
  };

  const handleExportData = () => {
    const exportObject = {
      profile: currentUser,
      progress: userProgress,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_arena_backup_${currentUser.username}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-slate-200">
      {/* Profile Header Banner */}
      <div className="relative bg-[#0b101d] border border-slate-800/90 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                alt={currentUser.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#060911] border-2 border-slate-700/80 object-cover shadow-lg shadow-cyan-950/20"
              />
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                LVL {currentLevel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold font-mono text-white tracking-wide">
                  {currentUser.username}
                </h1>
                <span
                  className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${rankInfo.color}`}
                >
                  {rankInfo.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  {SUPPORTED_LANGUAGES.find((l) => l.id === currentUser.preferredLanguage)?.name || 'JavaScript'}
                </span>
              </div>

              <p className="text-sm text-slate-400 max-w-xl">
                {currentUser.bio || 'Competitive programmer mastering data structures and algorithms in the arena.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentUser.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handleExportData}
              title="Download backup of solved progress and submissions"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={onUserLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Edit bio inline drawer */}
        {isEditingBio && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Bio / Headline</label>
                <input
                  type="text"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Tell other developers about your algorithmic goals..."
                  className="w-full bg-[#060911] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Preferred Language</label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value as Language)}
                  className="w-full bg-[#060911] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 mt-4">
              <button
                onClick={() => setIsEditingBio(false)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Core Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating Metric */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Arena Rating</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {userProgress.rating}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Rank: <span className="text-cyan-300 font-semibold">{rankInfo.title}</span>
            </div>
          </div>
        </div>

        {/* XP Metric */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Total XP & Level</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              {userProgress.xp.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">XP</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Lvl {currentLevel}</span>
                <span>{xpIntoCurrentLevel}/{xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak Metric */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-400">
              {userProgress.streakDays}{' '}
              <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Keep coding daily to retain multiplier
            </div>
          </div>
        </div>

        {/* Solved / Total */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
              {solvedCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ {totalProblems}</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Attempted: <span className="text-slate-300 font-semibold">{attemptedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & Category Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Cards */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold font-mono text-white tracking-wide">
              DIFFICULTY COMPLETION
            </h2>
            <p className="text-xs text-slate-400">
              Breakdown of verified accepted solutions
            </p>
          </div>

          <div className="space-y-4">
            {/* Easy */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400 font-bold">EASY</span>
                <span className="text-slate-300">
                  {easySolved} / {easyProblems.length} ({Math.round((easySolved / Math.max(1, easyProblems.length)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(easySolved / Math.max(1, easyProblems.length)) * 100}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-400 font-bold">MEDIUM</span>
                <span className="text-slate-300">
                  {mediumSolved} / {mediumProblems.length} ({Math.round((mediumSolved / Math.max(1, mediumProblems.length)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(mediumSolved / Math.max(1, mediumProblems.length)) * 100}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-rose-400 font-bold">HARD</span>
                <span className="text-slate-300">
                  {hardSolved} / {hardProblems.length} ({Math.round((hardSolved / Math.max(1, hardProblems.length)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${(hardSolved / Math.max(1, hardProblems.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Mastery Grid */}
        <div className="lg:col-span-2 bg-[#0b101d] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-mono text-white tracking-wide">
              TOPIC MASTERY
            </h2>
            <p className="text-xs text-slate-400">
              All 12 Data Structure & Algorithm tracks with real solved tracking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categoryStats.map((cat) => (
              <div
                key={cat.name}
                className="bg-slate-900/50 border border-slate-800/70 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    {cat.solved}/{cat.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions & Achievements Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions Feed */}
        <div className="lg:col-span-2 bg-[#0b101d] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-mono text-white tracking-wide">
                RECENT SUBMISSIONS
              </h2>
              <p className="text-xs text-slate-400">
                Log of recent code runs and evaluations
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {userProgress.submissions.length} Total Logs
            </span>
          </div>

          {userProgress.submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs space-y-2 border border-dashed border-slate-800 rounded-xl">
              <Terminal className="w-6 h-6 mx-auto text-slate-400" />
              <p>No submissions recorded yet.</p>
              <p className="text-slate-400">Solve problems in Practice or Arena to start logging results.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {userProgress.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        sub.passed ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {sub.problemTitle}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            sub.passed
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {sub.passed ? 'Accepted' : 'Failed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                        <span>{sub.language.toUpperCase()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sub.runtimeMs} ms
                        </span>
                        <span>•</span>
                        <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setSelectedSubmissionCode({
                          title: sub.problemTitle,
                          code: sub.code,
                          lang: sub.language,
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                    >
                      View Code
                    </button>
                    <button
                      onClick={() => {
                        const prob = problems.find((p) => p.id === sub.problemId);
                        if (prob) openProblemForSolve(prob);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
                    >
                      Open Problem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Showcase */}
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-mono text-white tracking-wide">
                ACHIEVEMENTS
              </h2>
              <p className="text-xs text-slate-400">
                Unlocked badges from verified milestones
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {userProgress.unlockedAchievementIds.length} / {achievements.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {achievements.map((ach) => {
              const isUnlocked = userProgress.unlockedAchievementIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-cyan-950/20 border-cyan-500/30'
                      : 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                        isUnlocked
                          ? 'bg-cyan-900/40 border border-cyan-500/40 text-amber-300'
                          : 'bg-slate-800/50 border border-slate-700/50 grayscale'
                      }`}
                    >
                      {ach.icon || '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono font-bold truncate ${
                            isUnlocked ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/20 shrink-0">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code Modal */}
      {selectedSubmissionCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[80vh] flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedSubmissionCode.title}
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Language: {selectedSubmissionCode.lang.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionCode(null)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                Close
              </button>
            </div>
            <pre className="flex-1 overflow-auto bg-[#060911] border border-slate-800/80 p-4 rounded-xl text-slate-200 leading-relaxed">
              <code>{selectedSubmissionCode.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Reset Progress Danger Zone */}
      <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">
            Danger Zone: Reset Account Progress
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Clears your solved problems, streak, XP and rating history stored in local browser storage.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
              resetAllProgress();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 font-semibold transition-colors shrink-0"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};
