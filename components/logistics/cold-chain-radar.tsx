'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Thermometer,
  Activity,
  Gauge,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Wind,
  BatteryCharging,
  Navigation,
  Sparkles,
  PhoneCall,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface ReeferTruck {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  corridor: string;
  origin: string;
  destination: string;
  crop: string;
  crates: number;
  weightKg: number;
  tempCelsius: number;
  targetTemp: number;
  humidityPct: number;
  vibrationG: number;
  speedKmh: number;
  etaMinutes: number;
  status: 'OPTIMAL' | 'COOLING_BOOST' | 'NEAR_DESTINATION';
  batteryPct: number;
  lastPing: string;
}

const REEFER_FLEET: ReeferTruck[] = [
  {
    id: 'TRK-01',
    plateNumber: 'MH-15-EG-4921',
    driverName: 'Suresh Shinde (Cold-Fleet Certified)',
    driverPhone: '+91 98231 44021',
    corridor: 'Nashik -> Vashi APMC (NH-160)',
    origin: 'Dindori Farm Cluster, Nashik',
    destination: 'Vashi APMC Central Terminal, Navi Mumbai',
    crop: 'Red Hybrid Tomato (Grade A+)',
    crates: 350,
    weightKg: 7000,
    tempCelsius: 4.2,
    targetTemp: 4.0,
    humidityPct: 88,
    vibrationG: 0.18,
    speedKmh: 64,
    etaMinutes: 85,
    status: 'OPTIMAL',
    batteryPct: 94,
    lastPing: '2s ago',
  },
  {
    id: 'TRK-02',
    plateNumber: 'MH-12-QX-8819',
    driverName: 'Pandurang Ghadge',
    driverPhone: '+91 94220 81923',
    corridor: 'Manchar -> Pune Market Yard (NH-60)',
    origin: 'Manchar Cold Aggregation Hub',
    destination: 'Gultekdi Market Yard, Pune',
    crop: 'Pomegranate & Green Chillies',
    crates: 220,
    weightKg: 4400,
    tempCelsius: 6.8,
    targetTemp: 5.0,
    humidityPct: 82,
    vibrationG: 0.24,
    speedKmh: 52,
    etaMinutes: 38,
    status: 'COOLING_BOOST',
    batteryPct: 89,
    lastPing: '5s ago',
  },
  {
    id: 'TRK-03',
    plateNumber: 'MH-10-BT-3104',
    driverName: 'Anil Kadam',
    driverPhone: '+91 97635 11048',
    corridor: 'Sangli -> Thane Retail Depots',
    origin: 'Tasgaon Grape Packhouse',
    destination: 'Thane Central Supermarket DC',
    crop: 'Thompson Seedless Grapes (Cold Cured)',
    crates: 480,
    weightKg: 4800,
    tempCelsius: 1.8,
    targetTemp: 2.0,
    humidityPct: 92,
    vibrationG: 0.14,
    speedKmh: 71,
    etaMinutes: 140,
    status: 'OPTIMAL',
    batteryPct: 97,
    lastPing: 'Just now',
  },
  {
    id: 'TRK-04',
    plateNumber: 'MH-09-CA-5512',
    driverName: 'Mahesh Jadhav',
    driverPhone: '+91 98811 77319',
    corridor: 'Kolhapur -> Dadar Wholesale Hub',
    origin: 'Karveer Organic Farmer Group',
    destination: 'Dadar Vegetable Market, Mumbai',
    crop: 'Organic Capsicum & Broccoli',
    crates: 180,
    weightKg: 3200,
    tempCelsius: 3.5,
    targetTemp: 4.0,
    humidityPct: 86,
    vibrationG: 0.16,
    speedKmh: 48,
    etaMinutes: 18,
    status: 'NEAR_DESTINATION',
    batteryPct: 91,
    lastPing: '1s ago',
  },
];

export default function ColdChainRadar() {
  const [fleet, setFleet] = useState<ReeferTruck[]>(REEFER_FLEET);
  const [selectedTruckId, setSelectedTruckId] = useState<string>(REEFER_FLEET[0].id);
  const [tempOffset, setTempOffset] = useState<number>(0);

  const selectedTruck = fleet.find((t) => t.id === selectedTruckId) || fleet[0];
  const effectiveTemp = Number((selectedTruck.tempCelsius + tempOffset).toFixed(1));

  // Simulated live telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet((prev) =>
        prev.map((t) => ({
          ...t,
          speedKmh: Math.max(40, Math.min(80, t.speedKmh + (Math.random() * 4 - 2))),
          vibrationG: Number((0.15 + Math.random() * 0.08).toFixed(2)),
          etaMinutes: Math.max(1, t.etaMinutes - 0.1),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Telematics Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-teal-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>KisanDirect IoT Telematics Fleet Radar</span>
            <span className="text-[10px] bg-teal-400/30 text-teal-200 px-1.5 py-0.5 rounded font-mono font-black">
              LIVE SENSORS
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Active Reefer Cold-Chain Corridors
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time multi-sensor telemetry tracking internal cargo temperature, relative humidity, and transit vibration across Maharashtra APMC highway corridors. Zero cold-chain spoilage guaranteed.
          </p>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Average Cargo Temp
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">3.8°C</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              In-Transit Freshness
            </span>
            <span className="text-xl font-black text-white font-mono">99.4%</span>
          </div>
        </div>
      </div>

      {/* Fleet Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleet.map((truck) => (
          <div
            key={truck.id}
            onClick={() => setSelectedTruckId(truck.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedTruckId === truck.id
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{truck.plateNumber}</span>
              </span>
              <span
                className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-full border ${
                  truck.status === 'OPTIMAL'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : truck.status === 'COOLING_BOOST'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                }`}
              >
                {truck.status === 'OPTIMAL' ? 'Optimal 4°C' : truck.status === 'COOLING_BOOST' ? 'Chilling' : 'Arriving'}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                {truck.crop}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                {truck.crates} Crates &bull; {truck.weightKg} kg
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-emerald-500" />
                <strong>{truck.tempCelsius}°C</strong>
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>ETA: {Math.round(truck.etaMinutes)}m</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Selected Vehicle Telemetry Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telematics HUD & Highway Route */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Active Truck Corridor Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">
                    Corridor Telematics
                  </span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded font-mono">
                    {selectedTruck.id}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedTruck.corridor}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTruck.origin} &rarr; {selectedTruck.destination}
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-4 py-2 rounded-2xl flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Cold-Chain SLA
                  </span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                    Compliant (&lt; 6.0°C)
                  </span>
                </div>
              </div>
            </div>

            {/* Live 4 Sensor Dials Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Dial 1: Temperature */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                <Thermometer className="w-5 h-5 text-emerald-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Cabin Temp
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {effectiveTemp}°C
                </div>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  Target: {selectedTruck.targetTemp}°C
                </span>
              </div>

              {/* Dial 2: Humidity */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                <Wind className="w-5 h-5 text-sky-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Relative Humidity
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedTruck.humidityPct}%
                </div>
                <span className="text-[9px] text-sky-600 dark:text-sky-400 font-bold font-mono">
                  Turgor Protected
                </span>
              </div>

              {/* Dial 3: Vibration Sensor */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                <Activity className="w-5 h-5 text-amber-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Road Shock
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedTruck.vibrationG} G
                </div>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  Smooth Highway
                </span>
              </div>

              {/* Dial 4: Speedometer */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                <Gauge className="w-5 h-5 text-violet-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Transit Speed
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {Math.round(selectedTruck.speedKmh)}
                </div>
                <span className="text-[9px] text-slate-400 font-mono">km/h</span>
              </div>
            </div>

            {/* Interactive Ambient Temperature Simulator */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Interactive Inverter Compressor Simulation
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {tempOffset === 0 ? 'Normal Transit' : tempOffset > 0 ? `+${tempOffset}°C External Heatwave` : `${tempOffset}°C Deep Freeze`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">-2°C</span>
                <input
                  type="range"
                  min="-2"
                  max="4"
                  step="0.5"
                  value={tempOffset}
                  onChange={(e) => setTempOffset(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">+4°C</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Slide to simulate highway heatwave conditions. The intelligent reefer compressor throttles automatically to preserve harvest shelf-life.
              </p>
            </div>

            {/* Simulated Live Route Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{selectedTruck.origin}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.round(selectedTruck.etaMinutes)} minutes to Destination
                </span>
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-sky-500" />
                  <span>{selectedTruck.destination}</span>
                </span>
              </div>

              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(15, 100 - (selectedTruck.etaMinutes / 160) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Driver Dispatch Card & Handover Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Driver &amp; Vehicle Dispatch Record
            </h4>

            {/* Driver Profile */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                {selectedTruck.driverName.split(' ')[0][0]}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {selectedTruck.driverName}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                  License: MH15 2018009214
                </span>
              </div>
              <a
                href={`tel:${selectedTruck.driverPhone}`}
                className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition shrink-0"
                title="Call Driver"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            {/* Cargo Manifest */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Consignment:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTruck.crop}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Gross Weight:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTruck.weightKg} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Crate Stack:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTruck.crates} Stacked Crates</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Battery Level:</span>
                <span className="text-emerald-600 font-bold">{selectedTruck.batteryPct}% Inverter Battery</span>
              </div>
            </div>

            {/* Delivery Handover Action Button */}
            <Link
              href="/logistics"
              className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Book Space in This Reefer Corridor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Guarantee Seal */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>₹10,00,000 Transit Transit Insurance</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every shipment is backed by ICICI Lombard transit insurance. If telematics record &gt; 8°C for over 45 minutes, full escrow reimbursement is triggered automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
