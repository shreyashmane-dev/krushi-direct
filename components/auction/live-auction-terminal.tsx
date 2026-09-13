'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Gavel,
  Clock,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Volume2,
  Users,
  Building2,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface AuctionLot {
  id: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  grade: string;
  reservePrice: number;
  currentBid: number;
  highestBidder: string;
  highestBidderType: string;
  bidsCount: number;
  location: string;
  imageUrl: string;
  endsInSeconds: number;
  farmerName: string;
}

const INITIAL_LOTS: AuctionLot[] = [
  {
    id: 'LOT-NASHIK-901',
    cropName: 'Red Hybrid Tomato',
    variety: 'Abhinav 1057 (Grade A+)',
    quantityKg: 5000,
    grade: 'A+ (BRIX 5.6)',
    reservePrice: 32.0,
    currentBid: 38.5,
    highestBidder: 'Green Leaf Gourmet Restaurants',
    highestBidderType: 'Hospitality Chain',
    bidsCount: 14,
    location: 'Dindori, Nashik (Maharashtra)',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop',
    endsInSeconds: 184,
    farmerName: 'Balasaheb Shinde (7/12 #142)',
  },
  {
    id: 'LOT-LASAL-402',
    cropName: 'Nashik Red Onion',
    variety: 'Garwa Winter Storage Grade',
    quantityKg: 12000,
    grade: 'A (55mm+ Size)',
    reservePrice: 24.0,
    currentBid: 29.0,
    highestBidder: 'FreshCart Modern Retail Pvt Ltd',
    highestBidderType: 'Retail Hypermarket',
    bidsCount: 22,
    location: 'Lasalgaon Mandi Hub',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop',
    endsInSeconds: 310,
    farmerName: 'Rameshwar Patil (7/12 #88)',
  },
  {
    id: 'LOT-SANGLI-305',
    cropName: 'Thompson Seedless Grapes',
    variety: 'Export Super Grade A++',
    quantityKg: 3500,
    grade: 'A++ (Sugar 18°Bx)',
    reservePrice: 75.0,
    currentBid: 92.5,
    highestBidder: 'AgroEuro Export Logistics',
    highestBidderType: 'Direct Exporter',
    bidsCount: 19,
    location: 'Tasgaon, Sangli',
    imageUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800&auto=format&fit=crop',
    endsInSeconds: 95,
    farmerName: 'Vikas Deshmukh (APEDA Reg #504)',
  },
];

function playBidChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    // Pleasant double ping
    [587.33, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.35);
    });
  } catch {
    // Ignore audio permission block
  }
}

export default function LiveAuctionTerminal() {
  const { user } = useAuth();
  const [lots, setLots] = useState<AuctionLot[]>(INITIAL_LOTS);
  const [selectedLotId, setSelectedLotId] = useState<string>(INITIAL_LOTS[0].id);
  const [customRaise, setCustomRaise] = useState<number>(0.5);
  const [bidHistory, setBidHistory] = useState<{ id: string; bidder: string; amount: number; time: string }[]>([
    { id: '1', bidder: 'Green Leaf Restaurants', amount: 38.5, time: '12s ago' },
    { id: '2', bidder: 'Vashi Wholesale Cartel', amount: 38.0, time: '45s ago' },
    { id: '3', bidder: 'FreshBazaar Hypermarkets', amount: 37.5, time: '1m ago' },
    { id: '4', bidder: 'Balasaheb Shinde Reserve', amount: 32.0, time: '3m ago' },
  ]);
  const [lockedEscrow, setLockedEscrow] = useState<boolean>(false);
  const [flashHighlight, setFlashHighlight] = useState<boolean>(false);

  const activeLot = lots.find((l) => l.id === selectedLotId) || lots[0];

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLots((prevLots) =>
        prevLots.map((lot) => ({
          ...lot,
          endsInSeconds: lot.endsInSeconds > 0 ? lot.endsInSeconds - 1 : 0,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (raise: number) => {
    playBidChime();
    const newPrice = Number((activeLot.currentBid + raise).toFixed(2));
    const bidderName = user?.name || 'Direct Procurement Buyer';

    setLots((prev) =>
      prev.map((l) =>
        l.id === activeLot.id
          ? { ...l, currentBid: newPrice, bidsCount: l.bidsCount + 1, highestBidder: bidderName }
          : l
      )
    );

    setBidHistory((prev) => [
      { id: Date.now().toString(), bidder: bidderName, amount: newPrice, time: 'Just now' },
      ...prev.slice(0, 5),
    ]);

    setFlashHighlight(true);
    setTimeout(() => setFlashHighlight(false), 800);
  };

  const handleLockEscrow = () => {
    playBidChime();
    setLockedEscrow(true);
  };

  const totalLotValue = activeLot.currentBid * activeLot.quantityKg;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Real-Time High-Frequency Mandi Floor</span>
            <span className="text-[10px] bg-emerald-400/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-black">
              LIVE
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Direct Farmgate Bidding Terminal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminating mandi broker rings with transparent, cryptographic direct bidding. Verified buyers place instant competitive bids; RBI-compliant digital escrow locks funds upon seller acceptance.
          </p>
        </div>

        {/* Global Trading Stats */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Active Lots
            </span>
            <span className="text-xl font-black text-white font-mono">18 Lots</span>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-400/30 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block font-mono">
              Escrow Locked 24h
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">₹48.6 Lakh</span>
          </div>
        </div>
      </div>

      {/* Lot Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {lots.map((lot) => (
          <button
            key={lot.id}
            type="button"
            onClick={() => {
              setSelectedLotId(lot.id);
              setLockedEscrow(false);
            }}
            className={`px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-3 shrink-0 border ${
              selectedLotId === lot.id
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
            }`}
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-white/20">
              <img src={lot.imageUrl} alt={lot.cropName} className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="font-black text-xs leading-tight">{lot.cropName}</div>
              <div className="text-[10px] opacity-80 font-mono">
                {lot.quantityKg} kg &bull; ₹{lot.currentBid}/kg
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-black">
              {formatSeconds(lot.endsInSeconds)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Trading Floor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lot Spotlight & Inspection Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {/* Lot Header & Countdown Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">
                    {activeLot.id}
                  </span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md font-mono">
                    {activeLot.grade}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {activeLot.cropName} &mdash; {activeLot.variety}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Produced by {activeLot.farmerName} &bull; {activeLot.location}
                </p>
              </div>

              {/* Countdown Dial */}
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${
                  activeLot.endsInSeconds < 60
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}
              >
                <Clock className="w-5 h-5" />
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold block leading-none">
                    Auction Closes In
                  </span>
                  <span className="text-xl font-black font-mono tracking-wider">
                    {formatSeconds(activeLot.endsInSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Produce Hero Image with Live Overlays */}
            <div className="relative rounded-2xl overflow-hidden h-72 border border-slate-200 dark:border-slate-800">
              <img
                src={activeLot.imageUrl}
                alt={activeLot.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-300 font-medium">Lot Volume</span>
                    <div className="text-2xl font-black font-mono text-white">
                      {activeLot.quantityKg.toLocaleString()} kg ({activeLot.quantityKg / 100} Qtl)
                    </div>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-xs text-slate-300 font-medium">Total Consignment Value</span>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      ₹{totalLotValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Tag */}
              <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>7/12 Land Title Verified</span>
              </div>
            </div>

            {/* Bidding Control Panel */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                flashHighlight
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 scale-[1.01]'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block uppercase font-mono">
                    Highest Current Active Bid
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                      ₹{activeLot.currentBid.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/kg</span>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full font-mono">
                      +{Math.round(((activeLot.currentBid - activeLot.reservePrice) / activeLot.reservePrice) * 100)}% over reserve
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block font-mono">Leading Bidder</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {activeLot.highestBidder}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    {activeLot.highestBidderType}
                  </span>
                </div>
              </div>

              {/* Fast Raise Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Quick Bid Raises (Direct Farmgate Outbid):
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[0.5, 1.0, 2.0].map((raise) => (
                    <button
                      key={raise}
                      type="button"
                      onClick={() => handlePlaceBid(raise)}
                      className="bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 p-3 rounded-xl transition text-center shadow-xs group"
                    >
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block group-hover:scale-105 transition">
                        +₹{raise.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (₹{(activeLot.currentBid + raise).toFixed(2)}/kg)
                      </span>
                    </button>
                  ))}
                </div>

                {/* Seller Acceptance or Buyer Action */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlaceBid(1.5)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Place Competitive Bid (₹{(activeLot.currentBid + 1.5).toFixed(2)}/kg)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLockEscrow}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-black px-4 py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Accept &amp; Lock Escrow</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Order Book & Escrow Certificate (1 col) */}
        <div className="space-y-6">
          {/* Locked Escrow Modal Card (Celebration) */}
          {lockedEscrow ? (
            <div className="bg-gradient-to-br from-emerald-900 to-slate-950 text-white p-6 rounded-3xl border border-emerald-400 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  RBI Regulated Escrow Locked
                </span>
                <h4 className="text-xl font-black text-white">Deal Secured!</h4>
                <p className="text-xs text-slate-300">
                  Total amount of <strong className="text-emerald-400">₹{totalLotValue.toLocaleString('en-IN')}</strong> deposited into digital escrow vault.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl space-y-2 border border-slate-800 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Escrow Ref:</span>
                  <span className="text-white">KD-ESC-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery PIN:</span>
                  <span className="text-emerald-400 font-bold tracking-widest">7492</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Release SLA:</span>
                  <span className="text-white">IMPS within 2h of handover</span>
                </div>
              </div>

              <Link
                href={`/contract/${activeLot.id}`}
                className="w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition block shadow-sm"
              >
                View Smart Forward Contract &rarr;
              </Link>
            </div>
          ) : (
            /* Live Bid Ticker Feed */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    Live Ticking Order Book
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeLot.bidsCount} Bids Total
                </span>
              </div>

              <div className="space-y-2.5">
                {bidHistory.map((b, idx) => (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between ${
                      idx === 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        {idx === 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {b.bidder}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {b.time}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                        ₹{b.amount.toFixed(2)}/kg
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">
                        ₹{(b.amount * activeLot.quantityKg).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mandi APMC Benchmark comparison */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                  Govt Agmarknet Mandi Modal
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Nashik APMC:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹28.00/kg</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Direct Farmgate Premium:</span>
                  <span>+₹{(activeLot.currentBid - 28.0).toFixed(2)}/kg (+37%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs space-y-2 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Mandi Arhat / Dalali Cartels</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-300">
              Unlike physical mandi auctions where middlemen collude to suppress bids, every bid is cryptographically recorded with instant UPI bank disbursement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
