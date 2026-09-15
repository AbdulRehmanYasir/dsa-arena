import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../types';
import {
  Swords,
  LayoutDashboard,
  Code2,
  Trophy,
  LineChart,
  Flame,
  Award,
  Zap,
  User,
  LogOut,
  UserCheck,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProgress,
    currentUser,
    openAuthModal,
    onUserLogout,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice', icon: <Code2 className="w-4 h-4" /> },
    { id: 'arena', label: 'Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <LineChart className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
  ];

  const currentLevel = Math.floor(userProgress.xp / 250) + 1;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab(currentUser ? 'dashboard' : 'login')}
            className="flex items-center gap-2.5 cursor-pointer group select-none py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all shadow-sm shadow-cyan-950 shrink-0">
              <Swords className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex items-center">
              <span className="font-mono font-black text-base sm:text-lg text-white tracking-wider whitespace-nowrap">
                DSA <span className="text-cyan-400">ARENA</span>
              </span>
            </div>
          </div>

          {/* Navigation Links (Only shown when authenticated) */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* User Stats & Profile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Rating Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-white">{userProgress.rating}</span>
                </div>

                {/* XP Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-amber-300">{userProgress.xp}</span>
                  <span className="text-[10px] text-slate-400">XP</span>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-500/30 text-xs font-mono text-orange-400">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span className="font-bold">{userProgress.streakDays}d</span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border transition-all ${
                      activeTab === 'profile'
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <img
                      src={
                        currentUser.avatarUrl ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`
                      }
                      alt={currentUser.username}
                      className="w-6 h-6 rounded-full bg-slate-800 object-cover border border-slate-700"
                    />
                    <span className="text-xs font-mono font-medium hidden sm:inline max-w-[100px] truncate">
                      {currentUser.username}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-[#0b0f19] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-150 font-mono text-xs"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-bold truncate">{currentUser.username}</p>
                        </div>
                        <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-cyan-400">
                          <span>LVL {currentLevel}</span>
                          <span>•</span>
                          <span>Rating {userProgress.rating}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('profile')}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View Profile</span>
                      </button>

                      <div className="border-t border-slate-800/80 my-1" />

                      <button
                        onClick={onUserLogout}
                        className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-semibold text-xs">Arena Online</span>
                  <span className="text-slate-700 hidden sm:inline">•</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline font-medium">9 Runtimes Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer Bar (Only shown when authenticated) */}
      {currentUser && (
        <div className="md:hidden flex items-center justify-around bg-[#0b0f19] border-t border-slate-800/80 px-2 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono whitespace-nowrap ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono whitespace-nowrap ${
              activeTab === 'profile' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>
      )}
    </header>
  );
};
