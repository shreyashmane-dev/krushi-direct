'use client';

import React, { useEffect, useRef } from 'react';
import { Building2, MapPin } from 'lucide-react';

interface Center {
  name: string;
  city: string;
  capacityKg: number;
  availableCapacityKg: number;
  lat: number;
  lng: number;
  phone: string;
}

const HUBS: Center[] = [
  {
    name: 'Pune Central Agricultural Hub',
    city: 'Pune',
    capacityKg: 50000,
    availableCapacityKg: 34200,
    lat: 18.4985,
    lng: 73.8647,
    phone: '+91 20 2426 5500',
  },
  {
    name: 'Nashik Agro Cold Storage',
    city: 'Nashik',
    capacityKg: 80000,
    availableCapacityKg: 58000,
    lat: 19.9975,
    lng: 73.7898,
    phone: '+91 253 251 8890',
  },
  {
    name: 'Satara Farmers Logistics Terminal',
    city: 'Satara',
    capacityKg: 30000,
    availableCapacityKg: 21500,
    lat: 17.6805,
    lng: 74.0183,
    phone: '+91 2162 245 112',
  },
  {
    name: 'Kolhapur Agro Consolidation Center',
    city: 'Kolhapur',
    capacityKg: 40000,
    availableCapacityKg: 27800,
    lat: 16.705,
    lng: 74.2433,
    phone: '+91 231 260 3344',
  },
];

export default function CollectionCentersMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [18.5204, 73.8567], // Pune center
        zoom: 7,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Markers for each hub
      HUBS.forEach((hub) => {
        const icon = L.divIcon({
          className: 'custom-hub-pin',
          html: `
            <div style="background-color: #059669; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(5,150,105,0.4); border: 2px solid white;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker([hub.lat, hub.lng], { icon })
          .bindPopup(
            `<b>${hub.name}</b><br>City: ${hub.city}<br>Available Capacity: <b>${hub.availableCapacityKg.toLocaleString()} kg</b> / ${hub.capacityKg.toLocaleString()} kg<br>Contact: ${hub.phone}`
          )
          .addTo(map);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>OpenStreetMap Regional Agro-Collection Hubs</span>
          </h3>
          <p className="text-xs text-slate-500">
            Temperature-controlled aggregation hubs across Pune, Nashik, Satara, and Kolhapur.
          </p>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          OpenStreetMap Tile Engine
        </span>
      </div>

      <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
