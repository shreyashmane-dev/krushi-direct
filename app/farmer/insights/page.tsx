'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import AIPriceAssistant from '@/components/ai-price-assistant';
import { DemandForecastResult } from '@/lib/ai/ai-service';

export default function FarmerInsightsPage() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [forecast, setForecast] = useState<DemandForecastResult | null>(null);
  const [loading, setLoading] = useState(false);

  const supportedCrops = [
    'Tomato',
    'Onion',
    'Potato',
    'Wheat',
    'Rice',
    'Mango',
    'Banana',
    'Chilli',
    'Cabbage',
    'Dragon Fruit', // Test insufficient data case
  ];

  const fetchForecast = async (crop: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/demand-forecast?crop=${crop}&location=Maharashtra`);
      if (res.ok) {
        const data = await res.json();
        setForecast(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedCrop);
  }, [selectedCrop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Agricultural Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Price Intelligence & Regional Demand Forecasting
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Empowering farmers with data-driven price discovery and 30-day market demand trajectories across Maharashtra mandis.
        </p>
      </div>

      {/* Interactive Crop Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {supportedCrops.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCrop === crop
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Demand Forecast Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Demand Forecast Profile
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">{selectedCrop}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Region:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              Western Maharashtra (Pune, Nashik, Satara)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Evaluating demand signals...</div>
        ) : forecast && !forecast.hasEnoughData ? (
          /* Insufficient Data case as required by prompt: "Not enough historical data for reliable prediction." */
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <h4 className="font-bold text-amber-900 text-sm">{forecast.summary}</h4>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              The platform does not fabricate speculative market estimates. When historical transaction density is below threshold, advisory is withheld.
            </p>
          </div>
        ) : forecast ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Current Demand Tier */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Current Demand Tier
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className={`text-2xl font-black px-3 py-1 rounded-xl uppercase ${
                      forecast.currentDemand === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : forecast.currentDemand === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {forecast.currentDemand}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Active buyer procurements exceed supply
                </span>
              </div>

              {/* 7-Day Outlook */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Expected Demand (Next 7 Days)
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className={`text-3xl font-black flex items-center gap-1 ${
                      forecast.next7DaysChangePercent >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {forecast.next7DaysChangePercent >= 0 ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    {forecast.next7DaysChangePercent > 0 ? '+' : ''}
                    {forecast.next7DaysChangePercent}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Short-term commercial procurement surge
                </span>
              </div>

              {/* 30-Day Outlook */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Expected Demand (Next 30 Days)
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className={`text-3xl font-black flex items-center gap-1 ${
                      forecast.next30DaysChangePercent >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {forecast.next30DaysChangePercent >= 0 ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    {forecast.next30DaysChangePercent > 0 ? '+' : ''}
                    {forecast.next30DaysChangePercent}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Monthly seasonal equilibrium trend
                </span>
              </div>
            </div>

            {/* Demand Drivers / Factors */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] block">
                Identified Agro-Economic Drivers:
              </span>
              <ul className="space-y-1.5 text-slate-700">
                {forecast.factors.map((factor, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* AI Price Assistant Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Run Dynamic Price Estimation for {selectedCrop}</h3>
        <AIPriceAssistant
          cropName={selectedCrop}
          grade="A"
          quantity={500}
          location="Pune, Maharashtra"
        />
      </div>
    </div>
  );
}
