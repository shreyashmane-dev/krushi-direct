'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface WeatherData {
  district: string;
  districtKey: string;
  crops: string;
  temperature: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  advisory: string;
}

export default function WeatherWidget() {
  const { t, language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('pune');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const districts = [
    { key: 'pune', label: language === 'mr' ? 'पुणे' : 'Pune' },
    { key: 'nashik', label: language === 'mr' ? 'नाशिक' : 'Nashik' },
    { key: 'satara', label: language === 'mr' ? 'सातारा' : 'Satara' },
    { key: 'sangli', label: language === 'mr' ? 'सांगली' : 'Sangli' },
    { key: 'kolhapur', label: language === 'mr' ? 'कोल्हापूर' : 'Kolhapur' },
    { key: 'nagpur', label: language === 'mr' ? 'नागपूर' : 'Nagpur' },
  ];

  const fetchWeather = async (district: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?district=${district}`);
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
    fetchWeather(selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight">{t.weatherTitle}</h3>
            <span className="text-[11px] text-slate-400">Open-Meteo Agro Advisory</span>
          </div>
        </div>

        {/* District Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {districts.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDistrict(d.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedDistrict === d.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center text-xs text-slate-400 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading live agro forecast...</span>
        </div>
      ) : data ? (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Temp */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Temperature</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{data.temperature}°C</span>
                <span className="text-[10px] text-slate-400 font-mono">({data.tempMin}° / {data.tempMax}°)</span>
              </div>
            </div>

            {/* Rain Chance */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>Precipitation</span>
              </span>
              <span className="text-2xl font-black text-sky-400">{data.rainChance}%</span>
            </div>

            {/* Humidity */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-emerald-400" />
                <span>Humidity</span>
              </span>
              <span className="text-2xl font-black text-emerald-400">{data.humidity}%</span>
            </div>

            {/* Wind */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Wind className="w-3 h-3 text-slate-400" />
                <span>Wind Speed</span>
              </span>
              <span className="text-2xl font-black text-white">{data.windSpeed} km/h</span>
            </div>
          </div>

          {/* Advisory & Harvest Tip */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-200">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">Crop Advisory ({data.district}):</span>
              <p className="text-[11px] leading-relaxed text-emerald-100/90">{data.advisory}</p>
              <span className="text-[10px] text-emerald-400/80 block mt-1">Regional crops: {data.crops}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
