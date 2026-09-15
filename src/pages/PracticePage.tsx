import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  CheckCircle2,
  Code2,
  Swords,
  Trophy,
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const {
    problems,
    userProgress,
    openProblemForSolve,
    openArenaForProblem,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCompletion, setSelectedCompletion] = useState<string>('All');

  const topicsList = [
    'All',
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

  const solvedSet = new Set(userProgress.solvedProblemIds);

  const filteredProblems = problems.filter((problem) => {
    // Search query filter
    if (
      searchQuery.trim() !== '' &&
      !problem.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Topic filter
    if (selectedTopic !== 'All' && problem.topic !== selectedTopic) {
      return false;
    }

    // Difficulty filter
    if (
      selectedDifficulty !== 'All' &&
      problem.difficulty !== selectedDifficulty
    ) {
      return false;
    }

    // Completion filter
    if (selectedCompletion === 'Solved' && !solvedSet.has(problem.id)) {
      return false;
    }

    if (selectedCompletion === 'Unsolved' && solvedSet.has(problem.id)) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-7 h-7 text-cyan-400" />
          DSA Practice Problems
        </h1>

        <p className="text-xs text-slate-400 font-mono mt-1">
          Select from {problems.length} structured algorithmic challenges
          across 12 core topics.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0a0e1a] border border-slate-800 space-y-4 font-mono text-xs">
        {/* Search & Main Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search problem title or algorithm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060911] border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-[11px] shrink-0">
              Difficulty:
            </label>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#060911] border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Completion Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-[11px] shrink-0">
              Status:
            </label>

            <select
              value={selectedCompletion}
              onChange={(e) => setSelectedCompletion(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#060911] border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-end text-slate-400 text-xs">
            <span>
              Showing{' '}
              <strong className="text-cyan-400">
                {filteredProblems.length}
              </strong>{' '}
              problems
            </span>
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            Topics:
          </span>

          {topicsList.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                selectedTopic === topic
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-[#060911] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredProblems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-[#0a0e1a] border border-slate-800 rounded-2xl">
            No DSA problems match your filter criteria. Try clearing search or
            topic filters.
          </div>
        ) : (
          filteredProblems.map((problem) => {
            const isSolved = solvedSet.has(problem.id);
            const bestScore = userProgress.bestScores[problem.id] || 0;

            return (
              <div
                key={problem.id}
                className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSolved && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Solved
                        </span>
                      )}

                      {bestScore > 0 && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-bold">
                          <Trophy className="w-3 h-3" />
                          {bestScore} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors mb-1">
                    {problem.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Topic:{' '}
                    <strong className="text-slate-300">
                      {problem.topic}
                    </strong>
                  </p>
                </div>

                {/* Problem Actions */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/80 text-[11px]">
                  <button
                    onClick={() => openProblemForSolve(problem)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Solve</span>
                  </button>

                  <button
                    onClick={() => openArenaForProblem(problem)}
                    title="Start Timed Arena Challenge"
                    className="py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Swords className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};