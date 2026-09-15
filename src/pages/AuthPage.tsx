import React, { useState } from 'react';
import {
  Swords,
  Lock,
  Mail,
  User,
  Code2,
  Cpu,
  Eye,
  EyeOff,
  Zap,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/starterTemplates';
import { loginAccount, registerAccount } from '../services/auth';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
}) => {
  const { onUserLogin } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLang, setPreferredLang] =
    useState<Language>('javascript');
  const [error, setError] = useState<string | null>(null);
  const [demoFilled, setDemoFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = loginAccount(identifier, password);

        if (!res.success) {
          setError(
            res.error ||
              'Failed to sign in. Please verify your credentials.'
          );
          setLoading(false);
          return;
        }

        if (res.user) {
          onUserLogin(res.user);
        }
      } else {
        const res = registerAccount(
          username,
          email,
          password,
          preferredLang
        );

        if (!res.success) {
          setError(
            res.error || 'Failed to register account.'
          );
          setLoading(false);
          return;
        }

        if (res.user) {
          onUserLogin(res.user);
        }
      }
    } catch (err: any) {
      setError(
        err.message ||
          'An unexpected authentication error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIdentifier('demo_user');
    setPassword('demo123');
    setError(null);
    setDemoFilled(true);

    setTimeout(() => setDemoFilled(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-start items-center px-4 pt-3 sm:pt-6 pb-6 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/5 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-6 space-y-4 text-left pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Swords className="w-3.5 h-3.5 text-cyan-400" />
            <span>Competitive Algorithmic Arena</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-white tracking-tight leading-tight">
              DSA <span className="text-cyan-400">ARENA</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono text-cyan-200/90 font-medium">
              "Think. Code. Compete. Improve."
            </p>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            Practice data structures and algorithms, solve timed
            challenges, and track your progress across multiple
            programming languages.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#090d16]/90 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Cpu className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-slate-100">
                  9 Polyglot Runtimes
                </p>

                <p className="text-[10px] text-slate-400 leading-tight">
                  JS, TS, Python, C++, Java, C, C#, Go, Rust
                </p>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-[#090d16]/90 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Trophy className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-slate-100">
                  Ranked Arena
                </p>

                <p className="text-[10px] text-slate-400 leading-tight">
                  Rating ladder & live timed duels
                </p>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-[#090d16]/90 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Terminal className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-slate-100">
                  Local Test Execution
                </p>

                <p className="text-[10px] text-slate-400 leading-tight">
                  Run solutions against problem test cases
                </p>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-[#090d16]/90 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-slate-100">
                  12 DSA Tracks
                </p>

                <p className="text-[10px] text-slate-400 leading-tight">
                  DP, Graphs, Trees, Arrays & more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden">
            {/* Top Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

            <div className="p-5 sm:p-6 space-y-4">
              {/* Card Header & Mode Switch */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                      {mode === 'login'
                        ? 'Developer Sign In'
                        : 'Create Account'}
                    </h2>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {mode === 'login'
                        ? 'Enter your credentials to access your session.'
                        : 'Set up your developer profile and preferred stack.'}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Segmented Mode Switcher */}
                <div className="grid grid-cols-2 p-1 bg-[#060911] rounded-xl border border-slate-800/80 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
                      mode === 'login'
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
                      mode === 'signup'
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'login' ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Username or Email
                      </label>

                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) =>
                            setIdentifier(e.target.value)
                          }
                          placeholder="e.g. demo_user or email"
                          className="w-full bg-[#060911] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          required
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="••••••••"
                          className="w-full bg-[#060911] border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Fill Demo Account Details Action */}
                    <div className="pt-0.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleFillDemo}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition-all cursor-pointer group"
                      >
                        <Terminal className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                        <span>
                          Fill Demo Account Details
                        </span>
                      </button>

                      {demoFilled && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Loaded
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Username
                      </label>

                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) =>
                            setUsername(e.target.value)
                          }
                          placeholder="e.g. AlgoMaster"
                          className="w-full bg-[#060911] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="you@domain.com"
                          className="w-full bg-[#060911] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          required
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Min. 6 characters"
                          className="w-full bg-[#060911] border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1 font-medium">
                        Preferred Primary Language
                      </label>

                      <select
                        value={preferredLang}
                        onChange={(e) =>
                          setPreferredLang(
                            e.target.value as Language
                          )
                        }
                        className="w-full bg-[#060911] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option
                            key={lang.id}
                            value={lang.id}
                            className="bg-slate-900 text-slate-100"
                          >
                            {lang.name} ({lang.badge})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Submit Action */}
                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <span>
                      {loading
                        ? 'Authenticating...'
                        : mode === 'login'
                        ? 'Sign In to Arena'
                        : 'Create Account & Enter'}
                    </span>

                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Card Sub-footer */}
            <div className="px-5 py-2.5 bg-[#060911]/90 border-t border-slate-800/80 text-center text-[10px] text-slate-400 font-mono">
              DSA Arena • 9 Languages • Free Sandbox Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};