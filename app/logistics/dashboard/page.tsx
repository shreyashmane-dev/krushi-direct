'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  ThermometerSnowflake,
  ShieldCheck,
  Navigation,
  KeyRound,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Phone,
  Radio,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function LogisticsDashboardPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Dispatch Trip State
  const [tripStage, setTripStage] = useState<
    'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED'
  >('IN_TRANSIT');
  const [otpInput, setOtpInput] = useState('');
  const [podCompleted, setPodCompleted] = useState(false);
  const [temperature, setTemperature] = useState(4.2);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNextStage = () => {
    if (tripStage === 'ASSIGNED') {
      setTripStage('PICKED_UP');
      showToast('Pickup recorded at Ramesh Patil Farm, Manchar. Cold air curtain engaged.');
    } else if (tripStage === 'PICKED_UP') {
      setTripStage('IN_TRANSIT');
      showToast('Shipment in transit via Pune-Nashik Expressway.');
    } else if (tripStage === 'IN_TRANSIT') {
      setTripStage('DELIVERED');
      showToast('Arrived at GreenBite Bistro kitchen gate. Awaiting OTP verification.');
    }
  };

  const handleVerifyOtp = () => {
    if (otpInput === '4892' || otpInput.length === 4) {
      setPodCompleted(true);
      setTripStage('DELIVERED');
      showToast('e-POD confirmed! Freight settlement of ₹1,450 deposited to your bank.');
    } else {
      showToast('Invalid delivery OTP. Please ask receiver for 4-digit code (Hint: 4892)');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Logistics Partner Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'}
            alt="Logistics Partner"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.name || 'Vikram Shinde (KisanLogistics)'}
              </h1>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Truck className="w-3 h-3 text-teal-400" />
                Cold-Chain Fleet Partner
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Vehicle: Reefer 3.5T Eicher (#MH-12-KL-9901) • Route: Pune-Narayangaon Corridor</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-teal-900/60 border border-teal-500/40 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-teal-300 block">Fleet IoT Status</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 justify-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Telemetry Online
            </span>
          </div>
        </div>
      </div>

      {/* 4 Logistics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Freight Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Today&apos;s Freight Earnings</span>
          <span className="text-3xl font-black text-emerald-700 block">{formatINR(5450)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Includes ₹600 Cold-Chain Performance Bonus</span>
          </span>
        </div>

        {/* Active Dispatch */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Dispatches</span>
          <span className="text-3xl font-black text-slate-900 block">1 Live Trip</span>
          <span className="text-[11px] text-teal-700 font-medium">3 Completed Earlier Today</span>
        </div>

        {/* On-Time Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">On-Time Delivery SLA</span>
          <span className="text-3xl font-black text-teal-700 block">98.6%</span>
          <span className="text-[11px] text-slate-500">Average transit time 2.8 hrs</span>
        </div>

        {/* Reefer Temperature */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Chamber Temperature</span>
          <span className="text-3xl font-black text-blue-700 flex items-center gap-1">
            <ThermometerSnowflake className="w-6 h-6 text-blue-600" />
            <span>{temperature}°C</span>
          </span>
          <span className="text-[11px] text-blue-600 font-medium">Target 3.5°C - 5.5°C (Optimal)</span>
        </div>
      </div>

      {/* Live Active Dispatch Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Active Live Dispatch • Trip #TRK-KD-98231
              </h3>
              <p className="text-xs text-slate-500">10 Crates Grade-A Tomato (200 kg) • Farm to Kitchen Direct</p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start">
            Cold Reefer Sealed
          </span>
        </div>

        {/* Waypoints Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Gate */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pickup (Farm Gate)
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Ramesh Patil Organic Farm</h4>
            <p className="text-xs text-slate-600">Survey 48, Manchar-Narayangaon Agro Belt, Pune District</p>
            <p className="text-[11px] text-slate-500">Phone: +91 98220 11223 • Harvested: Today 6:00 AM</p>
          </div>

          {/* Delivery Drop */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Drop-Off (Kitchen Gate)
            </span>
            <h4 className="font-bold text-slate-900 text-sm">GreenBite Bistro &amp; Commercial Kitchen</h4>
            <p className="text-xs text-slate-600">Lane 6, Koregaon Park, Shivajinagar, Pune - 411001</p>
            <p className="text-[11px] text-slate-500">Receiver: Rahul Sharma (+91 98900 88776)</p>
          </div>
        </div>

        {/* Interactive Milestone Stages */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Transit Progress Stages
            </span>
            <span className="text-xs font-bold text-teal-700">
              Current Stage: <strong>{tripStage}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
              tripStage !== 'ASSIGNED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white text-slate-700 border-slate-200'
            }`}>
              1. Dispatched to Farm
            </div>
            <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
              tripStage === 'PICKED_UP' || tripStage === 'IN_TRANSIT' || tripStage === 'DELIVERED'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              2. Produce Loaded (Manchar)
            </div>
            <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
              tripStage === 'IN_TRANSIT' || tripStage === 'DELIVERED'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              3. Cold Transit (Moshi Toll)
            </div>
            <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
              podCompleted ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              4. Delivered &amp; Settled
            </div>
          </div>

          {/* Advance Milestone Button */}
          {!podCompleted && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleNextStage}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-2"
              >
                <span>Advance to Next Transit Milestone</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const newT = Number((3.8 + Math.random() * 0.8).toFixed(1));
                  setTemperature(newT);
                  showToast(`Reefer chiller compressor pinged. Current temp: ${newT}°C`);
                }}
                className="text-xs text-slate-600 hover:text-teal-700 font-semibold underline"
              >
                Simulate Reefer Telemetry Ping
              </button>
            </div>
          )}
        </div>

        {/* e-POD OTP Confirmation Section */}
        <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              Electronic Proof of Delivery (e-POD)
            </span>
            <p className="text-xs text-slate-600">
              Ask restaurant receiver Rahul Sharma for his 4-digit confirmation PIN to release your payout.
            </p>
          </div>

          {podCompleted ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Trip Completed &amp; ₹1,450 Settled</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="4892"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-24 text-center font-mono font-bold text-base bg-white border border-emerald-300 rounded-xl py-2 px-3 text-slate-900 shadow-sm"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md whitespace-nowrap"
              >
                Verify &amp; Disburse Freight
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
