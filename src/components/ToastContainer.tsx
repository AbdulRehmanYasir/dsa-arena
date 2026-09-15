import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Trophy, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right ${
            toast.type === 'achievement'
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-100 shadow-amber-950/50'
              : toast.type === 'submission'
              ? 'bg-slate-900/90 border-cyan-500/40 text-slate-100 shadow-cyan-950/50'
              : 'bg-slate-900/90 border-slate-700 text-slate-100'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'achievement' ? (
              <Trophy className="w-5 h-5 text-amber-400" />
            ) : toast.type === 'submission' ? (
              <Zap className="w-5 h-5 text-cyan-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
