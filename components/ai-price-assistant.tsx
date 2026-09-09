'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Info, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { PriceRecommendationResult } from '@/lib/ai/ai-service';

interface AIPriceAssistantProps {
  cropName: string;
  grade: string;
  quantity: number;
  location: string;
  onApplyPrice?: (suggestedPrice: number) => void;
}

export default function AIPriceAssistant({
  cropName = 'Tomato',
  grade = 'A',
  quantity = 500,
  location = 'Pune, Maharashtra',
  onApplyPrice,
}: AIPriceAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PriceRecommendationResult | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchRecommendation = async () => {
    setLoading(true);
    setHasApplied(false);
    try {
      const res = await fetch('/api/ai/price-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          grade,
          quantity,
          location,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">AI Smart Price Recommendation</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                AI-Assisted Estimate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live algorithmic guidance based on regional mandi indices & historical demand.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRecommendation}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Mandis...' : recommendation ? 'Re-calculate AI Price' : 'Generate AI Price'}</span>
        </button>
      </div>

      {recommendation ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Range */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Recommended Price Range
              </span>
              <span className="text-xl font-black text-white mt-1 block">
                ₹{recommendation.minPrice} – ₹{recommendation.maxPrice}
                <span className="text-xs text-slate-400 font-normal"> /kg</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Optimal market liquidity window</span>
            </div>

            {/* Suggested */}
            <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-950 border border-emerald-500/40 rounded-xl p-3.5 relative">
              <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider block">
                Suggested Listing Price
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                ₹{recommendation.suggestedPrice}
                <span className="text-xs text-emerald-200 font-normal"> /kg</span>
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">High probability of rapid direct sale</span>
            </div>

            {/* Confidence */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Algorithm Confidence
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-amber-400">{recommendation.confidenceScore}%</span>
                  <span className="text-[10px] text-slate-400">High Reliability</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full"
                  style={{ width: `${recommendation.confidenceScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Economic Reasoning:
            </span>
            <p className="text-slate-300">{recommendation.reasoning}</p>
          </div>

          {/* Apply button and disclaimer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{recommendation.disclaimer}</span>
            </div>

            {onApplyPrice && (
              <button
                type="button"
                onClick={() => {
                  onApplyPrice(recommendation.suggestedPrice);
                  setHasApplied(true);
                }}
                className={`flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition ${
                  hasApplied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {hasApplied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{hasApplied ? 'Applied to Form (₹' + recommendation.suggestedPrice + ')' : 'Apply Suggested Price'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <p className="text-xs text-slate-400">
            Click <strong>&quot;Generate AI Price&quot;</strong> to evaluate current mandi pricing, demand trends, and quality tier.
          </p>
        </div>
      )}
    </div>
  );
}
