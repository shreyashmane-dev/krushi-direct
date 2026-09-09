'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  TrendingUp,
  Calculator,
  ShoppingBag,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Boxes,
  MapPin,
  ArrowUpRight,
  Receipt,
  Download,
  Percent,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function RetailerDashboardPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Margin Calculator State
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [farmRate, setFarmRate] = useState(18);
  const [mandiRate, setMandiRate] = useState(24);
  const [retailShelfRate, setRetailShelfRate] = useState(34);
  const [cratesCount, setCratesCount] = useState(15); // 20 kg per crate = 300 kg

  const totalKg = cratesCount * 20;
  const directCost = totalKg * farmRate;
  const middlemanCost = totalKg * mandiRate;
  const totalRevenue = totalKg * retailShelfRate;
  const grossProfit = totalRevenue - directCost;
  const profitMarginPercent = Math.round((grossProfit / totalRevenue) * 100);
  const extraProfitOverMandi = middlemanCost - directCost;

  // Wholesale Available Lots
  const [wholesaleLots, setWholesaleLots] = useState([
    {
      id: 'LOT-MH-TOM-102',
      crop: 'Grade-A Table Tomato',
      farmer: 'Ramesh Patil (Manchar Cluster)',
      packaging: '20 kg Crates',
      availableUnits: 45,
      pricePerCrate: 360, // ₹18/kg
      apmcPricePerCrate: 480, // ₹24/kg
      status: 'AVAILABLE',
    },
    {
      id: 'LOT-MH-ONI-408',
      crop: 'Nashik Garwa Red Onion',
      farmer: 'Suresh Jadhav (Lasalgaon)',
      packaging: '50 kg Gunny Sacks',
      availableUnits: 30,
      pricePerCrate: 1200, // ₹24/kg
      apmcPricePerCrate: 1450, // ₹29/kg
      status: 'AVAILABLE',
    },
    {
      id: 'LOT-MH-POT-209',
      crop: 'Satara Jyoti Potato',
      farmer: 'Anita Pawar (Koregaon)',
      packaging: '50 kg Mesh Sacks',
      availableUnits: 25,
      pricePerCrate: 1100, // ₹22/kg
      apmcPricePerCrate: 1350, // ₹27/kg
      status: 'AVAILABLE',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBuyLot = (lotId: string) => {
    setWholesaleLots((prev) =>
      prev.map((lot) => (lot.id === lotId ? { ...lot, status: 'ORDERED' } : lot))
    );
    showToast(`Order confirmed for Lot ${lotId}! Delivery scheduled to your market yard mart.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Retail Merchant Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=80'}
            alt="Retail Merchant"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.name || 'Kailash Gupta (Omkar Mart)'}
              </h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Store className="w-3 h-3 text-blue-400" />
                Verified Retail Merchant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Gate 3, APMC Market Yard Wholesale Hub, Pune • GSTIN: 27AABCO5544E1Z3</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => showToast('Generating APMC Cess Exemption B2B Invoices ZIP...')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download GST Invoices</span>
          </button>
          <Link
            href="/marketplace"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Mandi Lots Feed
          </Link>
        </div>
      </div>

      {/* 4 Retail Procurement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Margin Boost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Retail Margin</span>
          <span className="text-3xl font-black text-emerald-700 block">47.1%</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% extra profit vs buying from middlemen</span>
          </span>
        </div>

        {/* Volume Procured */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Crates Procured This Month</span>
          <span className="text-3xl font-black text-slate-900 block">72 Crates</span>
          <span className="text-[11px] text-slate-500 font-medium">1,440 kg total farm fresh volume</span>
        </div>

        {/* Middleman Brokerage Saved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Brokerage & Commission Saved</span>
          <span className="text-3xl font-black text-blue-700 block">{formatINR(14200)}</span>
          <span className="text-[11px] text-blue-600 font-medium">Zero APMC dalal commission paid</span>
        </div>

        {/* Active Mandi Drop-offs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scheduled Morning Drops</span>
          <span className="text-3xl font-black text-slate-900 block">2 Lots Active</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Cold reefer dispatch confirmed</span>
        </div>
      </div>

      {/* Interactive Retail Margin & Arbitrage Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Direct Mandi Margin & Profit Arbitrage Calculator</h3>
              <p className="text-xs text-slate-500">Calculate exact profit margins when eliminating 3 tiers of mandi brokers</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start">
            Live APMC Index Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Commodity</label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCrop(c);
                if (c === 'Tomato') { setFarmRate(18); setMandiRate(24); setRetailShelfRate(34); }
                else if (c === 'Onion') { setFarmRate(24); setMandiRate(29); setRetailShelfRate(40); }
                else if (c === 'Potato') { setFarmRate(22); setMandiRate(27); setRetailShelfRate(36); }
                else if (c === 'Chilli') { setFarmRate(55); setMandiRate(68); setRetailShelfRate(90); }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="Tomato">Grade-A Tomato</option>
              <option value="Onion">Nashik Red Onion</option>
              <option value="Potato">Satara Table Potato</option>
              <option value="Chilli">G4 Green Chilli</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">KisanDirect Price (₹/kg)</label>
            <input
              type="number"
              value={farmRate}
              onChange={(e) => setFarmRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Store Shelf Price (₹/kg)</label>
            <input
              type="number"
              value={retailShelfRate}
              onChange={(e) => setRetailShelfRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Wholesale Lot (20kg Crates)</label>
            <input
              type="number"
              value={cratesCount}
              onChange={(e) => setCratesCount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Direct Procurement Cost</span>
            <span className="text-xl font-black text-slate-900 block">{formatINR(directCost)}</span>
            <span className="text-[10px] text-slate-500">{cratesCount} Crates ({totalKg} kg) @ ₹{farmRate}/kg</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Retail Store Revenue</span>
            <span className="text-xl font-black text-slate-900 block">{formatINR(totalRevenue)}</span>
            <span className="text-[10px] text-slate-500">Sold at ₹{retailShelfRate}/kg retail</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Your Net Gross Profit</span>
            <span className="text-2xl font-black text-emerald-700 block">{formatINR(grossProfit)} ({profitMarginPercent}%)</span>
            <span className="text-[10px] font-bold text-emerald-800">
              +{formatINR(extraProfitOverMandi)} more than traditional APMC mandi lot!
            </span>
          </div>
        </div>
      </div>

      {/* Available Wholesale Farm Lots */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Direct Wholesale Farmgate Lots (Crates & Bags)</h3>
            <p className="text-xs text-slate-500">Procure full crate lots with verified gate pass and zero mandi cess</p>
          </div>
          <span className="text-xs text-slate-500">Showing 3 High-Volume Clusters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Lot ID & Crop</th>
                <th className="py-3 px-4">Farmer / Origin</th>
                <th className="py-3 px-4">Packaging Unit</th>
                <th className="py-3 px-4">Direct Lot Price</th>
                <th className="py-3 px-4">APMC Rate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wholesaleLots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] text-slate-400 block">{lot.id}</span>
                    <span className="font-bold text-slate-900 text-sm">{lot.crop}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {lot.farmer}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {lot.packaging}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{lot.availableUnits} units ready</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                    {formatINR(lot.pricePerCrate)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 line-through">
                    {formatINR(lot.apmcPricePerCrate)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {lot.status === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleBuyLot(lot.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
                      >
                        Procure Lot
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
