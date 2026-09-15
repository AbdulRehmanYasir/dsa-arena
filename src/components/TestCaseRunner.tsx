import React, { useState } from 'react';
import { ExecutionResult, ExecutionStatusType } from '../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Terminal,
  ShieldAlert,
  AlertTriangle,
  Timer,
  FileCode,
} from 'lucide-react';

interface TestCaseRunnerProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
}

export const TestCaseRunner: React.FC<TestCaseRunnerProps> = ({
  executionResult,
  isRunning,
}) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  if (isRunning) {
    return (
      <div className="bg-[#080c14] border border-slate-800 rounded-xl p-6 text-center text-xs font-mono">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 animate-pulse">
          <Terminal className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Running code against test cases...</span>
        </div>
      </div>
    );
  }

  if (!executionResult) {
    return (
      <div className="bg-[#080c14] border border-slate-800 rounded-xl p-6 text-slate-400 text-xs font-mono flex flex-col items-center justify-center gap-2">
        <Terminal className="w-6 h-6 text-slate-400" />
        <p>Run or Submit your code to view execution output and test case results.</p>
      </div>
    );
  }

  const { results, success, testsPassed, totalTests, runtimeMs, memoryMB, error, statusType } =
    executionResult;
  const currentResult = results[activeCaseIdx] || results[0];

  // Helper for rendering status badge
  const renderStatusBadge = () => {
    if (success) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-xs font-mono shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>✓ Accepted</span>
          <span className="text-emerald-400/80 font-normal">({testsPassed} / {totalTests} Test Cases Passed)</span>
        </div>
      );
    }

    switch (statusType) {
      case 'COMPILATION_ERROR':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-300 font-bold text-xs font-mono shadow-sm">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>❌ Compilation Error</span>
          </div>
        );
      case 'TIME_LIMIT_EXCEEDED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-300 font-bold text-xs font-mono shadow-sm">
            <Timer className="w-4 h-4 text-amber-400" />
            <span>⏱️ Time Limit Exceeded</span>
          </div>
        );
      case 'RUNTIME_ERROR':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 font-bold text-xs font-mono shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>❌ Runtime Error</span>
            <span className="text-rose-400/80 font-normal">(Passed Tests: {testsPassed} / {totalTests})</span>
          </div>
        );
      case 'EMPTY_OUTPUT':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-300 font-bold text-xs font-mono shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>⚠️ Empty / Undefined Output</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 font-bold text-xs font-mono shadow-sm">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>❌ Wrong Answer</span>
            <span className="text-rose-400/80 font-normal">(Passed Tests: {testsPassed} / {totalTests})</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#080c14] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
      {/* Test Runner Status Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0b101d] border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          {renderStatusBadge()}
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Runtime: <strong className="text-slate-200">{runtimeMs} ms</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Memory: <strong className="text-slate-200">{memoryMB} MB</strong></span>
          </div>
        </div>
      </div>

      {/* Developer-oriented Error Diagnostic Display */}
      {error && (
        <div className="p-3.5 bg-rose-950/20 border-b border-rose-900/40 text-rose-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div className="overflow-x-auto w-full">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-rose-300">{error}</pre>
          </div>
        </div>
      )}

      {/* Case Tabs */}
      {results.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-2 bg-[#090d16] border-b border-slate-800 overflow-x-auto">
          {results.map((res, index) => (
            <button
              key={res.id}
              onClick={() => setActiveCaseIdx(index)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeCaseIdx === index
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {res.passed ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              )}
              <span>Case {index + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Case Details */}
      {currentResult && (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Input:</label>
            <pre className="p-2.5 rounded-lg bg-[#060911] border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">
              {currentResult.input}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Expected Output:</label>
              <pre className="p-2.5 rounded-lg bg-[#060911] border border-emerald-950/80 text-emerald-300 font-mono text-xs overflow-x-auto">
                {currentResult.expectedOutput}
              </pre>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Actual Output:</label>
              <pre
                className={`p-2.5 rounded-lg bg-[#060911] border font-mono text-xs overflow-x-auto ${
                  currentResult.passed
                    ? 'border-emerald-950/80 text-emerald-300'
                    : 'border-rose-950/80 text-rose-300'
                }`}
              >
                {currentResult.actualOutput}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
