'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmerData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders?role=FARMER'),
          fetch('/api/products?farmerId=user-farmer-ramesh'),
        ]);

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(oData.orders || []);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          setProducts(pData.products || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadFarmerData();
  }, [user]);

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PAYMENT_PENDING').length;
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
  const totalSales = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const estimatedEarnings = Math.round(totalSales * 0.98); // 98% after 2% platform fee
  const availableProduceKg = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const currentMarketValue = products.reduce((sum, p) => sum + p.quantity * p.pricePerKg, 0);

  // Quick order advancement
  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
      }
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Welcome & Verification Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200"
            alt="Ramesh Patil"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Namaste, {user?.name || 'Ramesh Patil'}!
              </h1>
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Farmer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Manchar-Narayangaon Agro Belt, Pune District • 8.5 Acres</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/farmer/produce/new"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Sprout className="w-4 h-4" />
            <span>+ List New Harvest</span>
          </Link>
          <Link
            href="/farmer/insights"
            className="bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-500/40 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>AI Price Intelligence</span>
          </Link>
        </div>
      </div>

      {/* 7 Dashboard Metrics Cards as required by prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Sales</span>
          <span className="text-2xl font-black text-slate-900 block">{formatINR(totalSales)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Direct Farmgate Realization</span>
          </span>
        </div>

        {/* Estimated Earnings */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estimated Earnings</span>
          <span className="text-2xl font-black text-emerald-700 block">{formatINR(estimatedEarnings)}</span>
          <span className="text-[11px] text-slate-400 block">After 2% Platform Direct Fee</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Orders</span>
          <span className="text-2xl font-black text-amber-600 block">{pendingOrders}</span>
          <span className="text-[11px] text-slate-400 block">Ready for Packing / Dispatch</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
          <span className="text-2xl font-black text-slate-900 block">{totalOrders}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{completedOrders} Completed</span>
        </div>

        {/* Available Produce */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Available Produce</span>
          <span className="text-2xl font-black text-slate-900 block">{availableProduceKg} kg</span>
          <span className="text-[11px] text-slate-400 block">{products.length} Active Listings</span>
        </div>

        {/* Current Market Value */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Inventory Value</span>
          <span className="text-2xl font-black text-slate-900 block">{formatINR(currentMarketValue)}</span>
          <span className="text-[11px] text-slate-400 block">At Current Listing Prices</span>
        </div>

        {/* Price Recommendation Card */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Price Recommendation</span>
            </div>
            <p className="text-sm font-bold text-white">Tomato: ₹18 – ₹21/kg</p>
            <p className="text-[11px] text-slate-300 mt-0.5">High demand surge (+14%) in Pune restaurants</p>
          </div>
          <Link
            href="/farmer/insights"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
          >
            View Trends
          </Link>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <Link href="/farmer/dashboard" className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-xl">
          Overview
        </Link>
        <Link href="/farmer/produce" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
          My Produce ({products.length})
        </Link>
        <Link href="/farmer/orders" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
          Orders ({orders.length})
        </Link>
        <Link href="/farmer/bids" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
          Buyer Offers & Bids
        </Link>
        <Link href="/farmer/payments" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
          Settlement Payouts
        </Link>
        <Link href="/farmer/insights" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
          AI Price & Demand
        </Link>
      </div>

      {/* Incoming / Recent Orders Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Farmer Orders</h3>
            <p className="text-xs text-slate-500">Manage packing, confirm payments, and dispatch for logistics pickup.</p>
          </div>
          <Link href="/farmer/orders" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Orders
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No orders placed yet.</div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">#{order.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'COMPLETED' || order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Buyer: <strong>{order.buyer?.name}</strong> •{' '}
                    {order.items?.map((item: any) => `${item.quantity} ${item.unit} ${item.cropName}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Delivery Address: {order.shippingAddress}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Gross Order Value</span>
                    <span className="text-base font-black text-emerald-700">{formatINR(order.subtotal)}</span>
                  </div>

                  {/* 1-Click Status Advancement */}
                  {order.status === 'PAYMENT_PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                    >
                      Confirm Order
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PACKED')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                    >
                      Mark as Packed
                    </button>
                  )}

                  {order.status === 'PACKED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                    >
                      Ready for Pickup
                    </button>
                  )}

                  <Link
                    href={`/buyer/tracking/${order.id}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                  >
                    Track Delivery
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
