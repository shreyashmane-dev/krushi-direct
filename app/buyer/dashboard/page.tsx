'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingDown,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HandCoins,
  Search,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuyerData() {
      try {
        const [ordersRes, bidsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/bids'),
        ]);

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(oData.orders || []);
        }
        if (bidsRes.ok) {
          const bData = await bidsRes.json();
          setBids(bData.bids || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadBuyerData();
  }, [user]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  // Estimated procurement savings vs typical retail retail markup
  const totalSavings = Math.round(totalSpent * 0.28);
  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Buyer Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
            alt="Rahul Sharma"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Welcome, {user?.name || 'Rahul Sharma (GreenBite Bistro)'}!
              </h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user?.role || 'Restaurant Buyer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct procurement active from Pune, Nashik, and Satara certified farmers.
            </p>
          </div>
        </div>

        <Link
          href="/marketplace"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 self-start"
        >
          <Search className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Procurement Savings
          </span>
          <span className="text-3xl font-black text-emerald-700 block">{formatINR(totalSavings)}</span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Saved ~28% vs traditional retail markets</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Active Shipments
          </span>
          <span className="text-3xl font-black text-blue-600 block">{activeOrders}</span>
          <span className="text-xs text-slate-400 block">En route or pending dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Negotiation Offers
          </span>
          <span className="text-3xl font-black text-amber-600 block">{bids.length}</span>
          <span className="text-xs text-slate-400 block">Active bids submitted to farmers</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">My Farmgate Purchases</h3>
            <p className="text-xs text-slate-500">Live order milestones, invoices, and delivery tracking.</p>
          </div>
          <Link href="/buyer/orders" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Purchases
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No purchases made yet.</div>
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
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Farmer: <strong>{order.farmer?.name}</strong> •{' '}
                    {order.items?.map((item: any) => `${item.quantity} ${item.unit} ${item.cropName}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Paid Amount</span>
                    <span className="text-base font-black text-emerald-700">{formatINR(order.totalAmount)}</span>
                  </div>

                  <Link
                    href={`/buyer/tracking/${order.id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
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
