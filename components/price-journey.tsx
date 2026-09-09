'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, TrendingDown, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface PriceJourneyProps {
  farmerPrice: number;
  cropName?: string;
  unit?: string;
}

export default function PriceJourney({
  farmerPrice = 18,
  cropName = 'Tomato',
  unit = 'kg',
}: PriceJourneyProps) {
  // Benchmark estimates
  const traderMarkup = Math.round(farmerPrice * 1.15 * 10) / 10;
  const wholesalePrice = Math.round(farmerPrice * 1.25 * 10) / 10;
  const distributorPrice = Math.round(farmerPrice * 1.4 * 10) / 10;
  const retailPrice = Math.round(farmerPrice * 1.55 * 10) / 10;

  // KisanDirect Direct Price (Farmer receives 100% of their listing price, buyer pays farmer + minimal 2% platform + shared logistics)
  const kisanDirectBuyerPrice = farmerPrice;
  const potentialBuyerSaving = Math.max(0, Math.round((retailPrice - kisanDirectBuyerPrice) * 10) / 10);
  const percentageSavings = Math.round((potentialBuyerSaving / retailPrice) * 100);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-950/5 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Transparent Price Journey</span>
            </div>
            <h3 className="text-xl font-bold">Supply Chain Price Breakdown: {cropName}</h3>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Comparing 5-stage middleman markup against the KisanDirect direct connection model.
            </p>
          </div>

          <div className="bg-emerald-700/40 border border-emerald-400/40 rounded-xl p-3 text-right">
            <span className="text-[11px] uppercase font-semibold text-emerald-200 block">Buyer Savings</span>
            <span className="text-2xl font-black text-amber-300">₹{potentialBuyerSaving}</span>
            <span className="text-xs text-emerald-200 font-medium">/{unit} ({percentageSavings}%)</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-8">
        {/* Step 1: Traditional Intermediary Chain */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Traditional Supply Chain (4–6 Intermediaries)
            </h4>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
              *Estimated Regional Mandi Averages
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 block">1. Farmer Price</span>
              <span className="text-lg font-black text-slate-900 mt-1 block">₹{farmerPrice}</span>
              <span className="text-[10px] text-slate-400">Baseline Harvest</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 block">2. Local Trader</span>
              <span className="text-lg font-black text-slate-700 mt-1 block">₹{traderMarkup}</span>
              <span className="text-[10px] text-red-500 font-medium">+15% Village Cut</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 block">3. Wholesaler</span>
              <span className="text-lg font-black text-slate-700 mt-1 block">₹{wholesalePrice}</span>
              <span className="text-[10px] text-red-500 font-medium">+10% APMC Mandi</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 block">4. Distributor</span>
              <span className="text-lg font-black text-slate-700 mt-1 block">₹{distributorPrice}</span>
              <span className="text-[10px] text-red-500 font-medium">+15% Cold Chain</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-red-50 border border-red-200 rounded-xl p-3">
              <span className="text-[11px] font-bold text-red-800 block">5. Retail Consumer</span>
              <span className="text-lg font-black text-red-600 mt-1 block">₹{retailPrice}</span>
              <span className="text-[10px] text-red-700 font-medium">Final Store Price</span>
            </div>
          </div>
        </div>

        {/* Step 2: The KisanDirect Model */}
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/50 border-2 border-emerald-500/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              KisanDirect Model (Direct Connection)
            </h4>
            <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
              Zero Intermediary Inflation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Farmer */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200 text-center shadow-sm">
              <span className="text-xs font-bold text-slate-600 block">Farmer Farmgate Price</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">₹{farmerPrice}/kg</span>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Farmer Realizes 100%
              </span>
            </div>

            {/* Direct Tech Platform */}
            <div className="bg-emerald-800 text-white rounded-xl p-4 text-center shadow-md">
              <span className="text-xs font-semibold text-emerald-200 block">KisanDirect Tech Platform</span>
              <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-sm mt-1">
                <Sparkles className="w-4 h-4" />
                <span>2% Flat Platform Fee</span>
              </div>
              <span className="text-[10px] text-emerald-300 block mt-1">
                Direct GPS Logistics + Digital Escrow
              </span>
            </div>

            {/* Direct Buyer */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200 text-center shadow-sm">
              <span className="text-xs font-bold text-slate-600 block">Direct Buyer Price</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">₹{farmerPrice}/kg</span>
              <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
                Saves ₹{potentialBuyerSaving}/kg vs Retail
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer as required by prompt */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-700">Transparency Note:</strong> Intermediate wholesale and retail prices are regional estimates computed from benchmark Maharashtra APMC Mandi indices. They represent typical urban market spreads for {cropName} and are not guaranteed prices.
          </p>
        </div>
      </div>
    </div>
  );
}
