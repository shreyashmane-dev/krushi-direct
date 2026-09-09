'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  Star,
  MapPin,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
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
    loadOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Purchase History & Tracking</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your orders, track shipments in real-time, and download tax invoices.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading purchase history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Orders Placed</h3>
          <p className="text-xs text-slate-400">Browse the marketplace to order direct from farmers.</p>
          <Link href="/marketplace" className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs mt-2">
            Go to Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 hover:border-emerald-200 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    KD
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Order #{order.orderNumber}</h3>
                    <span className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      order.status === 'COMPLETED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items & details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">Ordered Items</h4>
                  <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-200/60">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900">{item.cropName}</span>
                          <span className="text-slate-500 block text-[11px]">
                            {item.quantity} {item.unit} @ ₹{item.unitPrice}/{item.unit}
                          </span>
                        </div>
                        <span className="font-extrabold text-emerald-700">{formatINR(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Farmer: <strong>{order.farmer?.name}</strong> • Destination: {order.shippingAddress}</span>
                  </div>
                </div>

                {/* Right side cost & actions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Total Paid</span>
                    <span className="text-xl font-black text-emerald-700">{formatINR(order.totalAmount)}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Includes 2% platform fee + express logistics
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/buyer/tracking/${order.id}`}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center block transition shadow-sm shadow-emerald-600/20"
                    >
                      Track Shipment Live
                    </Link>

                    <button
                      onClick={() => alert(`Downloading official KisanDirect Tax Invoice for #${order.orderNumber}`)}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-1.5 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1 text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Invoice (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
