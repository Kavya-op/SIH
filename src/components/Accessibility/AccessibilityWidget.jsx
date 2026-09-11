import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Type,
  Sparkles,
  X,
  RotateCcw,
  Sliders,
  Check,
  Eye
} from 'lucide-react';

export default function AccessibilityWidget() {
  const { theme, toggleTheme, setTheme, fontSize, setFontSize, addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = () => {
    setTheme('dark');
    setFontSize('normal');
    addToast('Accessibility settings reset to default', 'info');
  };

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      aria-label="Global Accessibility Floating Menu"
    >
      {/* POP-UP ACCESSIBILITY MENU */}
      {isOpen && (
        <div
          className={`mb-3 w-72 sm:w-80 rounded-2xl shadow-2xl border p-5 transition-all duration-200 animate-fadeIn ${
            theme === 'light'
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-blue-500/10'
              : 'bg-[#0a0f1d]/95 border-blue-500/30 text-white shadow-blue-500/20'
          } backdrop-blur-xl`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center border border-blue-500/30">
                <Sliders size={14} />
              </div>
              <h4 className="text-sm font-bold tracking-tight">Accessibility & Display</h4>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* CONTROL 1: THEME TOGGLE (DARK / LIGHT) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sun size={13} className="text-amber-400" />
                <span>Theme Mode</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20 uppercase">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/20 border border-white/10 gap-1">
              <button
                onClick={() => {
                  setTheme('dark');
                  addToast('Dark mode activated', 'info');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Moon size={14} />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => {
                  setTheme('light');
                  addToast('Light mode activated', 'info');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sun size={14} />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* CONTROL 2: GLOBAL FONT SIZE ADJUSTER */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type size={13} className="text-sky-400" />
                <span>Global Font Size</span>
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-medium">
                {fontSize === 'small' ? '14px (Compact)' : fontSize === 'large' ? '18.5px (Enlarged)' : '16px (Default)'}
              </span>
            </div>

            {/* A-, A, A+ Control Group */}
            <div className="grid grid-cols-3 p-1 rounded-xl bg-black/20 border border-white/10 gap-1">
              <button
                onClick={() => {
                  setFontSize('small');
                  addToast('Font size: Small (Compact)', 'info');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  fontSize === 'small'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Small font size"
              >
                <span className="text-sm">A-</span>
                <span className="text-[9px] font-normal opacity-70">Small</span>
              </button>

              <button
                onClick={() => {
                  setFontSize('normal');
                  addToast('Font size: Normal (Default)', 'info');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  fontSize === 'normal'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Normal standard font size"
              >
                <span className="text-base">A</span>
                <span className="text-[9px] font-normal opacity-70">Default</span>
              </button>

              <button
                onClick={() => {
                  setFontSize('large');
                  addToast('Font size: Large (Enlarged)', 'info');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  fontSize === 'large'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Large enlarged font size"
              >
                <span className="text-lg">A+</span>
                <span className="text-[9px] font-normal opacity-70">Large</span>
              </button>
            </div>
          </div>

          {/* FOOTER CONTROLS: RESET & STATUS */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset to Defaults</span>
            </button>

            <span className="text-[10px] text-sky-400/80 font-medium">
              Instant Sync
            </span>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        id="accessibility-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-400 shadow-blue-600/50'
            : theme === 'light'
            ? 'bg-white text-slate-800 border-slate-300 shadow-lg shadow-blue-500/10 hover:border-blue-500'
            : 'bg-[#0a0f1d] text-white border-blue-500/40 shadow-xl shadow-blue-500/20 hover:border-blue-400'
        }`}
        title="Accessibility & Theme Controls (Theme, Font Size)"
        aria-expanded={isOpen}
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm pointer-events-none group-hover:bg-blue-500/40 transition-all" />

        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center text-xs shadow-md">
            <Eye size={13} />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Accessibility
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300">
            {theme === 'dark' ? 'Dark' : 'Light'} • {fontSize === 'small' ? 'A-' : fontSize === 'large' ? 'A+' : 'A'}
          </span>
        </div>
      </button>
    </div>
  );
}
