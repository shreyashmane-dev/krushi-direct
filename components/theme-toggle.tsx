'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition duration-200 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="text-slate-200 font-medium">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700 font-medium">Dark</span>
        </>
      )}
    </button>
  );
}
