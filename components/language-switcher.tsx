'use client';

import React from 'react';
import { useLanguage, Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'mr', label: 'मराठी', short: 'मरा' },
    { code: 'hi', label: 'हिंदी', short: 'हिं' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
      {options.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={opt.label}
          >
            {compact ? opt.short : opt.label}
          </button>
        );
      })}
    </div>
  );
}
