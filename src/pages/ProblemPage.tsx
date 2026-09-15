import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language, ExecutionResult, Problem } from '../types';
import { runCodeAgainstTestCases } from '../services/codeRunner';
import { CodeEditor } from '../components/CodeEditor';
import { TestCaseRunner } from '../components/TestCaseRunner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  Code2,
  Play,
  ChevronLeft,
  Terminal,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

function getSafeStarterCode(
  prob: Problem | null | undefined,
  lang: Language
): string {
  if (!prob || !prob.starterCode) {
    return '// Write your solution here\n';
  }

  return (
    prob.starterCode[lang] ||
    prob.starterCode.javascript ||
    '// Write your solution here\n'
  );
}

export const ProblemPage: React.FC = () => {
  const {
    selectedProblem,
    recordUserSubmission,
    setActiveTab,
    currentUser,
    getProblemCode,
    saveProblemCode,
    clearProblemCode,
  } = useApp();

  const [language, setLanguage] = useState<Language>(
    () => currentUser?.preferredLanguage || 'javascript'
  );

  const [code, setCode] = useState<string>(() => {
    if (selectedProblem) {
      const saved = getProblemCode(
        selectedProblem.id,
        currentUser?.preferredLanguage || 'javascript'
      );

      if (saved) return saved;

      return getSafeStarterCode(
        selectedProblem,
        currentUser?.preferredLanguage || 'javascript'
      );
    }

    return '// Write your solution here\n';
  });

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  // Sync user preferred language when user profile changes
  useEffect(() => {
    if (currentUser?.preferredLanguage) {
      setLanguage(currentUser.preferredLanguage);
    }
  }, [currentUser?.id, currentUser?.preferredLanguage]);

  // Sync starter code or saved code when problem/language/user changes
  useEffect(() => {
    if (selectedProblem && selectedProblem.id) {
      const saved = getProblemCode(
        selectedProblem.id,
        language
      );

      if (saved) {
        setCode(saved);
      } else {
        setCode(
          getSafeStarterCode(
            selectedProblem,
            language
          )
        );
      }

      setExecutionResult(null);
    }
  }, [selectedProblem?.id, language, currentUser?.id]);

  // Switch starter code when language changes
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);

    if (selectedProblem) {
      const saved = getProblemCode(
        selectedProblem.id,
        newLang
      );

      if (saved) {
        setCode(saved);
      } else {
        setCode(
          getSafeStarterCode(
            selectedProblem,
            newLang
          )
        );
      }
    }

    setExecutionResult(null);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    if (selectedProblem) {
      saveProblemCode(
        selectedProblem.id,
        language,
        newCode
      );
    }
  };

  const handleResetCode = () => {
    if (selectedProblem) {
      clearProblemCode(
        selectedProblem.id,
        language
      );

      setCode(
        getSafeStarterCode(
          selectedProblem,
          language
        )
      );
    }

    setExecutionResult(null);
  };

  // Run code against test cases
  const handleRunCode = async () => {
    if (!selectedProblem) return;

    setIsRunning(true);

    try {
      const result = await runCodeAgainstTestCases(
        selectedProblem,
        code,
        language
      );

      setExecutionResult(result);
    } catch (err) {
      console.error('Run code error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution
  const handleSubmitCode = async () => {
    if (!selectedProblem) return;

    setIsRunning(true);

    try {
      const execResult =
        await runCodeAgainstTestCases(
          selectedProblem,
          code,
          language
        );

      setExecutionResult(execResult);

      const ratingDelta = execResult.success
        ? selectedProblem.difficulty === 'Easy'
          ? 10
          : selectedProblem.difficulty === 'Medium'
            ? 20
            : 35
        : 0;

      const xpEarned = execResult.success
        ? selectedProblem.difficulty === 'Easy'
          ? 50
          : selectedProblem.difficulty === 'Medium'
            ? 100
            : 200
        : 10;

      const score = Math.round(
        (execResult.testsPassed /
          Math.max(1, execResult.totalTests)) *
          100
      );

      recordUserSubmission(
        {
          id: Math.random()
            .toString(36)
            .substring(2, 9),
          problemId: selectedProblem.id,
          problemTitle: selectedProblem.title,
          difficulty: selectedProblem.difficulty,
          topic: selectedProblem.topic,
          code,
          language,
          passed: execResult.success,
          testsPassed: execResult.testsPassed,
          totalTests: execResult.totalTests,
          runtimeMs: execResult.runtimeMs,
          memoryMB: execResult.memoryMB,
          submittedAt: new Date().toISOString(),
          score,
          mode: 'practice',
        },
        ratingDelta,
        xpEarned
      );
    } catch (err) {
      console.error(
        'Submission error:',
        err
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Safe fallback if problem is not found
  if (!selectedProblem || !selectedProblem.id) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#0a0e1a] border border-slate-800 text-center space-y-4 font-mono shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">
          Problem Not Found
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          We couldn't load this problem correctly.
          The requested problem could not be found
          or has not been loaded into the active
          session.
        </p>

        <div className="pt-2">
          <button
            onClick={() =>
              setActiveTab('practice')
            }
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Problem List</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      contextName="ProblemPage"
      fallbackTitle="Problem Workspace Error"
      fallbackMessage="An error occurred inside the code editor workspace."
      onRetry={handleResetCode}
      onBackToPractice={() =>
        setActiveTab('practice')
      }
    >
      <div className="max-w-7xl mx-auto px-4 py-6 font-mono space-y-4">

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0a0e1a] border border-slate-800 p-4 rounded-2xl">

          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setActiveTab('practice')
              }
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
              title="Back to Problem List"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400 font-semibold">
                  {selectedProblem.topic}
                </span>

                <span className="text-slate-600">
                  •
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedProblem.difficulty ===
                    'Easy'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      : selectedProblem.difficulty ===
                          'Medium'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {selectedProblem.difficulty}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {selectedProblem.title}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">

            {/* Reset */}
            <button
              onClick={handleResetCode}
              disabled={isRunning}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors disabled:opacity-50 cursor-pointer"
              title="Reset to Starter Template"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Run Code */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isRunning
                  ? 'Running...'
                  : 'Run Code'}
              </span>
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmitCode}
              disabled={isRunning}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />

              <span>
                {isRunning
                  ? 'Evaluating...'
                  : 'Submit'}
              </span>
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Problem Description */}
          <div className="lg:col-span-5 bg-[#0a0e1a] border border-slate-800 rounded-2xl p-5 space-y-5 max-h-[750px] overflow-y-auto">

            {/* Description */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                Description
              </h3>

              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {selectedProblem.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Examples
              </h3>

              {(selectedProblem.examples || []).map(
                (ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#060911] border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="text-slate-400 font-semibold">
                      Example {idx + 1}:
                    </div>

                    <div className="text-slate-300">
                      <strong className="text-slate-400">
                        Input:
                      </strong>{' '}
                      {ex.input}
                    </div>

                    <div className="text-emerald-400">
                      <strong className="text-slate-400">
                        Output:
                      </strong>{' '}
                      {ex.output}
                    </div>

                    {ex.explanation && (
                      <div className="text-slate-400 text-[11px] italic mt-1">
                        <strong className="text-slate-500">
                          Explanation:
                        </strong>{' '}
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                Constraints
              </h3>

              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                {(selectedProblem.constraints || []).map(
                  (constraint, index) => (
                    <li key={index}>
                      {constraint}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Code Editor & Results */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Code Editor */}
            <div className="bg-[#0a0e1a] border border-slate-800 rounded-2xl p-4">
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
                onLanguageChange={
                  handleLanguageChange
                }
              />
            </div>

            {/* Test Results */}
            <div className="bg-[#0a0e1a] border border-slate-800 rounded-2xl overflow-hidden">

              <div className="flex border-b border-slate-800 bg-[#070b14] px-3 pt-2">
                <div className="px-4 py-2 text-xs font-semibold rounded-t-xl bg-[#0a0e1a] text-cyan-400 border-t border-x border-slate-700">
                  Test Results
                </div>
              </div>

              <div className="p-4">
                <TestCaseRunner
                  executionResult={executionResult}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};