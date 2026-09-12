'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Sprout, Calculator, TrendingUp } from 'lucide-react';
import { ProfitCalculator } from '@/components/profit-calculator';
import MiddlemanSimulator from '@/components/middleman-simulator';
import { useLanguage } from '@/lib/i18n';

export default function ProfitCalculatorPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'middleman-roi' | 'crop-profit'>('middleman-roi');

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
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {activeTab === 'middleman-roi' ? 'Middleman ROI Simulator' : 'Cost & Profit Calculator'}
          </span>
        </div>

        <Link
          href="/farmer/produce/new"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
        >
          <Sprout className="w-4 h-4" />
          <span>{language === 'mr' ? 'शेतमाल विका' : language === 'hi' ? 'फसल बेचें' : 'List Harvest Now'}</span>
        </Link>
      </div>

      {/* Simulator Switcher Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 max-w-xl">
        <button
          type="button"
          onClick={() => setActiveTab('middleman-roi')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'middleman-roi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Middleman Eliminator &amp; ROI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crop-profit')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'crop-profit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Crop Cultivation &amp; MSP Profit</span>
        </button>
      </div>

      {/* Active Calculator Component */}
      {activeTab === 'middleman-roi' ? (
        <MiddlemanSimulator />
      ) : (
        <ProfitCalculator />
      )}
    </div>
  );
}
