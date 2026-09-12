'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Navigation,
  ThermometerSnowflake,
  ShieldCheck,
  TrendingDown,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  MapPin,
  FileCheck,
  Gauge,
} from 'lucide-react';
import SmartRoutePlanner from '@/components/logistics/smart-route-planner';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export default function LogisticsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'POOLING' | 'CORRIDORS' | 'COLD_CHAIN'>('POOLING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>KisanDirect Integrated Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Logistics Pooling &amp; Smart Routing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Intelligent agro-freight bundling, multi-stop corridor optimization, and cold-chain reefer delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/logistics/dashboard"
            className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 text-teal-900 dark:text-teal-300 text-xs font-bold px-4 py-2 rounded-xl border border-teal-300 dark:border-teal-700 transition shadow-xs"
          >
            <Gauge className="w-4 h-4 text-teal-600" />
            <span>Driver / Fleet Dashboard</span>
          </Link>
          <Link
            href="/farmer/produce/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <span>List Harvest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('POOLING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
            activeTab === 'POOLING'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Route Optimizer &amp; Freight Pooling</span>
        </button>

        <button
          onClick={() => setActiveTab('CORRIDORS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
            activeTab === 'CORRIDORS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Maharashtra Agro Corridors &amp; Tariffs</span>
        </button>

        <button
          onClick={() => setActiveTab('COLD_CHAIN')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
            activeTab === 'COLD_CHAIN'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ThermometerSnowflake className="w-3.5 h-3.5" />
          <span>Cold-Chain Reefer IoT Standards</span>
        </button>
      </div>

      {/* Tab 1: Smart Route Planner & Pooling */}
      {activeTab === 'POOLING' && <SmartRoutePlanner />}

      {/* Tab 2: Maharashtra Highway Corridors */}
      {activeTab === 'CORRIDORS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Primary Agricultural Freight Corridors
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              KisanDirect maintains daily scheduled pooled reefer dispatches across all vital farming belts in western Maharashtra.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[
                {
                  name: 'NH60 Pune-Nashik Agri Corridor',
                  from: 'Niphad / Lasalgaon / Manchar',
                  to: 'Gultekdi APMC & Pune Kitchens',
                  distance: '78 – 210 km',
                  frequency: '3 Daily Dispatches (05:00 AM, 12:00 PM, 06:00 PM)',
                  commodities: 'Tomato, Onion, Cabbage, Green Chilli',
                  pooledRate: '₹1.60 / kg',
                  soloRate: '₹3.80 / kg',
                },
                {
                  name: 'Mumbai-Pune Cold Expressway',
                  from: 'Pune Agro Hubs / Khed Shivapur',
                  to: 'Vashi APMC & Mumbai Supermarkets',
                  distance: '148 km',
                  frequency: '4 Daily Dispatches (Controlled Reefer 4°C)',
                  commodities: 'Exotic Vegetables, Strawberries, Dairy',
                  pooledRate: '₹2.20 / kg',
                  soloRate: '₹4.90 / kg',
                },
                {
                  name: 'NH48 Pune-Satara Strawberry Route',
                  from: 'Wai / Mahabaleshwar / Koregaon',
                  to: 'Pune & Navi Mumbai Retailers',
                  distance: '112 km',
                  frequency: '2 Daily Dispatches (Morning Harvest Run)',
                  commodities: 'Table Potato, Strawberries, Ginger',
                  pooledRate: '₹1.80 / kg',
                  soloRate: '₹3.90 / kg',
                },
                {
                  name: 'Pune-Baramati Dairy & Horticulture Line',
                  from: 'Baramati / Indapur / Daund',
                  to: 'Pune Commercial Buyers',
                  distance: '98 km',
                  frequency: '2 Daily Dispatches',
                  commodities: 'Pomegranate, Custard Apple, Fresh Milk',
                  pooledRate: '₹1.75 / kg',
                  soloRate: '₹3.60 / kg',
                },
                {
                  name: 'NH65 Solapur Pomegranate Express',
                  from: 'Sangola / Pandharpur / Solapur',
                  to: 'Pune & Vashi Export Terminals',
                  distance: '245 km',
                  frequency: 'Night Dispatch (08:00 PM Express)',
                  commodities: 'Bhagwa Pomegranate, Export Grapes',
                  pooledRate: '₹2.80 / kg',
                  soloRate: '₹6.20 / kg',
                },
                {
                  name: 'Konkan Coastal Alphonso Express',
                  from: 'Ratnagiri / Devgad / Sindhudurg',
                  to: 'Pune & Mumbai Wholesale Hubs',
                  distance: '320 km',
                  frequency: 'Daily Seasonal Harvest Convoys',
                  commodities: 'GI Alphonso Mango, Cashew, Kokum',
                  pooledRate: '₹3.40 / kg',
                  soloRate: '₹7.50 / kg',
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono">
                      Corridor
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.from} &rarr; {c.to}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="font-mono font-bold">{c.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frequency:</span>
                      <span className="font-semibold text-teal-600">{c.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Key Crops:</span>
                      <span className="font-semibold truncate max-w-[150px]">{c.commodities}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Pooled Rate</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {c.pooledRate}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Solo Hire Rate</span>
                      <span className="text-xs font-bold line-through text-slate-400">
                        {c.soloRate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cold Chain Standards */}
      {activeTab === 'COLD_CHAIN' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                  IoT Reefer Fleet Specifications
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Active Cold-Chain Quality Assurance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every KisanDirect refrigerated truck is fitted with dual-sensor telemetry probes streaming chamber temperature and relative humidity every 60 seconds.
                </p>
              </div>

              <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-xl border border-blue-300 dark:border-blue-700 shrink-0">
                APEDA Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                <ThermometerSnowflake className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Precision Cooling</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Set-point range from 2°C to 12°C with automated defrost cycles, preserving farmgate Brix sugar levels and crispness.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero Spoilage Guarantee</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Temperature excursion alarms trigger instant alerts to driver and receiver. Payout is guaranteed by platform freight insurance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <FileCheck className="w-6 h-6 text-teal-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Digital e-POD Release</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Recipient inspects crates and validates with a 4-digit PIN, triggering automated escrow freight release directly to the driver.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
