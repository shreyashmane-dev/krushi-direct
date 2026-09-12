'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ThermometerSnowflake,
  Sparkles,
  MapPin,
  RefreshCw,
  Package,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface Corridor {
  id: string;
  name: string;
  highway: string;
  origin: string;
  originHub: string;
  destination: string;
  destHub: string;
  distanceKm: number;
  departureText: string;
  tempCelsius: number;
  tempType: 'Reefer (Cold-Chain)' | 'Aerated Ambient' | 'Banana/Mango Ripening';
  truckCapacityKg: number;
  bookedKg: number;
  farmersPooled: number;
  soloRatePerKg: number;
  pooledRatePerKg: number;
}

const LIVE_CORRIDORS: Corridor[] = [
  {
    id: 'corridor-nashik-mumbai',
    name: 'Nashik Onion & Veg Corridor',
    highway: 'NH60 & NH160',
    origin: 'Lasalgaon / Niphad',
    originHub: 'Lasalgaon Aggregation Hub',
    destination: 'Mumbai / Vashi',
    destHub: 'Vashi APMC Cold Depot',
    distanceKm: 185,
    departureText: 'Departing in 34 mins',
    tempCelsius: 12,
    tempType: 'Aerated Ambient',
    truckCapacityKg: 5000,
    bookedKg: 4200,
    farmersPooled: 6,
    soloRatePerKg: 3.8,
    pooledRatePerKg: 1.6,
  },
  {
    id: 'corridor-pune-mumbai',
    name: 'Manchar Tomato Express',
    highway: 'Pune-Nashik Highway / NH60',
    origin: 'Manchar / Junnar',
    originHub: 'Manchar Farmers Cooperative',
    destination: 'Dadar & Navi Mumbai',
    destHub: 'Dadar Wholesale Terminal',
    distanceKm: 160,
    departureText: 'En Route (Live GPS)',
    tempCelsius: 4,
    tempType: 'Reefer (Cold-Chain)',
    truckCapacityKg: 4000,
    bookedKg: 3750,
    farmersPooled: 8,
    soloRatePerKg: 3.2,
    pooledRatePerKg: 1.4,
  },
  {
    id: 'corridor-satara-pune',
    name: 'Satara Table Potato Line',
    highway: 'NH48 Express',
    origin: 'Koregaon / Wai',
    originHub: 'Koregaon Cold Storage Cluster',
    destination: 'Pune Market Yard',
    destHub: 'Gultekdi Terminal 3',
    distanceKm: 110,
    departureText: 'Loading at Cluster Hub',
    tempCelsius: 14,
    tempType: 'Aerated Ambient',
    truckCapacityKg: 6000,
    bookedKg: 4100,
    farmersPooled: 5,
    soloRatePerKg: 2.9,
    pooledRatePerKg: 1.25,
  },
  {
    id: 'corridor-sangli-mumbai',
    name: 'Sangli Spices & Chilli Shuttle',
    highway: 'NH48 & Expressway',
    origin: 'Walwa / Miraj',
    originHub: 'Sangli Spice Aggregation Center',
    destination: 'Mumbai Metropolitan Region',
    destHub: 'Bhiwandi Logistics Hub',
    distanceKm: 375,
    departureText: 'Scheduled 04:30 AM',
    tempCelsius: 8,
    tempType: 'Reefer (Cold-Chain)',
    truckCapacityKg: 7000,
    bookedKg: 5200,
    farmersPooled: 7,
    soloRatePerKg: 5.5,
    pooledRatePerKg: 2.2,
  },
];

export default function LogisticsCorridorRadar() {
  const { language } = useLanguage();
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor>(LIVE_CORRIDORS[0]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 font-mono">
            <Truck className="w-4 h-4 text-teal-500" />
            <span>Real-time Cold-Chain &amp; Shared Transit</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Maharashtra Smart Logistics Corridor Radar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live pooled reefer trucks departing daily along NH60, NH48, and NH65. Smallholder farmers pool crates to pay up to 60% less freight.
          </p>
        </div>

        <Link
          href="/logistics"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>Open Full Route Optimizer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Corridors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LIVE_CORRIDORS.map((c) => {
          const isSelected = selectedCorridor.id === c.id;
          const loadFactor = Math.round((c.bookedKg / c.truckCapacityKg) * 100);
          const remainingKg = c.truckCapacityKg - c.bookedKg;
          const savingsPct = Math.round(((c.soloRatePerKg - c.pooledRatePerKg) / c.soloRatePerKg) * 100);

          return (
            <div
              key={c.id}
              onClick={() => setSelectedCorridor(c)}
              className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-teal-500 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/30 shadow-md ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    {c.highway}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Save {savingsPct}%
                  </span>
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                  {c.name}
                </h4>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{c.origin} &rarr; {c.destination}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-teal-700 dark:text-teal-300">
                    <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>{c.departureText}</span>
                  </div>
                </div>
              </div>

              {/* Load Factor Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Truck Load:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{loadFactor}% ({remainingKg}kg open)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      loadFactor > 85 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${loadFactor}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{c.farmersPooled} Farmers In Pool</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{c.pooledRatePerKg}/kg</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corridor Deep Dive Detail Card */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 rounded-2xl p-6 text-white border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full">
              Selected Corridor: {selectedCorridor.name}
            </span>
            <span className="text-xs text-slate-300">&bull; {selectedCorridor.distanceKm} km transit</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Pickup from <strong className="text-white">{selectedCorridor.originHub}</strong> with scheduled temperature monitoring at <strong className="text-emerald-400">{selectedCorridor.tempCelsius}&deg;C ({selectedCorridor.tempType})</strong>. Direct landing at <strong className="text-white">{selectedCorridor.destHub}</strong> with instant 4-digit OTP digital escrow handover.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-mono uppercase">Solo Tempo Freight:</span>
              <span className="line-through text-slate-400 font-bold">₹{selectedCorridor.soloRatePerKg.toFixed(2)}/kg</span>
            </div>
            <div>
              <span className="text-teal-300 block text-[10px] font-mono uppercase font-bold">KisanDirect Pooled Freight:</span>
              <span className="text-emerald-400 font-black font-mono text-base">₹{selectedCorridor.pooledRatePerKg.toFixed(2)}/kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-mono uppercase">Space Remaining:</span>
              <span className="text-white font-bold font-mono">{selectedCorridor.truckCapacityKg - selectedCorridor.bookedKg} kg</span>
            </div>
          </div>
        </div>

        <Link
          href={`/logistics?origin=${encodeURIComponent(selectedCorridor.origin)}&destination=${encodeURIComponent(selectedCorridor.destination)}`}
          className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>Book Space in This Truck Pool</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
