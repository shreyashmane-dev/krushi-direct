'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Truck, CheckCircle2, Clock, Navigation, ShieldCheck, Phone } from 'lucide-react';

interface DeliveryMapProps {
  status: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  eta?: string | null;
  partnerName?: string;
  partnerPhone?: string;
  originCoords?: [number, number]; // [lat, lng]
  destCoords?: [number, number];   // [lat, lng]
}

const MILESTONES = [
  { key: 'ORDER_CONFIRMED', label: 'Confirmed', desc: 'Order placed & scheduled' },
  { key: 'PICKUP_ASSIGNED', label: 'Driver Assigned', desc: 'Refrigerated transit allocated' },
  { key: 'PICKED_UP', label: 'Picked Up', desc: 'Dispatched from farm' },
  { key: 'IN_TRANSIT', label: 'In Transit', desc: 'Agro-corridor highway transit' },
  { key: 'NEAR_DESTINATION', label: 'Out for Delivery', desc: 'Arrived at city terminal' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Inspected & handed over' },
];

export default function DeliveryMap({
  status = 'IN_TRANSIT',
  trackingNumber = 'TRK-KD-98231',
  origin = 'Manchar, Pune',
  destination = 'Koregaon Park, Pune',
  eta = '24-36 Hours (Express Agro-Transit)',
  partnerName = 'Vikram Shinde (KisanLogistics)',
  partnerPhone = '+91 99770 22334',
  originCoords = [19.0063, 73.9458], // Manchar, Pune
  destCoords = [18.5362, 73.894],   // Koregaon Park, Pune
}: DeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const currentIndex = MILESTONES.findIndex((m) => m.key === status);
  const activeStep = currentIndex >= 0 ? currentIndex : 3;

  useEffect(() => {
    let isMounted = true;

    async function initOpenStreetMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Import Leaflet dynamically to avoid SSR issues
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Cleanup existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Midpoint & Route interpolation
      const routePoints: [number, number][] = [
        originCoords,
        [18.8500, 73.8900], // Checkpoint 1 (Rajgurunagar)
        [18.7200, 73.8600], // Checkpoint 2 (Chakan Agro Hub)
        [18.6200, 73.8200], // Checkpoint 3 (Bhosari / Pimpri)
        destCoords,
      ];

      // Interpolate truck position based on activeStep (0 to 5)
      const progressFraction = activeStep / (MILESTONES.length - 1);
      const truckIndex = Math.min(
        routePoints.length - 1,
        Math.floor(progressFraction * (routePoints.length - 1))
      );
      const truckPos = routePoints[truckIndex];

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [18.75, 73.90],
        zoom: 10,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Origin Marker Icon
      const originIcon = L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="background-color: #059669; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(5,150,105,0.4); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      // Custom Destination Marker Icon
      const destIcon = L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(37,99,235,0.4); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      // Custom Truck Marker Icon
      const truckIcon = L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="background-color: #f59e0b; color: #020617; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(245,158,11,0.6); border: 2px solid white; animation: pulse 2s infinite;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      // Add Markers
      L.marker(originCoords, { icon: originIcon })
        .bindPopup(`<b>Farmgate Origin</b><br>${origin}`)
        .addTo(map);

      L.marker(destCoords, { icon: destIcon })
        .bindPopup(`<b>Buyer Destination</b><br>${destination}`)
        .addTo(map);

      L.marker(truckPos, { icon: truckIcon })
        .bindPopup(`<b>Live Status:</b> ${MILESTONES[activeStep]?.label}<br>Vehicle in transit`)
        .addTo(map);

      // Draw Route Polyline
      const polyline = L.polyline(routePoints, {
        color: '#059669',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);

      // Auto-fit bounds
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      setMapLoaded(true);
    }

    initOpenStreetMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [originCoords, destCoords, activeStep, origin, destination]);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
      {/* Route Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              OpenStreetMap Live GPS
            </span>
            <span className="text-xs text-slate-400 font-mono">#{trackingNumber}</span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{origin}</span>
            <Navigation className="w-4 h-4 text-emerald-400 rotate-90" />
            <span>{destination}</span>
          </h3>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-right">
          <span className="text-[11px] uppercase font-semibold text-slate-400 block">Estimated Arrival</span>
          <span className="text-sm font-black text-amber-400">{eta || 'On Schedule'}</span>
        </div>
      </div>

      {/* Real OpenStreetMap Map Container */}
      <div className="relative h-72 w-full bg-slate-100 border-y border-slate-200">
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* OSM Attribution / Watermark pill */}
        <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded shadow border border-slate-200">
          OpenStreetMap &bull; Leaflet Engine
        </div>
      </div>

      {/* Milestones Progress Timeline */}
      <div className="p-5 sm:p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Delivery Lifecycle Milestones
        </h4>

        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[500px]">
              {MILESTONES.map((m, idx) => {
                const isCompleted = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={m.key} className="flex-1 flex flex-col items-center text-center relative px-2">
                    {/* Connecting Bar */}
                    {idx < MILESTONES.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${
                          idx < activeStep ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      ></div>
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-md scale-110'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <span
                      className={`text-xs font-bold mt-2 block ${
                        isCurrent ? 'text-amber-600' : isCompleted ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    >
                      {m.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block max-w-[90px]">{m.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Driver / Partner Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              VS
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Assigned Delivery Partner</span>
              <p className="text-sm font-bold text-slate-900">{partnerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${partnerPhone}`}
              className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{partnerPhone}</span>
            </a>
            <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md font-semibold">
              Refrigerated 4°C Transit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
