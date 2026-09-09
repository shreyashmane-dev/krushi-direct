'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  ChevronRight,
  X,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import type { MandiRate } from '@/app/api/mandi-prices/route';

export default function MandiTicker() {
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mandi-prices');
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates || []);
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to fetch live mandi rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const districts = ['ALL', 'Pune', 'Nashik', 'Satara', 'Ahmednagar', 'Kolhapur', 'Sangli', 'Ratnagiri', 'Nagpur'];

  const filteredRates = rates.filter((r) => {
    const matchesDistrict = selectedDistrict === 'ALL' || r.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      r.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.marketName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesQuery;
  });

  return (
    <>
      {/* Live Compact APMC Ticker Bar */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800 relative z-30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-[11px] tracking-wider uppercase text-emerald-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Govt. Agmarknet APMC Rates</span>
            </span>
            <span className="hidden md:inline text-[10px] text-slate-400">• Live Maharashtra Mandi Fluctuation Tracker</span>
          </div>

          {/* Scrolling / Rotating Ticker Items */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {rates.slice(0, 6).map((rate) => (
              <div
                key={rate.id}
                onClick={() => setIsOpenModal(true)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-full px-2.5 py-1 text-[11px] shrink-0 cursor-pointer transition"
              >
                <span className="font-semibold text-slate-200">{rate.commodity}</span>
                <span className="font-bold text-white">₹{rate.modalPrice}/kg</span>
                <span
                  className={`flex items-center text-[10px] font-bold ${
                    rate.trend24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {rate.trend24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {rate.trend24h >= 0 ? `+${rate.trend24h}%` : `${rate.trend24h}%`}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsOpenModal(true)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 group transition"
          >
            <span>Compare Farmgate Savings</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* Detailed Full Market Intelligence Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                      <span>Live Government Mandi APMC Market Value</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase font-bold">
                        Agmarknet / DMI
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Official Government of India daily wholesale arrivals vs KisanDirect farmgate savings
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchRates}
                  disabled={loading}
                  title="Refresh rates"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter crop (e.g. Tomato, Onion, Wheat)..."
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* District Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedDistrict === d
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d === 'ALL' ? 'All Maharashtra' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Rates Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRates.map((rate) => (
                  <div
                    key={rate.id}
                    className="bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all rounded-2xl p-4 flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-sm">{rate.commodity}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                            {rate.variety}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{rate.marketName} • {rate.district}</p>
                      </div>

                      {/* 24h Trend Badge */}
                      <span
                        className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                          rate.trend24h >= 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rate.trend24h >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 mr-1" />
                        )}
                        {rate.trend24h >= 0 ? `+${rate.trend24h}%` : `${rate.trend24h}%`}
                      </span>
                    </div>

                    {/* Price Comparison Block */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">APMC Modal Price</span>
                        <span className="text-sm font-black text-slate-900">₹{rate.modalPrice}/kg</span>
                        <span className="text-[9px] text-slate-500 block">₹{rate.modalPrice * 100}/Qtl</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mandi Range</span>
                        <span className="text-xs font-bold text-slate-700">₹{rate.minPrice} - ₹{rate.maxPrice}</span>
                        <span className="text-[9px] text-slate-500 block">{rate.arrivalsTonnes}T Arrivals</span>
                      </div>

                      <div className="bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200/60 text-right">
                        <span className="text-[9px] text-emerald-800 font-bold block uppercase">Buyer Saving</span>
                        <span className="text-sm font-black text-emerald-700">Save {rate.buyerSavingsPercent}%</span>
                        <span className="text-[9px] text-emerald-600 block">Direct Farmgate</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Source: {rate.source}</span>
                      <span className="text-emerald-700 font-semibold">Farmer Gain: +{rate.farmerGainPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRates.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No commodity found for this filter.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  All benchmark figures pulled from Agmarknet open data portal (Ministry of Agriculture & Farmers Welfare)
                </span>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Close & Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
