'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Factory,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  MapPin,
  FileText,
  BadgeAlert,
  Download,
  Microscope,
  Scale,
  Sparkles,
  Lock,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function ProcessorDashboardPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contracts state
  const [contracts, setContracts] = useState([
    {
      id: 'CT-2026-TOM-004',
      commodity: 'Processing Tomato (Abhinav Puree Hybrid)',
      farmerCluster: 'Ramesh Patil FPO (Manchar Cluster)',
      totalContractTons: 15.0,
      deliveredTons: 12.5,
      ratePerTon: 18000, // ₹18/kg
      escrowAmount: 270000,
      qcStatus: 'PASSED',
      brixScore: '4.8° Brix',
      escrowStatus: 'ESCROW_LOCKED',
    },
    {
      id: 'CT-2026-ONI-009',
      commodity: 'Dehydrated Onion Flakes Grade-B',
      farmerCluster: 'Suresh Jadhav Producer Co. (Lasalgaon)',
      totalContractTons: 20.0,
      deliveredTons: 18.0,
      ratePerTon: 24000, // ₹24/kg
      escrowAmount: 480000,
      qcStatus: 'IN_INSPECTION',
      brixScore: '14.2% Dry Solids',
      escrowStatus: 'PENDING_QC',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReleaseEscrow = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, escrowStatus: 'DISBURSED', qcStatus: 'APPROVED' } : c))
    );
    showToast(`Escrow disbursement released to farmer cluster bank account for Contract ${contractId}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Processor Console Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'}
            alt="Food Processor"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.name || 'Sunil Jagtap (Sahyadri Agro)'}
              </h1>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Factory className="w-3 h-3 text-purple-400" />
                Industrial Food Processor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Dindori Mega Food Processing Park, Nashik • FSSAI License: 10019022009844</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => showToast('Model Contract Farming Agreement draft generated under Model Act 2020.')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>+ Draft Contract Farming RFP</span>
          </button>
          <Link
            href="/marketplace"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Procurement Feed
          </Link>
        </div>
      </div>

      {/* 4 Industrial Sourcing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contracted Intake */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Raw Material Contracted</span>
          <span className="text-3xl font-black text-slate-900 block">35.0 Tons</span>
          <span className="text-[11px] text-purple-700 font-semibold">30.5 Tons weighbridge accepted</span>
        </div>

        {/* Cost Variance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Procurement Cost Variance</span>
          <span className="text-3xl font-black text-emerald-700 block">-17.4%</span>
          <span className="text-[11px] text-emerald-600 font-medium">Lower cost than open spot mandi lots</span>
        </div>

        {/* Quality Compliance Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Quality Compliance Score</span>
          <span className="text-3xl font-black text-purple-700 block">99.1%</span>
          <span className="text-[11px] text-purple-600 font-medium">Brix &gt;= 4.5° • Zero heavy metals</span>
        </div>

        {/* Escrow Protected Capital */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Escrow Protected Funds</span>
          <span className="text-3xl font-black text-slate-900 block">{formatINR(750000)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Digital escrow payout upon QC release</span>
          </span>
        </div>
      </div>

      {/* Multi-Ton Supply Contracts Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Multi-Ton Contract Farming Supply Batches</h3>
            <p className="text-xs text-slate-500">Traceable farmgate batch agreements with escrow-guaranteed payments</p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            FSSAI Track & Trace Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Contract ID & Produce</th>
                <th className="py-3 px-4">Farmer Cluster FPO</th>
                <th className="py-3 px-4">Contract Volume</th>
                <th className="py-3 px-4">Lab QC Score</th>
                <th className="py-3 px-4">Escrow Value</th>
                <th className="py-3 px-4 text-right">Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] text-slate-400 block">{c.id}</span>
                    <span className="font-bold text-slate-900 text-sm">{c.commodity}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {c.farmerCluster}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{c.deliveredTons} / {c.totalContractTons} Tons</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">@ {formatINR(c.ratePerTon)}/Ton</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      c.qcStatus === 'PASSED' || c.qcStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.brixScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    {formatINR(c.escrowAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.escrowStatus === 'ESCROW_LOCKED' ? (
                      <button
                        onClick={() => handleReleaseEscrow(c.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
                      >
                        Release Escrow Payout
                      </button>
                    ) : c.escrowStatus === 'DISBURSED' ? (
                      <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Disbursed
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setContracts((prev) =>
                            prev.map((item) => (item.id === c.id ? { ...item, qcStatus: 'PASSED', escrowStatus: 'ESCROW_LOCKED' } : item))
                          );
                          showToast('Lab spectrometry verified! Escrow now ready for release.');
                        }}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        Run QC Test
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab QC Spectrometry Specs Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Microscope className="w-5 h-5" />
            <h4 className="font-bold text-slate-900 text-sm">Processing Grade QC Tolerance Standards</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>Brix Sugar Concentration (Puree/Paste):</span>
              <strong className="text-slate-900">&gt;= 4.5° Brix</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>Moisture Limit (Dehydration):</span>
              <strong className="text-slate-900">&lt;= 12.0% Maximum</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>Uniform Fruit Diameter (Sorting Index):</span>
              <strong className="text-slate-900">45 mm - 65 mm</strong>
            </li>
            <li className="flex justify-between">
              <span>Organophosphate Pesticide Screening:</span>
              <strong className="text-emerald-700 font-bold">Non-Detectable (ND)</strong>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-950 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Scale className="w-5 h-5" />
            <h4 className="font-bold text-sm">Automated Electronic Weighbridge Integration</h4>
          </div>
          <p className="text-xs text-purple-100/80 leading-relaxed">
            Truck shipments inbound to Dindori Mega Food Park are dynamically verified with weighbridge gross & tare sensor sync, automatically updating delivered tonnage.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Weighbridge Gate: #WB-PUNE-01</span>
            <button
              onClick={() => showToast('Fetching real-time gross/tare load cell readings...')}
              className="text-purple-300 hover:text-white font-semibold underline"
            >
              Sync Live Loadcell →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
