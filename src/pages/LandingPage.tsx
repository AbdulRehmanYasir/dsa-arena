import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Swords,
  Code2,
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, userProgress, problems } = useApp();

  const totalProblems = problems.length;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none" />

      {/* Hero Section */}
      <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-sm">
          <Swords className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEXT-GEN COMPETITIVE PROGRAMMING PLATFORM</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-white mb-4">
          ⚔️ DSA <span className="text-cyan-400">ARENA</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl font-mono text-cyan-200/90 font-medium mb-6 tracking-wide">
          "Think. Code. Compete. Improve."
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
          A competitive programming arena for mastering data structures,
          algorithms, problem solving, and technical interview fundamentals.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('arena')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Swords className="w-4 h-4" />
            <span>ENTER ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-mono font-bold text-sm border border-slate-700 tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>START PRACTICING</span>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-left">
          <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Problems</span>
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-white">
              {totalProblems}
              <span className="text-cyan-400 text-lg">+</span>
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              Core DSA Topics
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Arena Challenges</span>
              <Swords className="w-4 h-4 text-amber-400" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-white">
              Timed
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              Rating & XP System
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Execution</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-white">
              Live
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              Test Case Execution
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-orange-400">
              {userProgress.streakDays} Days
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              Daily Code Habit
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-center font-mono text-xs uppercase tracking-widest text-slate-400 mb-8 font-semibold">
          Built for Software Engineers & Competitive Programmers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>

            <h3 className="font-mono font-bold text-base text-white mb-2">
              Structured DSA Practice
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Work through curated problems across core data structures and
              algorithms with progressively challenging problem sets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>

            <h3 className="font-mono font-bold text-base text-white mb-2">
              Algorithmic Analysis
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Review solution performance through correctness checks,
              complexity analysis, edge-case validation, and code quality
              metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Swords className="w-5 h-5" />
            </div>

            <h3 className="font-mono font-bold text-base text-white mb-2">
              Competitive Arena
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Take on timed challenges, earn XP, build your rating, and
              compete against your own previous performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};