'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Package,
  Truck,
  RotateCw,
  Phone,
  ChevronRight,
  Heart,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Leaf,
  Plus,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function ConsumerDashboardPage() {
  const { user } = useAuth();
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<'IN_TRANSIT' | 'DELIVERED'>('IN_TRANSIT');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Household essentials available for 1-click reorder
  const householdStaples = [
    {
      id: 'prod-tomato-01',
      name: 'Farmgate Grade-A Tomato',
      farmer: 'Ramesh Patil (Manchar)',
      price: 18,
      supermarketPrice: 32,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      isOrganic: true,
    },
    {
      id: 'prod-onion-02',
      name: 'Nashik Red Kitchen Onion',
      farmer: 'Suresh Jadhav (Lasalgaon)',
      price: 24,
      supermarketPrice: 38,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
      isOrganic: false,
    },
    {
      id: 'prod-potato-03',
      name: 'Satara Table Potato (Jyoti)',
      farmer: 'Anita Pawar (Koregaon)',
      price: 22,
      supermarketPrice: 35,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
      isOrganic: true,
    },
    {
      id: 'prod-mango-07',
      name: 'Naturally Ripened Alphonso',
      farmer: 'Ramesh Patil (Pune)',
      price: 140,
      supermarketPrice: 220,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
      isOrganic: true,
    },
  ];

  useEffect(() => {
    async function loadConsumerOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadConsumerOrders();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickReorder = (item: any) => {
    showToast(`Added 2 ${item.unit} ${item.name} directly to your next Tuesday morning farm box!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Household Consumer Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
            alt="Household Consumer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Namaste, {user?.name || 'Priya Deshmukh'}!
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Household
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Flat 402, Mayur Heights, Kothrud, Pune • Doorstep Delivery Active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/marketplace"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Farmgate Market</span>
          </Link>
        </div>
      </div>

      {/* Key Household Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Direct Sourcing Savings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Monthly Sourcing Savings</span>
          <span className="text-3xl font-black text-emerald-700 block">₹840.00</span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>~32% cheaper than Quick-Commerce/Supermarts</span>
          </span>
        </div>

        {/* Farm to Table Speed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Farm-to-Kitchen Speed</span>
          <span className="text-3xl font-black text-slate-900 block">&lt; 14 Hours</span>
          <span className="text-[11px] text-slate-500 font-medium">Harvested 6:00 AM • At Doorstep 4:30 PM</span>
        </div>

        {/* Chemical-Free Certification */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pesticide Residue Check</span>
          <span className="text-3xl font-black text-teal-700 flex items-center gap-1.5">
            <span>100% Passed</span>
            <FileCheck className="w-5 h-5 text-teal-600" />
          </span>
          <span className="text-[11px] text-teal-700 font-medium">NPOP Lab certified batch testing</span>
        </div>

        {/* Carbon Footprint */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Local Farm Proximity</span>
          <span className="text-3xl font-black text-slate-900 block">38 km</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero cold storage chemical ripening</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Subscription & Active Delivery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Farm-Fresh Box Subscription */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly Farm-Fresh Vegetable Box</h3>
                  <p className="text-xs text-slate-500">Curated seasonal harvest delivered every Tuesday & Friday</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubscriptionActive(!subscriptionActive);
                  showToast(subscriptionActive ? 'Subscription paused for next week.' : 'Subscription reactivated!');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  subscriptionActive
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {subscriptionActive ? 'Active • Auto-Renew' : 'Paused'}
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Next Scheduled Drop: <strong>Friday, 7:30 AM</strong></span>
                </span>
                <span className="text-emerald-700 font-bold">Standard Family Basket (7 kg)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Includes: 2kg Desi Tomatoes (Ramesh Patil), 2kg Nashik Onions (Suresh Jadhav), 1kg Satara Potatoes, 500g G4 Hot Chillies, Fresh Coriander & Spinach bunches.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 text-xs">
                <span className="text-slate-500">Box Total: <strong className="text-slate-900">₹240</strong> (Saves ₹110 vs Blinkit)</span>
                <button
                  onClick={() => showToast('Basket customization updated!')}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  Customize Items
                </button>
              </div>
            </div>
          </div>

          {/* Today's Active In-Transit Shipment */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Live Delivery Status</h3>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                deliveryStatus === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {deliveryStatus === 'IN_TRANSIT' ? '● Out for Delivery' : '✓ Delivered'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Order ID: #KD-CONS-4491</span>
                  <span className="text-sm font-black text-slate-900">Fresh Produce Morning Basket</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Delivery PIN</span>
                  <span className="text-sm font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">4892</span>
                </div>
              </div>

              {/* Transit Timeline */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Harvested at Ramesh Patil Farm, Manchar (06:30 AM)</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cold Transit Aggregation at Pune Central APMC (11:15 AM)</span>
                </div>
                <div className="flex items-center gap-2.5 text-amber-700 font-bold animate-pulse">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Driver Vikram Shinde is 12 mins away (Kothrud Depot)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100"
                    alt="Vikram"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Vikram Shinde (Driver)</p>
                    <p className="text-[10px] text-slate-500">Reefer Truck #MH-12-KL-9901</p>
                  </div>
                </div>
                {deliveryStatus === 'IN_TRANSIT' ? (
                  <button
                    onClick={() => {
                      setDeliveryStatus('DELIVERED');
                      showToast('Shipment marked as received! Quality feedback saved.');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    Confirm Drop-Off
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Delivery Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Household Re-orders & Lab Cert (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick 1-Click Household Fresh Restock */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Direct Restock Favorites</h3>
              <span className="text-[11px] text-emerald-700 font-semibold">Instant Farmgate</span>
            </div>
            <p className="text-xs text-slate-500">
              Direct farmgate produce harvested this morning. Add directly to your next doorstep delivery.
            </p>

            <div className="space-y-3">
              {householdStaples.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.farmer}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-emerald-700">₹{item.price}/{item.unit}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{item.supermarketPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickReorder(item)}
                    className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white p-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    title="Add to Next Delivery"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Organic Lab Guarantee Certificate */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Leaf className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Zero Chemical Guarantee</span>
            </div>
            <h4 className="font-bold text-sm">NPOP / APEDA Organic Certified</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Every crop lot listed on KisanDirect has been geo-verified at the farm gate with pesticide residue spectral screening.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Batch Cert: #MH-AGR-2026-904</span>
              <button
                onClick={() => showToast('Downloading Official Soil & Residue Lab Certificate PDF...')}
                className="text-emerald-400 hover:underline font-semibold"
              >
                View Lab Certificate →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
