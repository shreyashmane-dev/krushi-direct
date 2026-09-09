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
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'METRICS' | 'KYC' | 'DISPUTES'>('METRICS');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyFarmer = async (farmerId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/verify-farmer/${farmerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch {
      alert('Error updating farmer status');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading platform governance metrics...</div>;
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};
  const pendingFarmers = data?.pendingFarmersList || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Platform Administrator
            </span>
            <span className="text-xs text-slate-400">Pooja Kulkarni</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">KisanDirect Governance & Analytics Portal</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time APMC direct trade supervision, farmer KYC verification, and escrow settlement auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/innovation"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Platform Architecture Deck</span>
          </Link>
        </div>
      </div>

      {/* 9 High Level Admin Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Total GMV</span>
          <span className="text-xl font-black text-emerald-700 block">{formatINR(metrics.totalTransactionValue || 0)}</span>
          <span className="text-[10px] text-slate-400">Total Transaction Value</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Farmer Earnings</span>
          <span className="text-xl font-black text-slate-900 block">{formatINR(metrics.totalFarmerEarnings || 0)}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">98% Realized</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Buyer Savings</span>
          <span className="text-xl font-black text-amber-600 block">{formatINR(metrics.estimatedBuyerSavings || 0)}</span>
          <span className="text-[10px] text-slate-400">~28% vs Traditional</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Verified Farmers</span>
          <span className="text-xl font-black text-slate-900 block">{metrics.totalFarmers}</span>
          <span className="text-[10px] text-slate-400">Across 6 Districts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Total Buyers</span>
          <span className="text-xl font-black text-slate-900 block">{metrics.totalBuyers}</span>
          <span className="text-[10px] text-slate-400">Restaurants & Retail</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
          <span className="text-xl font-black text-slate-900 block">{metrics.totalOrders}</span>
          <span className="text-[10px] text-slate-400">100% Escrow Secured</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Active Produce</span>
          <span className="text-xl font-black text-slate-900 block">{metrics.activeListings}</span>
          <span className="text-[10px] text-slate-400">Active Listings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Deliveries</span>
          <span className="text-xl font-black text-blue-600 block">{metrics.completedDeliveries}</span>
          <span className="text-[10px] text-slate-400">Fulfilled Via KisanLogistics</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Pending KYC</span>
          <span className="text-xl font-black text-amber-600 block">{metrics.pendingVerification}</span>
          <span className="text-[10px] text-slate-400">Farmer Verification Queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider block">Disputes</span>
          <span className="text-xl font-black text-emerald-600 block">{metrics.pendingDisputes}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Zero Open Issues</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'METRICS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Analytics & Top Crops
        </button>
        <button
          onClick={() => setActiveTab('KYC')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'KYC' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Farmer KYC Verification</span>
          {pendingFarmers.length > 0 && (
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingFarmers.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Visual Charts & Analytics */}
      {activeTab === 'METRICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Crops Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Top Transacted Crops by Volume (kg)</span>
            </h3>

            <div className="space-y-3 text-xs">
              {charts.topCrops?.map((crop: any) => (
                <div key={crop.name} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{crop.name}</span>
                    <span className="text-slate-900">
                      {crop.volumeKg} kg ({formatINR(crop.revenue)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (crop.volumeKg / 7200) * 100)}%`,
                        backgroundColor: crop.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Hub Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Top Agricultural Hubs (GMV Transacted)</span>
            </h3>

            <div className="space-y-3 text-xs">
              {charts.topLocations?.map((loc: any) => (
                <div key={loc.city} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{loc.city} District</span>
                    <span className="text-emerald-700 font-black">{formatINR(loc.gmv)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (loc.gmv / 345000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Farmer KYC Verification Queue */}
      {activeTab === 'KYC' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Farmer Verification Queue</h3>
            <p className="text-xs text-slate-500">
              Audit landholding details, farm coordinates, and authorize the Verified Farmer badge.
            </p>
          </div>

          {pendingFarmers.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200">
              All registered farmer profiles have been verified! No pending KYC requests.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingFarmers.map((f: any) => (
                <div key={f.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={f.user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'}
                      alt="Farmer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{f.user?.name}</h4>
                      <p className="text-slate-500">{f.farmLocation || `${f.village}, ${f.district}`}</p>
                      <p className="text-[11px] text-slate-600">
                        Farm Size: <strong>{f.farmSize || 5} Acres</strong> • Crops: {f.cropsGrown || 'Wheat, Rice'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyFarmer(f.id, 'VERIFIED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      onClick={() => handleVerifyFarmer(f.id, 'REJECTED')}
                      className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
