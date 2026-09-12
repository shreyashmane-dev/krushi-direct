'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Truck,
  IndianRupee,
  Layers,
  Sprout,
  ShoppingBag,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface CropProfile {
  name: string;
  icon: string;
  traditionalFarmgate: number;
  traditionalRetail: number;
  kisanDirectFarmgate: number;
  kisanDirectBuyer: number;
  unit: string;
}

const CROPS: CropProfile[] = [
  {
    name: 'Tomato (टोमॅटो)',
    icon: '🍅',
    traditionalFarmgate: 11.0,
    traditionalRetail: 28.0,
    kisanDirectFarmgate: 18.0,
    kisanDirectBuyer: 20.5,
    unit: 'kg',
  },
  {
    name: 'Nashik Onion (कांदा)',
    icon: '🧅',
    traditionalFarmgate: 15.0,
    traditionalRetail: 38.0,
    kisanDirectFarmgate: 24.0,
    kisanDirectBuyer: 27.5,
    unit: 'kg',
  },
  {
    name: 'Satara Potato (बटाटा)',
    icon: '🥔',
    traditionalFarmgate: 13.0,
    traditionalRetail: 32.0,
    kisanDirectFarmgate: 22.0,
    kisanDirectBuyer: 24.5,
    unit: 'kg',
  },
  {
    name: 'Alphonso Mango (हापूस)',
    icon: '🥭',
    traditionalFarmgate: 90.0,
    traditionalRetail: 240.0,
    kisanDirectFarmgate: 140.0,
    kisanDirectBuyer: 165.0,
    unit: 'kg',
  },
  {
    name: 'G4 Green Chilli (मिरची)',
    icon: '🌶️',
    traditionalFarmgate: 32.0,
    traditionalRetail: 85.0,
    kisanDirectFarmgate: 55.0,
    kisanDirectBuyer: 62.0,
    unit: 'kg',
  },
];

export default function MiddlemanSimulator() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropProfile>(CROPS[0]);
  const [quantity, setQuantity] = useState<number>(1000);

  // Calculations
  const traditionalFarmerIncome = selectedCrop.traditionalFarmgate * quantity;
  const traditionalBuyerCost = selectedCrop.traditionalRetail * quantity;
  const middlemanWaste = traditionalBuyerCost - traditionalFarmerIncome;

  const kisanDirectFarmerIncome = selectedCrop.kisanDirectFarmgate * quantity;
  const kisanDirectBuyerCost = selectedCrop.kisanDirectBuyer * quantity;
  const farmerExtraGain = kisanDirectFarmerIncome - traditionalFarmerIncome;
  const buyerSavings = traditionalBuyerCost - kisanDirectBuyerCost;
  const farmerPctIncrease = Math.round((farmerExtraGain / traditionalFarmerIncome) * 100);
  const buyerPctSavings = Math.round((buyerSavings / traditionalBuyerCost) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-mono">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Interactive Disintermediation Engine</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Middleman Profit Eliminator &amp; ROI Simulator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare your actual earnings and procurement costs between traditional 5-hop APMC middlemen cartels and KisanDirect.
          </p>
        </div>

        {/* Live Badge */}
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 px-3.5 py-2 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            RBI Escrow Guaranteed
          </span>
        </div>
      </div>

      {/* Selector Chips & Quantity Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Crop Selection */}
        <div className="lg:col-span-7 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Select Harvest Produce:
          </label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop.name}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedCrop.name === crop.name
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{crop.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Slider */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300 font-mono uppercase">
              Harvest Lot Size:
            </span>
            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
              {quantity.toLocaleString()} {selectedCrop.unit}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>100 kg (Retail)</span>
            <span>1,000 kg (Tempo)</span>
            <span>5,000 kg (Truck)</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Column 1: Traditional APMC Middleman Model */}
        <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h4 className="font-black text-base text-rose-900 dark:text-rose-300">
                Traditional APMC Supply Chain
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-full">
              5 to 6 Middleman Hops
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-rose-200/60 dark:divide-rose-900/40">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Farmer Farmgate Price</span>
              <span className="font-bold text-rose-700 dark:text-rose-400 font-mono">
                ₹{selectedCrop.traditionalFarmgate.toFixed(2)}/{selectedCrop.unit}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Commission Agents (Adatya Fee)</span>
              <span className="font-bold text-rose-600 font-mono">6% - 8% deducted</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Weighing Loss &amp; Spoilage</span>
              <span className="font-bold text-rose-600 font-mono">5% deducted</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Urban Wholesaler &amp; Retail Markup</span>
              <span className="font-bold text-rose-600 font-mono">+60% to +120% added</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Final Buyer / Consumer Price</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                ₹{selectedCrop.traditionalRetail.toFixed(2)}/{selectedCrop.unit}
              </span>
            </div>
          </div>

          {/* Bottom Totals */}
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Farmer Total Payout:</span>
              <span className="font-bold text-rose-700 dark:text-rose-400 font-mono text-sm">
                {formatINR(traditionalFarmerIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Buyer Procurement Cost:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">
                {formatINR(traditionalBuyerCost)}
              </span>
            </div>
            <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 flex justify-between items-center text-rose-600 dark:text-rose-400 font-bold">
              <span>Lost to Middleman Cartels:</span>
              <span className="font-mono text-base font-black">{formatINR(middlemanWaste)}</span>
            </div>
          </div>
        </div>

        {/* Column 2: KisanDirect Model */}
        <div className="rounded-3xl border-2 border-emerald-500 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4 shadow-md relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-black text-base text-emerald-900 dark:text-emerald-300">
                KisanDirect Disintermediated Model
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              Direct Peer-to-Peer
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-emerald-200/60 dark:divide-emerald-900/40">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Direct Farmgate Payout</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                ₹{selectedCrop.kisanDirectFarmgate.toFixed(2)}/{selectedCrop.unit}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Auction Commission Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">0% (Completely Eliminated)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">KisanDirect Digital Escrow Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">2.0%</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Smart Reefer Corridor Freight</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">₹1.50/{selectedCrop.unit} (Pooled)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-400">Final Buyer Landing Cost</span>
              <span className="font-black text-emerald-700 dark:text-emerald-300 font-mono text-sm">
                ₹{selectedCrop.kisanDirectBuyer.toFixed(2)}/{selectedCrop.unit}
              </span>
            </div>
          </div>

          {/* Bottom Totals */}
          <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Farmer Net Payout:</span>
              <div className="text-right">
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  {formatINR(kisanDirectFarmerIncome)}
                </span>
                <span className="block text-[10px] font-bold text-emerald-600">
                  (+{formatINR(farmerExtraGain)} or +{farmerPctIncrease}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Buyer Landing Cost:</span>
              <div className="text-right">
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  {formatINR(kisanDirectBuyerCost)}
                </span>
                <span className="block text-[10px] font-bold text-teal-600">
                  (Saves {formatINR(buyerSavings)} or {buyerPctSavings}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-5 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-emerald-300">
              Net Impact for this {quantity.toLocaleString()} {selectedCrop.unit} lot:
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            Farmer gets <span className="text-emerald-400 font-black font-mono">+{formatINR(farmerExtraGain)}</span> extra &bull; Buyer saves <span className="text-teal-300 font-black font-mono">{formatINR(buyerSavings)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/farmer/produce/new"
            className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Sprout className="w-4 h-4" />
            <span>List Harvest at Farmgate Rate</span>
          </Link>
          <Link
            href="/marketplace"
            className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Buy Directly</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
