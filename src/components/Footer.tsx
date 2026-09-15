import React from 'react';
import { Swords } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#060911] border-t border-slate-800/80 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">DSA ARENA</span>
          <span className="text-slate-400">• Think. Code. Compete. Improve.</span>
        </div>

        <div className="text-slate-300 font-medium text-xs">
          Built with ❤️ by Abdul Rehman Yasir
        </div>

        <div className="text-slate-400 text-[11px]">
          © {new Date().getFullYear()} DSA Arena.
        </div>
      </div>
    </footer>
  );
};
