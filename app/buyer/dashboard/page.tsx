'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingDown,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HandCoins,
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  QrCode,
  MapPin,
  ThermometerSnowflake,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';
import confetti from 'canvas-confetti';
import { sendPwaNotification } from '@/lib/pwa-notifications';

interface BuyerBid {
  id: string;
  cropName: string;
  farmerName: string;
  quantity: number;
  myBidPrice: number;
  competingBidPrice: number;
  status: 'WINNING' | 'OUTBID' | 'ACCEPTED';
}

const INITIAL_BUYER_BIDS: BuyerBid[] = [
  {
    id: 'bb-01',
    cropName: 'Grade-A Tomato',
    farmerName: 'Ramesh Patil (Manchar)',
    quantity: 400,
    myBidPrice: 19.5,
    competingBidPrice: 19.0,
    status: 'WINNING',
  },
  {
    id: 'bb-02',
    cropName: 'Nashik Red Onion',
    farmerName: 'Suresh Jadhav (Lasalgaon)',
    quantity: 800,
    myBidPrice: 23.5,
    competingBidPrice: 24.5,
    status: 'OUTBID',
  },
  {
    id: 'bb-03',
    cropName: 'Satara Table Potato',
    farmerName: 'Anita Pawar (Koregaon)',
    quantity: 500,
    myBidPrice: 22.0,
    competingBidPrice: 21.0,
    status: 'WINNING',
  },
];

interface InTransitConsignment {
  id: string;
  orderNumber: string;
  crop: string;
  quantityKg: number;
  farmer: string;
  driverName: string;
  truckNo: string;
  eta: string;
  tempCelsius: number;
  deliveryPin: string;
  delivered: boolean;
}

const INITIAL_CONSIGNMENTS: InTransitConsignment[] = [
  {
    id: 'ship-01',
    orderNumber: 'KD-9824',
    crop: 'Tomato & Chilli Combo (45 crates)',
    quantityKg: 900,
    farmer: 'Ramesh Patil',
    driverName: 'Vikram Shinde',
    truckNo: 'MH-12-Q-4482',
    eta: 'Arriving in 35 mins',
    tempCelsius: 4.2,
    deliveryPin: '9412',
    delivered: false,
  },
];

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [bids, setBids] = useState<BuyerBid[]>(INITIAL_BUYER_BIDS);
  const [consignments, setConsignments] = useState<InTransitConsignment[]>(INITIAL_CONSIGNMENTS);
  const [procurementSpent, setProcurementSpent] = useState(148000);

  const totalSavings = Math.round(procurementSpent * 0.27);

  // Handle Outbid Raise
  const handleRaiseBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => {
        if (b.id === bidId) {
          const newBid = b.competingBidPrice + 0.5;
          return {
            ...b,
            myBidPrice: newBid,
            status: 'WINNING',
          };
        }
        return b;
      })
    );

    const bid = bids.find((b) => b.id === bidId);
    if (bid) {
      sendPwaNotification({
        title: `🚀 Bid Raised for ${bid.cropName}!`,
        body: `Your bid is now ₹${(bid.competingBidPrice + 0.5).toFixed(2)}/kg. You are now the Winning Bidder!`,
        url: '/buyer/dashboard',
      });
    }
  };

  // Handle Delivery PIN Confirmation
  const handleConfirmDelivery = (shipId: string) => {
    setConsignments((prev) =>
      prev.map((c) => (c.id === shipId ? { ...c, delivered: true } : c))
    );
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    sendPwaNotification({
      title: '✅ Delivery Verified with PIN 9412',
      body: 'Produce inspected and accepted. Escrow settlement released to Ramesh Patil.',
      url: '/buyer/dashboard',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Commercial Buyer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'}
            alt="Buyer Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Welcome, {user?.name || 'Rahul Sharma (GreenBite Bistro)'}!
              </h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono">
                {user?.role || 'Restaurant Sourcing'} &bull; GST Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct procurement pipeline active from Pune, Nashik, and Satara verified grower clusters.
            </p>
          </div>
        </div>

        <Link
          href="/marketplace"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 self-start md:self-auto shrink-0 relative z-10"
        >
          <Search className="w-4 h-4" />
          <span>Browse Live Farmgate Lots</span>
        </Link>
      </div>

      {/* 2. Procurement Savings & Economics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider font-mono text-[11px] block">
            Net Procurement Savings
          </span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
            {formatINR(totalSavings)}
          </span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 pt-1">
            <TrendingDown className="w-4 h-4" />
            <span>27% Saved vs City APMC Wholesale</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider font-mono text-[11px] block">
            Total Sourced Volume (YTD)
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white block font-mono">
            6,450 kg
          </span>
          <span className="text-xs text-slate-400 block pt-1">
            Uniform AGMARK Grade-A Quality
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider font-mono text-[11px] block">
            Cold-Chain Integrity
          </span>
          <span className="text-3xl font-black text-teal-600 dark:text-teal-400 block font-mono">
            4.2&deg;C Average
          </span>
          <span className="text-xs text-teal-600 font-bold block pt-1">
            Zero spoilage across 18 shipments
          </span>
        </div>
      </div>

      {/* 3. Section A: Active Commercial Bids & Outbid Defense */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono mb-1">
              <HandCoins className="w-4 h-4" />
              <span>Commercial Bid Manager</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Live Bids on Farmer Lots
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your bulk offers against competing buyers. Counter-bid with 1-click to defend your kitchen&apos;s allocation.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3 py-1 rounded-xl self-start sm:self-auto">
            Direct Farm Contract
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bids.map((b) => {
            const isWinning = b.status === 'WINNING';

            return (
              <div
                key={b.id}
                className={`rounded-2xl p-5 border transition flex flex-col justify-between space-y-4 ${
                  isWinning
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm ring-1 ring-amber-400/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {b.cropName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                        isWinning
                          ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                          : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 animate-pulse'
                      }`}
                    >
                      {isWinning ? 'Winning Bid' : '⚠️ Outbid!'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Producer: <strong>{b.farmerName}</strong>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-1 text-xs font-mono border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Volume:</span>
                      <strong>{b.quantity} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your Bid:</span>
                      <strong className="text-emerald-600 font-black">₹{b.myBidPrice.toFixed(2)}/kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Highest:</span>
                      <strong className="text-slate-900 dark:text-white">
                        ₹{b.competingBidPrice.toFixed(2)}/kg
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  {!isWinning ? (
                    <button
                      onClick={() => handleRaiseBid(b.id)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Raise Bid to ₹{(b.competingBidPrice + 0.5).toFixed(2)}/kg</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-center text-xs font-bold">
                      ✓ Top Bidder &bull; Awaiting Farmer Acceptance
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section B: Live Cold-Chain In-Transit Consignment & PIN Handover */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-teal-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                  Active Cold-Chain Reefer
                </span>
                <span className="text-xs text-slate-400">&bull; Live Telemetry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Scheduled Morning Delivery Consignment
              </h2>
            </div>
          </div>

          <div className="text-right text-xs font-mono">
            <span className="text-slate-400 block">Temperature Log:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
              <ThermometerSnowflake className="w-4 h-4" />
              <span>4.2&deg;C (Optimal Chill Chain)</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {consignments.map((c) => (
            <div
              key={c.id}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-300 text-sm">{c.orderNumber}</span>
                  <span className="text-slate-500">&bull;</span>
                  <strong className="text-white text-sm">{c.crop}</strong>
                  <span className="text-slate-400 font-mono">({c.quantityKg} kg)</span>
                </div>
                <div className="text-slate-300">
                  Farmer: <strong className="text-white">{c.farmer}</strong> &bull; Driver:{' '}
                  <strong className="text-white">{c.driverName}</strong> ({c.truckNo})
                </div>
                <div className="flex items-center gap-2 text-teal-300 font-mono text-[11px] pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{c.delivered ? 'Delivered & Accepted' : c.eta}</span>
                </div>
              </div>

              {/* Handover PIN Display & Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-slate-950/80 border border-teal-400/40 rounded-xl text-center font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">
                    Delivery e-POD PIN:
                  </span>
                  <span className="text-xl font-black text-amber-400 tracking-widest block">
                    {c.deliveryPin}
                  </span>
                </div>

                {!c.delivered ? (
                  <button
                    onClick={() => handleConfirmDelivery(c.id)}
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Confirm Inspection &amp; Release Escrow</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Consignment Handover Complete</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
