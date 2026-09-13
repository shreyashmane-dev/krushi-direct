'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Satellite, Sprout } from 'lucide-react';
import FieldSensorRadar from '@/components/satellite/field-sensor-radar';

export default function FieldSensorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite Field &amp; Soil Radar</span>
          </span>
        </div>

        <Link
          href="/farmer/produce/new"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
        >
          <Sprout className="w-4 h-4" />
          <span>Add Registered 7/12 Land Plot</span>
        </Link>
      </div>

      {/* Main Satellite Sensor Radar */}
      <FieldSensorRadar />
    </div>
  );
}
