'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Sprout, TrendingUp, Calculator } from 'lucide-react';
import MiddlemanSimulator from '@/components/middleman-simulator';
import { useLanguage } from '@/lib/i18n';

export default function RoiSimulatorPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : language === 'hi' ? 'होम पेज पर वापस' : 'Back to Home'}</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ROI Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profit-calculator"
            className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Farmgate Input Cost Calculator</span>
          </Link>
          <Link
            href="/farmer/produce/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <Sprout className="w-4 h-4" />
            <span>{language === 'mr' ? 'शेतमाल विका' : language === 'hi' ? 'फसल बेचें' : 'List Harvest Now'}</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Middleman Eliminator & ROI Simulator */}
      <MiddlemanSimulator />
    </div>
  );
}
