'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  PieChart,
  BarChart3,
  MapPin,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  X,
  FileCheck,
  Server,
  Activity,
  Terminal,
  Lock,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { sendPwaNotification } from '@/lib/pwa-notifications';

interface PendingVerification {
  id: string;
  name: string;
  village: string;
  district: string;
  farmSizeAcres: number;
  khateExtractNo: string;
  cropType: string;
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED';
}

const INITIAL_VERIFICATIONS: PendingVerification[] = [
  {
    id: 'kyc-01',
    name: 'Tukaram Shinde',
    village: 'Narayangaon',
    district: 'Pune',
    farmSizeAcres: 6.5,
    khateExtractNo: 'MH-PUN-712-4491',
    cropType: 'Tomato & Capsicum',
    status: 'PENDING',
  },
  {
    id: 'kyc-02',
    name: 'Sunita Patil',
    village: 'Niphad',
    district: 'Nashik',
    farmSizeAcres: 12.0,
    khateExtractNo: 'MH-NAS-712-8821',
    cropType: 'Lasalgaon Onion & Grapes',
    status: 'PENDING',
  },
  {
    id: 'kyc-03',
    name: 'Ganesh Jadhav',
    village: 'Koregaon',
    district: 'Satara',
    farmSizeAcres: 4.8,
    khateExtractNo: 'MH-SAT-712-2204',
    cropType: 'Table Potato & Strawberries',
    status: 'PENDING',
  },
];

interface DisputeClaim {
  id: string;
  orderNumber: string;
  farmerName: string;
  buyerName: string;
  amount: number;
  issue: string;
  status: 'OPEN' | 'RESOLVED';
}

const INITIAL_DISPUTES: DisputeClaim[] = [
  {
    id: 'disp-201',
    orderNumber: 'KD-9842',
    farmerName: 'Ramesh Patil',
    buyerName: 'GreenBite Kitchens',
    amount: 3200,
    issue: '2 crates damaged due to bumpy highway detour. Buyer requested 15% refund.',
    status: 'OPEN',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'GOVERNANCE' | 'KYC' | 'DISPUTES' | 'SYSTEM'>('GOVERNANCE');
  const [verifications, setVerifications] = useState<PendingVerification[]>(INITIAL_VERIFICATIONS);
  const [disputes, setDisputes] = useState<DisputeClaim[]>(INITIAL_DISPUTES);
  const [mandiAdjustment, setMandiAdjustment] = useState(0);
  const [rateAdjusted, setRateAdjusted] = useState(false);

  const handleVerifyFarmer = (id: string, approve: boolean) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: approve ? 'VERIFIED' : 'FLAGGED' } : v
      )
    );
    const applicant = verifications.find((v) => v.id === id);
    if (applicant && approve) {
      sendPwaNotification({
        title: '✅ Farmer KYC Approved',
        body: `${applicant.name} (${applicant.village}, ${applicant.district}) has been granted the Official Verified Producer Badge.`,
        url: '/admin/dashboard',
      });
    }
  };

  const handleResolveDispute = (dispId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === dispId ? { ...d, status: 'RESOLVED' } : d))
    );
    sendPwaNotification({
      title: '⚖️ Escrow Dispute Arbitrated',
      body: 'Dispute KD-9842 resolved: 85% escrow released to farmer, 15% credit issued to buyer.',
      url: '/admin/dashboard',
    });
  };

  const handleSaveMandiOverride = () => {
    setRateAdjusted(true);
    setTimeout(() => setRateAdjusted(false), 3000);
    sendPwaNotification({
      title: '📊 Mandi Rates Adjusted',
      body: `Platform APMC benchmark adjusted by ${mandiAdjustment >= 0 ? '+' : ''}${mandiAdjustment}% for market stabilization.`,
      url: '/marketplace',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. High-Tech Dark Command Center Header */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Platform Command &amp; Supervision Core
            </span>
            <span className="text-xs text-slate-400 font-mono">SIH 2026 Admin ID: ADM-POOJA-01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            KisanDirect Governance &amp; Regulatory Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Supervise peer-to-peer farmgate transactions, verify 7/12 Land Record KYC, arbitrate digital escrow settlements, and monitor AI vision services.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 relative z-10 shrink-0">
          {[
            { id: 'GOVERNANCE', label: '📊 Telemetry' },
            { id: 'KYC', label: '📑 Farmer 7/12 KYC' },
            { id: 'DISPUTES', label: '⚖️ Escrow Tribunal' },
            { id: 'SYSTEM', label: '⚡ AI Health' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Platform Command Telemetry Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
            Gross Merchandize Value
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            ₹1,42,85,000
          </span>
          <span className="text-[10px] text-emerald-300 font-bold block">+18.4% 30-Day Growth</span>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
            Escrow Funds in Vault
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono block">
            ₹24,80,000
          </span>
          <span className="text-[10px] text-slate-400 block">100% Liquid &bull; RBI Protected</span>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
            Verified Farmer FPOs
          </span>
          <span className="text-2xl font-black text-white font-mono block">
            428 Farmers
          </span>
          <span className="text-[10px] text-indigo-300 block">Across 6 districts</span>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
            Middleman Waste Avoided
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            ₹48,50,000
          </span>
          <span className="text-[10px] text-slate-400 block">Redirected to farmgate</span>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
            Dispute Claim Rate
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            0.4%
          </span>
          <span className="text-[10px] text-slate-400 block">99.6% Clean Settlement</span>
        </div>
      </div>

      {/* 3. TAB 1: GOVERNANCE & TELEMETRY */}
      {activeTab === 'GOVERNANCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* APMC Stabilization & Price Override Terminal */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-lg text-white">
                  APMC Market Stabilization Terminal
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">
                Anti-Cartelization
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If traditional APMC mandi cartels manipulate wholesale auctions, platform administrators can dynamically recalibrate the AI fair benchmark multiplier to protect smallholder farmer realization.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fair Price Benchmark Adjustment:</span>
                <span className={`font-black text-sm ${mandiAdjustment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mandiAdjustment >= 0 ? '+' : ''}{mandiAdjustment}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={mandiAdjustment}
                onChange={(e) => setMandiAdjustment(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-15% (Surplus Relief)</span>
                <span>0% (APMC Modal Baseline)</span>
                <span>+15% (Farmer Margin Boost)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveMandiOverride}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/30"
              >
                Apply Fair Benchmark Adjustment
              </button>
              {rateAdjusted && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  ✓ Platform rates updated in real-time!
                </span>
              )}
            </div>
          </div>

          {/* Real-time Platform Audit Log */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Live Platform Audit Feed</h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>DISPATCH_CONFIRMED</span>
                  <span>14:02 IST</span>
                </div>
                <p className="text-[11px] text-white">
                  Reefer truck #MH-12-Q-4482 dispatched from Manchar Hub with 4,200 kg produce.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>ESCROW_RELEASE</span>
                  <span>13:48 IST</span>
                </div>
                <p className="text-[11px] text-white">
                  ₹18,400 IMPS payout cleared for Ramesh Patil (Order #KD-9824).
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>AI_DIAGNOSIS</span>
                  <span>13:30 IST</span>
                </div>
                <p className="text-[11px] text-white">
                  Gemini Vision 2.0 completed Tomato Early Blight pathology in 1.4s.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>NEW_BULK_BID</span>
                  <span>13:12 IST</span>
                </div>
                <p className="text-[11px] text-white">
                  GreenBite Bistro submitted bid for 500 kg Tomato at ₹19.50/kg.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: FARMER 7/12 LAND RECORD KYC QUEUE */}
      {activeTab === 'KYC' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">
                Farmer Verification &amp; APISetu 7/12 Land Record Queue
              </h3>
              <p className="text-xs text-slate-400">
                Authenticate land ownership to ensure only genuine farmers receive 0% commission direct selling privileges.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-3 py-1 rounded-xl self-start sm:self-auto">
              Mahabhulekh Land API Synced
            </span>
          </div>

          <div className="space-y-3">
            {verifications.map((v) => (
              <div
                key={v.id}
                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white font-sans">{v.name}</strong>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-300">{v.village}, {v.district}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-emerald-400">{v.farmSizeAcres} Acres</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    7/12 Extract: <span className="text-indigo-300 font-bold">{v.khateExtractNo}</span> &bull; Crops: {v.cropType}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {v.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleVerifyFarmer(v.id, true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify &amp; Issue Badge</span>
                      </button>
                      <button
                        onClick={() => handleVerifyFarmer(v.id, false)}
                        className="bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 border border-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Flag</span>
                      </button>
                    </>
                  ) : v.status === 'VERIFIED' ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verified Producer</span>
                    </span>
                  ) : (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-400/40 px-3 py-1.5 rounded-xl font-bold">
                      Flagged for Inspection
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: ESCROW TRIBUNAL & DISPUTE ARBITRATION */}
      {activeTab === 'DISPUTES' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">
                Digital Escrow Arbitration Tribunal
              </h3>
              <p className="text-xs text-slate-400">
                Fair mediation for transport loss, quality discrepancies, or transit delay claims.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-xl self-start sm:self-auto">
              RBI Digital Dispute Framework
            </span>
          </div>

          <div className="space-y-4">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">Order #{d.orderNumber}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-white font-bold">Farmer: {d.farmerName}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-white font-bold">Buyer: {d.buyerName}</span>
                  </div>
                  <span className="font-mono font-black text-sm text-white">Claim: {formatINR(d.amount)}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  <strong>Issue Description:</strong> {d.issue}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">Status: {d.status}</span>
                  {d.status === 'OPEN' ? (
                    <button
                      onClick={() => handleResolveDispute(d.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Arbitrate Settlement (85% Farmer / 15% Buyer Credit)</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                      ✓ Settled &amp; Funds Released
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: SYSTEM & AI HEALTH MONITOR */}
      {activeTab === 'SYSTEM' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white">
              AI Microservices &amp; Gateway Health Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Live status of Gemini 1.5/2.0 vision models, weather satellite radars, and corridor telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Google Gemini Multimodal Vision</span>
              <strong className="text-emerald-400 text-sm block">ONLINE (100%)</strong>
              <span className="text-[10px] text-slate-500">Latency: 1.2s &bull; Gemini 2.0 Flash</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">e-NAM Mandi Gateway</span>
              <strong className="text-emerald-400 text-sm block">ACTIVE SYNC</strong>
              <span className="text-[10px] text-slate-500">Last sync: 6 mins ago</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Open-Meteo Satellite Radar</span>
              <strong className="text-emerald-400 text-sm block">CONNECTED</strong>
              <span className="text-[10px] text-slate-500">Pune &bull; Nashik &bull; Satara</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Cold-Chain IoT Telemetry</span>
              <strong className="text-teal-400 text-sm block">4°C NOMINAL</strong>
              <span className="text-[10px] text-slate-500">6 active trucks in corridor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
