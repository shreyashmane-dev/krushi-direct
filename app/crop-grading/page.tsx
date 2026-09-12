'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  ArrowLeft,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sliders,
  Scale,
  Download,
  Share2,
} from 'lucide-react';
import AIQualityScanner from '@/components/ai-quality-scanner';
import { useLanguage } from '@/lib/i18n';

export default function CropGradingPage() {
  const { language } = useLanguage();
  const [activeCrop, setActiveCrop] = useState('Tomato');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : 'Back to Home'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/crop-lens"
            className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 transition"
          >
            <span>🌿 Crop Disease Lens</span>
          </Link>
          <Link
            href="/farmer/produce/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm"
          >
            <Sprout className="w-4 h-4" />
            <span>List Harvest</span>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-emerald-500/30">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            AGMARK &bull; APMC Standard
          </span>
          <span className="text-teal-300/80 text-xs font-semibold">
            • Multimodal Computer Vision
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          AI Automated Crop Quality Grading Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Upload harvest photos to automatically assess commercial grade (A+, A, B, C), skin blemish rate, color uniformity, and fair farmgate pricing via Google Gemini Multimodal Vision.
        </p>

        {/* Quick Crop Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {['Tomato', 'Onion', 'Mango', 'Potato', 'Green Chilli', 'Grapes', 'Pomegranate'].map((crop) => (
            <button
              key={crop}
              onClick={() => setActiveCrop(crop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                activeCrop === crop
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Scanner Component */}
      <AIQualityScanner cropName={activeCrop} />

      {/* Grading Standards Reference Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>KisanDirect Commercial Quality Tiers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1.5">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase block">
              Grade A+ (Export Grade)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Zero visible blemishes (&lt;2% defect), precise size calibration, maximum color saturation. Ideal for 5-star hotel kitchens and international exports.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 space-y-1.5">
            <span className="text-xs font-black text-teal-800 dark:text-teal-300 uppercase block">
              Grade A (Supermarket)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              High freshness, minor superficial skin freckles (&lt;6%), standard commercial sizing. Preferred by retail supermarkets and restaurant chains.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5">
            <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase block">
              Grade B (Local Mandi)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Variable size distribution, surface scratches (&lt;15%), high nutritional value. Standard mandi wholesale bulk tier.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase block">
              Grade C (Processing)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cosmetic flaws or shape irregularities, perfectly sound interior pulp. Ideal for food processors, tomato paste, puree, and juices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
