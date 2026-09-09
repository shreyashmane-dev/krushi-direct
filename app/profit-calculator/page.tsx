'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Sprout } from 'lucide-react';
import { ProfitCalculator } from '@/components/profit-calculator';
import { useLanguage } from '@/lib/i18n';

export default function ProfitCalculatorPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : language === 'hi' ? 'होम पेज पर वापस' : 'Back to Home'}</span>
        </Link>

        <Link
          href="/farmer/produce/new"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Sprout className="w-4 h-4" />
          <span>{language === 'mr' ? 'शेतमाल विका' : language === 'hi' ? 'फसल बेचें' : 'List Harvest Now'}</span>
        </Link>
      </div>

      {/* Main Interactive Calculator */}
      <ProfitCalculator />
    </div>
  );
}
