import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language, ExecutionResult, Problem } from '../types';
import { runCodeAgainstTestCases } from '../services/codeRunner';
import { CodeEditor } from '../components/CodeEditor';
import { TestCaseRunner } from '../components/TestCaseRunner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  Swords,
  Timer,
  Award,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trophy,
  Flame,
  ChevronLeft,
} from 'lucide-react';

function getSafeStarterCode(prob: Problem | null | undefined, lang: Language): string {
  if (!prob || !prob.starterCode) return '// Write your solution here\n';
  return prob.starterCode[lang] || prob.starterCode.javascript || '// Write your solution here\n';
}

export const ArenaPage: React.FC = () => {
  const {
    selectedProblem: appSelectedProblem,
    setSelectedProblem,
    problems,
    userProgress,
    recordUserSubmission,
    recordArenaMatch,
    currentUser,
    setActiveTab,
  } = useApp();

  const activeProblem = appSelectedProblem || problems[0];

  const [language, setLanguage] = useState<Language>(() => currentUser?.preferredLanguage || 'javascript');
  const [code, setCode] = useState<string>(() => getSafeStarterCode(activeProblem, 'javascript'));
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60); // 20 min countdown
  const [attemptsCount, setAttemptsCount] = useState<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [completedMetrics, setCompletedMetrics] = useState<{
    score: number;
    ratingDelta: number;
    xpEarned: number;
    speedBonus: number;
    timeSpentStr: string;
  } | null>(null);

  // Sync when active problem changes
  useEffect(() => {
    if (activeProblem) {
      setCode(getSafeStarterCode(activeProblem, language));
      setExecutionResult(null);
    }
  }, [activeProblem?.id]);

  const handleSelectAnotherProblem = (problemId: string) => {
    const p = problems.find((item) => item.id === problemId);
    if (p) {
      setSelectedProblem(p);
      setCode(getSafeStarterCode(p, language));
      setTimeLeftSeconds(20 * 60);
      setAttemptsCount(0);
      setExecutionResult(null);
      setIsCompleted(false);
      setCompletedMetrics(null);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(getSafeStarterCode(activeProblem, newLang));
    setExecutionResult(null); // Reset execution result on language switch
  };

  const handleResetCode = () => {
    setCode(getSafeStarterCode(activeProblem, language));
    setExecutionResult(null);
  };

  // Countdown timer effect
  useEffect(() => {
    if (isCompleted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, timeLeftSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Run or Submit Solution in Timed Arena
  const handleRunOrSubmit = async () => {
    if (!activeProblem) return;
    setIsRunning(true);
    setAttemptsCount((prev) => prev + 1);

    try {
      const result = await runCodeAgainstTestCases(activeProblem, code, language);
      setExecutionResult(result);

      if (result.success && !isCompleted) {
        setIsCompleted(true);
        const timeSpent = 20 * 60 - timeLeftSeconds;
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const timeStr = `${minutes}m ${seconds}s`;

        // Calculate Arena rewards
        const baseScore = 200;
        const speedMultiplier = Math.max(0, timeLeftSeconds / (20 * 60));
        const speedBonus = Math.round(speedMultiplier * 100);
        const penalty = attemptsCount * 15;
        const totalScore = Math.max(50, baseScore + speedBonus - penalty);

        const ratingDelta = activeProblem.difficulty === 'Easy' ? 25 : activeProblem.difficulty === 'Medium' ? 45 : 75;
        const xpEarned = totalScore;

        setCompletedMetrics({
          score: totalScore,
          ratingDelta,
          xpEarned,
          speedBonus,
          timeSpentStr: timeStr,
        });

        // Record submission in global history
        recordUserSubmission(
          {
            id: 'arena_' + Math.random().toString(36).substring(2, 9),
            problemId: activeProblem.id,
            problemTitle: activeProblem.title,
            difficulty: activeProblem.difficulty,
            topic: activeProblem.topic,
            code,
            language,
            passed: true,
            testsPassed: result.testsPassed,
            totalTests: result.totalTests,
            runtimeMs: result.runtimeMs,
            memoryMB: result.memoryMB,
            submittedAt: new Date().toISOString(),
            score: totalScore,
            mode: 'arena',
          },
          ratingDelta,
          xpEarned
        );

        recordArenaMatch({
          problemId: activeProblem.id,
          title: activeProblem.title,
          score: totalScore,
          timeSpent: timeStr,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Arena run error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!activeProblem) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#0a0e1a] border border-slate-800 text-center space-y-4 font-mono shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Arena Problem Available</h2>
        <p className="text-xs text-slate-400">Please choose a problem from practice to enter the Arena.</p>
        <button
          onClick={() => setActiveTab('practice')}
          className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
        >
          Back to Practice
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary
      contextName="ArenaPage"
      fallbackTitle="Arena Session Error"
      fallbackMessage="We encountered an issue during the timed Arena match."
      onRetry={handleResetCode}
      onBackToPractice={() => setActiveTab('practice')}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 font-mono space-y-4">
        {/* Arena Top Status Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c1424] via-[#090e1a] to-[#0a101f] border-2 border-cyan-500/40 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 tracking-wider">COMPETITIVE ARENA</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  RANKED
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                {activeProblem.title}
              </h2>
            </div>
          </div>

          {/* Center Timer & Problem Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#060911] border border-cyan-500/40 text-cyan-300">
              <Timer className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-sm font-bold font-mono tracking-widest">{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Select Another Arena Problem */}
            <select
              aria-label="Select Arena Problem"
              value={activeProblem.id}
              onChange={(e) => handleSelectAnotherProblem(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500 transition-colors"
            >
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCode}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleRunOrSubmit}
              disabled={isRunning || isCompleted}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-950 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompleted ? 'SOLVED ✓' : 'TEST & SUBMIT'}</span>
            </button>
          </div>
        </div>

        {/* Workspace 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Problem Details (5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0e1a] border border-slate-800 rounded-2xl p-5 space-y-4 max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">{activeProblem.topic}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  activeProblem.difficulty === 'Easy'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                    : activeProblem.difficulty === 'Medium'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                }`}
              >
                {activeProblem.difficulty}
              </span>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Description</h4>
              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {activeProblem.description}
              </p>
            </div>

            {/* Test Cases / Examples */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Public Test Cases</h4>
              {(activeProblem.testCases || []).slice(0, 2).map((tc, idx) => (
                <div key={tc.id || idx} className="p-3 rounded-xl bg-[#060911] border border-slate-800 text-xs">
                  <div className="text-slate-400 mb-1 font-semibold">Case {idx + 1}:</div>
                  <div className="text-slate-300">
                    <strong className="text-slate-400">Input:</strong> {tc.input}
                  </div>
                  <div className="text-emerald-400">
                    <strong className="text-slate-400">Expected:</strong> {tc.expectedOutput}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Constraints</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                {(activeProblem.constraints || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* IDE & Output (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="h-[460px]">
              <ErrorBoundary
                contextName="ArenaCodeEditor"
                fallbackTitle="Editor Error"
                fallbackMessage="Failed to load Arena code editor."
                onRetry={handleResetCode}
              >
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  onResetCode={handleResetCode}
                />
              </ErrorBoundary>
            </div>

            <TestCaseRunner executionResult={executionResult} isRunning={isRunning} />
          </div>
        </div>

        {/* Victory / Match Completed Overlay Modal */}
        {isCompleted && completedMetrics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0b101d] border-2 border-cyan-500/60 rounded-2xl max-w-lg w-full p-6 text-center space-y-5 shadow-2xl font-mono">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950">
                <Trophy className="w-8 h-8 animate-bounce text-amber-400" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">ARENA VICTORY!</h3>
                <p className="text-xs text-cyan-300 mt-1">
                  All test cases cleared in {completedMetrics.timeSpentStr}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#060911] border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Final Score</span>
                  <span className="text-xl font-bold text-amber-300">{completedMetrics.score}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Rating Change</span>
                  <span className="text-xl font-bold text-emerald-400">+{completedMetrics.ratingDelta}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">XP Bonus</span>
                  <span className="text-xl font-bold text-cyan-400">+{completedMetrics.xpEarned} XP</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('practice')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back to Practice
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
