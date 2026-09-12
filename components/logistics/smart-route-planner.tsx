'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  TrendingDown,
  Clock,
  Fuel,
  Leaf,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ThermometerSnowflake,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  QrCode,
  Share2,
  Copy,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface PoolingResult {
  consignmentId: string;
  corridorName: string;
  distanceKm: number;
  transitTimeStr: string;
  pricing: {
    soloVehicleCost: number;
    pooledCost: number;
    savingsAmount: number;
    savingsPercent: number;
    ratePerKg: number;
  };
  capacity: {
    truckCapacityKg: number;
    userPayloadKg: number;
    existingLoadedKg: number;
    totalCombinedKg: number;
    utilizationPercent: number;
    remainingSlotsKg: number;
  };
  eco: {
    dieselSavedLitres: number;
    co2SavedKg: number;
  };
  vehicle: {
    recommendedVehicle: string;
    isColdChain: boolean;
    temperatureTarget: string;
  };
  waypoints: Array<{
    id: string;
    type: 'PICKUP' | 'COLLECTIVE_STOP' | 'DROP_OFF';
    title: string;
    location: string;
    eta: string;
    cargoDescription: string;
    farmerOrBuyer: string;
    status: 'SCHEDULED' | 'EN_ROUTE' | 'COMPLETED';
  }>;
  trackingPin: string;
}

const ORIGIN_PRESETS = [
  { name: 'Manchar (Pune)', value: 'Manchar, Ambegaon Taluka, Pune' },
  { name: 'Lasalgaon (Nashik)', value: 'Lasalgaon Mandi Belt, Nashik' },
  { name: 'Baramati (Pune)', value: 'Baramati Agro Cluster, Pune' },
  { name: 'Rahuri (Ahmednagar)', value: 'Rahuri Agricultural Belt, Ahmednagar' },
  { name: 'Koregaon (Satara)', value: 'Koregaon Potato Hub, Satara' },
  { name: 'Narayangaon (Pune)', value: 'Narayangaon Tomato Cluster, Pune' },
];

const DESTINATION_PRESETS = [
  { name: 'Pune Market Yard', value: 'Gultekdi APMC Market Yard, Pune - 411037' },
  { name: 'Vashi APMC (Navi Mumbai)', value: 'Vashi Wholesale APMC Market, Navi Mumbai' },
  { name: 'Koregaon Park (Kitchens)', value: 'Koregaon Park Commercial Kitchens, Pune' },
  { name: 'Hinjawadi (Cloud Kitchens)', value: 'Hinjawadi Food Hub & Restomarts, Pune' },
  { name: 'Dadar Wholesale (Mumbai)', value: 'Dadar Central Vegetable Wholesale Mandi, Mumbai' },
];

export default function SmartRoutePlanner() {
  const { language } = useLanguage();

  const [origin, setOrigin] = useState('Manchar, Ambegaon Taluka, Pune');
  const [destination, setDestination] = useState('Gultekdi APMC Market Yard, Pune - 411037');
  const [payloadKg, setPayloadKg] = useState<number>(450);
  const [produceType, setProduceType] = useState('Tomato');
  const [isColdChain, setIsColdChain] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PoolingResult | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const calculateRoute = async () => {
    setLoading(true);
    setBookingConfirmed(false);
    try {
      const res = await fetch('/api/logistics/pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          payloadKg: Number(payloadKg) || 400,
          produceType,
          temperatureReq: isColdChain ? 'COLD_CHAIN' : 'AMBIENT',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Failed to calculate logistics pooling:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateRoute();
  }, []);

  const handleBookDispatch = () => {
    setBookingConfirmed(true);
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 border border-teal-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Truck className="w-3 h-3 text-emerald-400" />
                Smart Highway Corridor Pooling
              </span>
              <span className="text-teal-300/80 text-xs font-semibold">
                • 40%–60% Freight Savings
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Logistics Pooling &amp; Multi-Stop Route Optimizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stop paying for empty truck mileage. KisanDirect dynamically bundles smallholder produce batches along common highway corridors with real-time payload matching.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
              ₹
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Average Pool Savings</span>
              <span className="text-lg font-black text-emerald-300">₹1,450 – ₹3,200</span>
              <span className="text-[10px] text-slate-300 block">per multi-farm dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Live Corridor / Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Details Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Route &amp; Freight Parameters</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-bold">
              Dynamic Optimizer
            </span>
          </div>

          {/* Farm / Origin Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Pickup / Farm Gate Location</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setOrigin(`Geo Farm Location (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}) - Manchar Belt`);
                    });
                  }
                }}
                className="text-[10px] text-emerald-600 hover:underline font-semibold"
              >
                📍 Use My GPS
              </button>
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Manchar, Narayangaon, Lasalgaon..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {/* Quick Origin Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ORIGIN_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setOrigin(p.value)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ${
                    origin === p.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Destination Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Destination / Buyer Delivery Address</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Pune Market Yard, Vashi APMC Mumbai, Restaurant..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {/* Quick Destination Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DESTINATION_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setDestination(p.value)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ${
                    destination === p.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Produce & Weight Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Produce Type
              </label>
              <select
                value={produceType}
                onChange={(e) => setProduceType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="Tomato">🍅 Tomato (Cratered)</option>
                <option value="Onion">🧅 Onion (Mesh Bags)</option>
                <option value="Potato">🥔 Potato (Jute Sacks)</option>
                <option value="Mango">🥭 Mango (Ventilated)</option>
                <option value="Green Chilli">🌶️ Chilli (Corrugated)</option>
                <option value="Grapes">🍇 Grapes (Cushioned)</option>
                <option value="Leafy Vegetables">🥬 Leafy Vegetables</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Payload Weight ({payloadKg} kg)
              </label>
              <input
                type="number"
                min={50}
                max={2500}
                step={50}
                value={payloadKg}
                onChange={(e) => setPayloadKg(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-2.5 text-xs font-black text-emerald-700 dark:text-emerald-400"
              />
            </div>
          </div>

          {/* Temperature Specification Toggle */}
          <div
            onClick={() => setIsColdChain(!isColdChain)}
            className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between ${
              isColdChain
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-900 dark:text-blue-300'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ThermometerSnowflake className={`w-5 h-5 ${isColdChain ? 'text-blue-600' : 'text-slate-400'}`} />
              <div>
                <span className="text-xs font-bold block">Reefer Cold-Chain Required (4°C – 8°C)</span>
                <span className="text-[10px] opacity-80">
                  {isColdChain ? 'Sealed reefer compressor enabled' : 'Standard ambient ventilated vehicle'}
                </span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full transition p-0.5 ${isColdChain ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition transform ${isColdChain ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            onClick={calculateRoute}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Optimizing Corridor Clusters...' : 'Optimize Route & Find Pool Matches'}</span>
          </button>
        </div>

        {/* Right Column: Dynamic Corridor Routing & Cost Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Corridor & Savings Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                      Matched Agro Highway Corridor
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {result.corridorName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-mono">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      {result.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-mono">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {result.transitTimeStr}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Savings Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Solo Vehicle Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                      <span>Solo Vehicle Hire</span>
                      <span className="line-through text-slate-400">{formatINR(result.pricing.soloVehicleCost)}</span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 block leading-tight">
                      Full dedicated truck with deadhead empty mileage return cost.
                    </span>
                  </div>

                  {/* Pooled Vehicle Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500/80 space-y-1 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
                        KisanDirect Pooled Fare
                      </span>
                      <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">
                        Save {result.pricing.savingsPercent}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                        {formatINR(result.pricing.pooledCost)}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        (~₹{result.pricing.ratePerKg}/kg)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                      You save {formatINR(result.pricing.savingsAmount)} directly on this trip!
                    </span>
                  </div>
                </div>

                {/* Truck Capacity Load Factor Bar */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Fleet Capacity Utilization ({result.capacity.utilizationPercent}%)</span>
                    </span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400">
                      {result.capacity.totalCombinedKg} / {result.capacity.truckCapacityKg} kg
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.round((result.capacity.existingLoadedKg / result.capacity.truckCapacityKg) * 100)}%` }}
                      className="bg-slate-400 dark:bg-slate-500 h-full title"
                      title="Partner farmers load"
                    />
                    <div
                      style={{ width: `${Math.round((result.capacity.userPayloadKg / result.capacity.truckCapacityKg) * 100)}%` }}
                      className="bg-emerald-500 h-full animate-pulse"
                      title="Your load"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 font-medium">
                    <span>
                      🟦 Existing: {result.capacity.existingLoadedKg} kg &bull; 🟩 Your batch: {result.capacity.userPayloadKg} kg
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {result.capacity.remainingSlotsKg} kg remaining space
                    </span>
                  </div>
                </div>

                {/* Eco Sustainability Savings */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <Fuel className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="font-black text-teal-900 dark:text-teal-200 block">
                        {result.eco.dieselSavedLitres} Litres Diesel
                      </span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400">Consolidated fuel savings</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-emerald-900 dark:text-emerald-200 block">
                        {result.eco.co2SavedKg} kg CO₂ Avoided
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Green corridor dispatch</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Vehicle */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Allocated Fleet:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{result.vehicle.recommendedVehicle}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-mono">
                    {result.vehicle.temperatureTarget}
                  </span>
                </div>
              </div>

              {/* Waypoints Timeline & Booking CTA */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Dynamic Corridor Waypoints &amp; Drops</span>
                </h4>

                <div className="space-y-4 relative before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {result.waypoints.map((w, idx) => (
                    <div key={w.id} className="relative flex items-start gap-4 pl-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black z-10 shrink-0 ${
                        w.type === 'PICKUP'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                          : w.type === 'COLLECTIVE_STOP'
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-950'
                          : 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {w.title}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            {w.eta}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {w.location}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>📦 {w.cargoDescription}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{w.farmerOrBuyer}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Booking Pass Result */}
                {bookingConfirmed ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-teal-900 text-white border border-emerald-400/40 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="text-xs font-black uppercase text-emerald-300 block">
                            Pooled Dispatch Confirmed!
                          </span>
                          <span className="text-[11px] text-slate-300 font-mono">
                            Pass #{result.consignmentId}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-300 block">Total Fare</span>
                        <span className="text-lg font-black text-emerald-300">{formatINR(result.pricing.pooledCost)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                        <span className="text-[10px] text-slate-300 uppercase block font-bold">Driver e-POD PIN</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xl font-mono font-black text-white">{result.trackingPin}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPin(result.trackingPin)}
                            className="text-xs bg-emerald-500/40 hover:bg-emerald-500 px-2 py-1 rounded text-white transition flex items-center gap-1"
                          >
                            {copiedPin ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                        <span className="text-[10px] text-slate-300 uppercase block font-bold">Estimated Farm Pickup</span>
                        <span className="text-xs font-black text-white mt-1 block">Today 07:00 AM – 07:30 AM</span>
                        <span className="text-[10px] text-emerald-300">Live GPS tracking link sent via SMS</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleBookDispatch}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 rounded-2xl transition shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Book My Slot in This Pooled Dispatch (Pay {formatINR(result.pricing.pooledCost)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
