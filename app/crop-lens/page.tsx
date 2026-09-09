'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Sprout, Leaf, ShieldCheck } from 'lucide-react';
import CropDiseaseScanner from '@/components/crop-disease-scanner';
import { useLanguage } from '@/lib/i18n';

export default function CropLensPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : language === 'hi' ? 'होम पेज पर वापस' : 'Back to Home'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/profit-calculator"
            className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 transition"
          >
            <span>{language === 'mr' ? '💰 नफा कॅल्क्युलेटर' : language === 'hi' ? '💰 मुनाफा कैलकुलेटर' : '💰 Profit Calculator'}</span>
          </Link>
          <Link
            href="/farmer/produce/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm"
          >
            <Sprout className="w-4 h-4" />
            <span>{language === 'mr' ? 'शेतमाल विका' : language === 'hi' ? 'फसल बेचें' : 'List Harvest'}</span>
          </Link>
        </div>
      </div>

      {/* Main AI Crop Lens Component */}
      <CropDiseaseScanner />
    </div>
  );
}
