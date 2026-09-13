'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  Zap,
  Users,
  Coins,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface CropPipelineData {
  name: string;
  emoji: string;
  retailPriceKg: number;
  traditionalFarmerKg: number;
  kisanDirectBuyerKg: number;
  kisanDirectFarmerKg: number;
}

const CROPS: CropPipelineData[] = [
  {
    name: 'Tomato (Hybrid Red)',
    emoji: '🍅',
    retailPriceKg: 50,
    traditionalFarmerKg: 14,
    kisanDirectBuyerKg: 38,
    kisanDirectFarmerKg: 32,
  },
  {
    name: 'Nashik Red Onion',
    emoji: '🧅',
    retailPriceKg: 42,
    traditionalFarmerKg: 12,
    kisanDirectBuyerKg: 30,
    kisanDirectFarmerKg: 25,
  },
  {
    name: 'Jyoti Table Potato',
    emoji: '🥔',
    retailPriceKg: 36,
    traditionalFarmerKg: 10,
    kisanDirectBuyerKg: 26,
    kisanDirectFarmerKg: 22,
  },
  {
    name: 'Export Table Grapes',
    emoji: '🍇',
    retailPriceKg: 120,
    traditionalFarmerKg: 45,
    kisanDirectBuyerKg: 95,
    kisanDirectFarmerKg: 85,
  },
];

export default function CashflowPipeline() {
  const [selectedCrop, setSelectedCrop] = useState<CropPipelineData>(CROPS[0]);
  const [quantity, setQuantity] = useState<number>(2000);

  // Traditional Calculations
  const traditionalTotalConsumerSpend = selectedCrop.retailPriceKg * quantity;
  const traditionalFarmerIncome = selectedCrop.traditionalFarmerKg * quantity;
  const middlemanCutTotal = traditionalTotalConsumerSpend - traditionalFarmerIncome;
  const farmerSharePct = Math.round((traditionalFarmerIncome / traditionalTotalConsumerSpend) * 100);

  // KisanDirect Calculations
  const kisanDirectBuyerTotal = selectedCrop.kisanDirectBuyerKg * quantity;
  const kisanDirectFarmerIncome = selectedCrop.kisanDirectFarmerKg * quantity;
  const logisticsAndTech = kisanDirectBuyerTotal - kisanDirectFarmerIncome;
  const farmerExtraIncome = kisanDirectFarmerIncome - traditionalFarmerIncome;
  const buyerSavings = traditionalTotalConsumerSpend - kisanDirectBuyerTotal;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-mono">
            <Coins className="w-4 h-4 text-emerald-500" />
            <span>Interactive Cash Flow Disintermediation Visualizer</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Where Does Every Rupee Actually Go?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare the leakage in traditional 5-tier wholesale syndicates versus KisanDirect&apos;s direct digital escrow pipeline.
          </p>
        </div>

        {/* Quick Crop Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CROPS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedCrop.name === c.name
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Volume Slider */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Consignment Harvest Batch:
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
            {quantity.toLocaleString()} kg ({quantity / 100} Quintals)
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Small Pickup (500 kg)</span>
          <span>Medium Reefer (5,000 kg)</span>
          <span>Heavy Freight (10,000 kg)</span>
        </div>
      </div>

      {/* Side-by-Side Pipeline Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: The 5-Hop Mandi Cartel */}
        <div className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-200/60 dark:border-rose-900/60 pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h4 className="font-black text-sm text-rose-900 dark:text-rose-200">
                Traditional 5-Hop APMC Cartel
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-rose-200/60 dark:bg-rose-900 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded font-black">
              72% MIDDLEMAN DRAIN
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {/* Step 1 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40">
              <span className="text-slate-600 dark:text-slate-400">1. Village Kaccha Arhatia:</span>
              <span className="text-rose-600 font-bold">-₹{Math.round(selectedCrop.retailPriceKg * 0.16 * quantity).toLocaleString()}</span>
            </div>
            {/* Step 2 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40">
              <span className="text-slate-600 dark:text-slate-400">2. APMC Mandi Dalal &amp; Cess:</span>
              <span className="text-rose-600 font-bold">-₹{Math.round(selectedCrop.retailPriceKg * 0.18 * quantity).toLocaleString()}</span>
            </div>
            {/* Step 3 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40">
              <span className="text-slate-600 dark:text-slate-400">3. Non-Reefer Spoilage &amp; Transporter:</span>
              <span className="text-rose-600 font-bold">-₹{Math.round(selectedCrop.retailPriceKg * 0.15 * quantity).toLocaleString()}</span>
            </div>
            {/* Step 4 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40">
              <span className="text-slate-600 dark:text-slate-400">4. City Wholesaler &amp; Cold Storage:</span>
              <span className="text-rose-600 font-bold">-₹{Math.round(selectedCrop.retailPriceKg * 0.23 * quantity).toLocaleString()}</span>
            </div>
          </div>

          {/* Traditional Farmer Payout */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
              Farmer Final Net Payout
            </span>
            <div className="text-2xl font-black text-rose-600 font-mono">
              ₹{traditionalFarmerIncome.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-500 font-mono font-bold">
              Only {farmerSharePct}% of consumer price reaches farmer
            </span>
          </div>
        </div>

        {/* Right Side: KisanDirect Direct Escrow */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-200">
                KisanDirect Zero-Middleman Highway
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-emerald-200/60 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded font-black">
              84% FARMER RETENTION
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {/* Step 1 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-slate-600 dark:text-slate-400">1. Direct Commercial Buyer Bid:</span>
              <span className="text-emerald-600 font-bold">₹{kisanDirectBuyerTotal.toLocaleString('en-IN')}</span>
            </div>
            {/* Step 2 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-slate-600 dark:text-slate-400">2. Pooled Reefer Transport (4°C):</span>
              <span className="text-slate-500 font-bold">-₹{Math.round(logisticsAndTech * 0.75).toLocaleString()}</span>
            </div>
            {/* Step 3 */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-slate-600 dark:text-slate-400">3. KisanDirect Fair Platform Fee:</span>
              <span className="text-slate-500 font-bold">-₹{Math.round(logisticsAndTech * 0.25).toLocaleString()}</span>
            </div>
            {/* Bonus Step */}
            <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800">
              <span className="text-emerald-800 dark:text-emerald-300 font-bold">Buyer Direct Savings:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">Save ₹{buyerSavings.toLocaleString('en-IN')} (24%)</span>
            </div>
          </div>

          {/* KisanDirect Farmer Payout */}
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md text-center space-y-1">
            <span className="text-[10px] text-emerald-100 uppercase font-mono font-bold block">
              Farmer Direct Escrow Payout
            </span>
            <div className="text-2xl font-black font-mono">
              ₹{kisanDirectFarmerIncome.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-200 font-mono font-bold">
              +₹{farmerExtraIncome.toLocaleString('en-IN')} Extra Profit in Farmer&apos;s Bank (+{Math.round((farmerExtraIncome / traditionalFarmerIncome) * 100)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
