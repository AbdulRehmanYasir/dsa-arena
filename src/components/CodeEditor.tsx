import React, { useState } from 'react';
import { Language } from '../types';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Code,
  ChevronDown,
  Sun,
  Moon,
  Type,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/starterTemplates';

export type EditorTheme = 'dark' | 'light';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetCode?: () => void;
  readOnly?: boolean;
  theme?: EditorTheme;
  onThemeChange?: (theme: EditorTheme) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetCode,
  readOnly = false,
  theme: controlledTheme,
  onThemeChange,
}) => {
  const [internalTheme, setInternalTheme] = useState<EditorTheme>(() => {
    try {
      const saved = localStorage.getItem('dsa_arena_editor_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('sm');

  const theme: EditorTheme = controlledTheme !== undefined ? controlledTheme : internalTheme;

  const handleToggleTheme = () => {
    const nextTheme: EditorTheme = theme === 'dark' ? 'light' : 'dark';
    setInternalTheme(nextTheme);
    try {
      localStorage.setItem('dsa_arena_editor_theme', nextTheme);
    } catch (err) {
      console.error('Failed to save editor theme:', err);
    }
    if (onThemeChange) {
      onThemeChange(nextTheme);
    }
  };

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  const safeCode = typeof code === 'string' ? code : '';
  const lineCount = Math.max(1, safeCode.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces for tab
      const newValue = safeCode.substring(0, start) + '  ' + safeCode.substring(end);
      onChange(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden transition-all font-mono ${
        isDark
          ? 'bg-[#080c14] border border-slate-800 text-slate-100'
          : 'bg-[#f8fafc] border border-slate-300 text-slate-900 shadow-sm'
      } ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl border-cyan-500/50'
          : 'h-full min-h-[420px]'
      }`}
    >
      {/* IDE Top Bar */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 py-2 border-b text-xs transition-colors select-none ${
          isDark
            ? 'bg-[#0b101d] border-slate-800 text-slate-300'
            : 'bg-[#edf2f7] border-slate-300 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`flex items-center gap-1.5 font-semibold ${
              isDark ? 'text-cyan-400' : 'text-cyan-700'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">IDE</span>
          </div>

          {/* Multi-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 py-1 text-xs transition-colors border ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <span className={`font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {activeLangConfig.name}
              </span>
              <span
                className={`text-[10px] hidden sm:inline ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                .{activeLangConfig.extension}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              />
            </button>

            {isLangMenuOpen && (
              <div
                className={`absolute left-0 mt-1.5 w-64 rounded-xl shadow-2xl py-1.5 z-50 text-xs max-h-80 overflow-y-auto border ${
                  isDark
                    ? 'bg-[#0c101c] border-slate-800 text-slate-300'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
                onClick={() => setIsLangMenuOpen(false)}
              >
                <div
                  className={`px-3 py-1.5 text-[10px] uppercase font-semibold border-b ${
                    isDark
                      ? 'text-slate-400 border-slate-800/80'
                      : 'text-slate-500 border-slate-200'
                  }`}
                >
                  Select Programming Language (9 Supported)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        onLanguageChange(lang.id);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        isSelected
                          ? isDark
                            ? 'bg-cyan-500/15 text-cyan-300 font-bold border-l-2 border-cyan-400'
                            : 'bg-cyan-50 text-cyan-800 font-bold border-l-2 border-cyan-600'
                          : isDark
                          ? 'hover:bg-slate-800/60 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.name}</span>
                        <span
                          className={`text-[10px] ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          .{lang.extension}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          lang.isExecutableInClient
                            ? isDark
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isDark
                            ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/20'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        }`}
                      >
                        {lang.isExecutableInClient ? 'Live Run' : 'Check & Verify'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Engine Badge */}
          <span
            className={`hidden lg:inline text-[10px] px-2 py-0.5 rounded border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
          >
            {activeLangConfig.badge}
          </span>
        </div>

        {/* Action Controls & Theme Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Switcher Toggle */}
          <button
            onClick={handleToggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
            }`}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-semibold">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-semibold">Light</span>
              </>
            )}
          </button>

          {/* Font Size Toggle */}
          <button
            onClick={() =>
              setFontSize((prev) => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'))
            }
            title="Adjust Font Size"
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <Type className="w-3 h-3" />
            <span className="uppercase text-[10px] font-bold">{fontSize}</span>
          </button>

          {onResetCode && (
            <button
              onClick={onResetCode}
              title="Reset starter template code"
              className={`flex items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code Textarea Area */}
      <div className="relative flex-1 flex overflow-hidden text-sm leading-relaxed">
        {/* Line Numbers */}
        <div
          className={`select-none py-3 px-3 border-r text-right text-xs shrink-0 min-w-[44px] transition-colors ${
            isDark
              ? 'bg-[#060911] border-slate-800/80 text-slate-400'
              : 'bg-[#e2e8f0] border-slate-300 text-slate-500 font-semibold'
          }`}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          value={safeCode}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className={`w-full h-full py-3 px-4 resize-none outline-none font-mono leading-6 transition-colors ${
            fontSize === 'sm'
              ? 'text-xs sm:text-sm'
              : fontSize === 'md'
              ? 'text-sm sm:text-base'
              : 'text-base sm:text-lg'
          } ${
            isDark
              ? 'bg-[#080c14] text-slate-100 caret-cyan-400 selection:bg-cyan-500/30 selection:text-cyan-100'
              : 'bg-[#f8fafc] text-slate-900 caret-cyan-600 selection:bg-cyan-200 selection:text-slate-900'
          }`}
        />
      </div>
    </div>
  );
};
