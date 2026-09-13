'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Satellite,
  Droplets,
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
  Plane,
  Eye,
  Calendar,
  Compass,
  Sprout,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface FarmPlot {
  id: string;
  surveyNumber: string;
  farmerName: string;
  location: string;
  crop: string;
  acreage: number;
  ndviScore: number;
  soilMoisture: number;
  soilTemp: number;
  npk: { n: number; p: number; k: number };
  irrigationStatus: 'ACTIVE_DRIP' | 'SCHEDULED_TONIGHT' | 'OPTIMAL';
  healthStatus: 'VIGOROUS' | 'MONITOR_MOISTURE' | 'EXCELLENT';
  satelliteImageUrl: string;
  thermalImageUrl: string;
}

const PLOTS: FarmPlot[] = [
  {
    id: 'PLOT-01',
    surveyNumber: '7/12 Gat #142/B',
    farmerName: 'Balasaheb Shinde',
    location: 'Dindori Cluster, Nashik',
    crop: 'Red Hybrid Tomatoes (Abhinav)',
    acreage: 4.5,
    ndviScore: 0.82,
    soilMoisture: 48,
    soilTemp: 24.2,
    npk: { n: 195, p: 44, k: 215 },
    irrigationStatus: 'OPTIMAL',
    healthStatus: 'EXCELLENT',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop',
    thermalImageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1000&auto=format&fit=crop',
  },
  {
    id: 'PLOT-02',
    surveyNumber: '7/12 Gat #88/A',
    farmerName: 'Rameshwar Patil',
    location: 'Lasalgaon Mandi Belt',
    crop: 'Nashik Red Onions (Garwa)',
    acreage: 7.2,
    ndviScore: 0.74,
    soilMoisture: 38,
    soilTemp: 26.8,
    npk: { n: 165, p: 38, k: 190 },
    irrigationStatus: 'SCHEDULED_TONIGHT',
    healthStatus: 'MONITOR_MOISTURE',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1000&auto=format&fit=crop',
    thermalImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop',
  },
  {
    id: 'PLOT-03',
    surveyNumber: '7/12 Gat #310/C',
    farmerName: 'Vikas Deshmukh',
    location: 'Tasgaon Grape Cluster, Sangli',
    crop: 'Thompson Seedless Table Grapes',
    acreage: 3.8,
    ndviScore: 0.88,
    soilMoisture: 52,
    soilTemp: 22.5,
    npk: { n: 210, p: 52, k: 240 },
    irrigationStatus: 'ACTIVE_DRIP',
    healthStatus: 'VIGOROUS',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop',
    thermalImageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1000&auto=format&fit=crop',
  },
];

export default function FieldSensorRadar() {
  const [plots] = useState<FarmPlot[]>(PLOTS);
  const [selectedPlotId, setSelectedPlotId] = useState<string>(PLOTS[0].id);
  const [viewMode, setViewMode] = useState<'ndvi' | 'drone'>('ndvi');

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  return (
    <div className="space-y-6">
      {/* Precision Agriculture Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sentinel-2 &amp; Landsat Satellite Agro-Telemetry</span>
            <span className="text-[10px] bg-emerald-400/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-black">
              10M RESOLUTION
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Satellite Soil &amp; NDVI Crop Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-spectral vegetation index (NDVI), root-zone soil moisture profiling, and nitrogen-phosphorus-potassium balance mapped directly to registered Government 7/12 land parcels.
          </p>
        </div>

        {/* Satellite Sync Status */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Orbital Pass
            </span>
            <span className="text-xl font-black text-white font-mono">Today 11:42</span>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-400/30 p-3.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block font-mono">
              Mean NDVI Health
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">0.81 (Peak)</span>
          </div>
        </div>
      </div>

      {/* Farm Plot Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plots.map((plot) => (
          <button
            key={plot.id}
            type="button"
            onClick={() => setSelectedPlotId(plot.id)}
            className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${
              selectedPlotId === plot.id
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                {plot.surveyNumber}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
                NDVI {plot.ndviScore}
              </span>
            </div>

            <div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                {plot.crop}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {plot.farmerName} &bull; {plot.acreage} Acres
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Satellite Visualizer HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Satellite Tile with NDVI & Thermal Overlays */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* View Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">
                  Field Geospatial Matrix
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedPlot.surveyNumber} &mdash; {selectedPlot.crop}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPlot.location} &bull; {selectedPlot.acreage} Cultivated Acres
                </p>
              </div>

              {/* View Mode Toggle Button */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('ndvi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'ndvi'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>Satellite NDVI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('drone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'drone'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Drone Thermal</span>
                </button>
              </div>
            </div>

            {/* Satellite Imagery Viewport with Overlay HUD */}
            <div className="relative rounded-3xl overflow-hidden h-80 sm:h-96 border border-slate-200 dark:border-slate-800 bg-slate-950">
              <img
                src={viewMode === 'ndvi' ? selectedPlot.satelliteImageUrl : selectedPlot.thermalImageUrl}
                alt="Satellite Farmland Scan"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  viewMode === 'ndvi'
                    ? 'contrast-125 saturate-150'
                    : 'filter hue-rotate-90 contrast-150 saturate-200'
                }`}
              />

              {/* Grid Crosshairs and Compass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 p-5 flex flex-col justify-between text-white pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs font-mono">
                    <span className="text-emerald-400 font-bold block">19°59&apos;38&quot; N, 73°47&apos;22&quot; E</span>
                    <span className="text-[10px] text-slate-300">Elevation: 584m ASL</span>
                  </div>

                  <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
                    <span>N 18° E</span>
                  </div>
                </div>

                {/* Bottom HUD Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold">
                      {viewMode === 'ndvi' ? 'Vegetative Index: NDVI 0.82 (High Photosynthetic Density)' : 'Thermal Crop Canopy: 23.8°C Transpiration'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    Zero Pest Stress Detected
                  </span>
                </div>
              </div>
            </div>

            {/* Telemetry Sensor Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Droplets className="w-5 h-5 text-sky-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Soil Moisture
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedPlot.soilMoisture}%
                </div>
                <span className="text-[9px] text-emerald-600 font-bold font-mono">
                  Field Capacity Optimal
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Thermometer className="w-5 h-5 text-amber-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Root-Zone Temp
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedPlot.soilTemp}°C
                </div>
                <span className="text-[9px] text-slate-500 font-mono">
                  Depth: 15 cm
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Zap className="w-5 h-5 text-emerald-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Nitrogen (N)
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedPlot.npk.n}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">kg / Hectare</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Activity className="w-5 h-5 text-violet-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Potassium (K)
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedPlot.npk.k}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">High Tuber Health</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Agronomy Soil Health Advice & Harvest Readiness */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Precision Agronomy AI Advisory
            </h4>

            {/* Irrigation Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/70 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  <span>Drip Irrigation Schedule</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                  {selectedPlot.irrigationStatus === 'OPTIMAL' ? 'Adequate' : 'Night Cycle'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
                Soil moisture at 48% is adequate. Maintain current night drip cycle for 45 minutes to avoid root hypoxia during fruiting.
              </p>
            </div>

            {/* Harvest Window Recommendation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Optimal Harvest Window</span>
              </span>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Next 3 to 5 Days (Morning 6:00 - 9:30 AM)
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Photosynthetic sucrose transfer is peaking. Harvesting early morning ensures firmest skin calyx and 8+ days shelf life.
              </p>
            </div>

            {/* Direct Auction Trigger */}
            <Link
              href="/auction"
              className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>List Harvest Lot on Bidding Floor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Legal 7/12 Compliance Seal */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mahabhumi 7/12 e-Record Synced</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
              Geofenced boundary verified against Maharashtra Land Records Portal. Zero disputed boundary risk for buyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
