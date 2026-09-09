'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?role=FARMER');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Farmer Orders & Logistics Dispatch</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming buyer orders, pack produce, and hand over to KisanLogistics partner.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Orders Received Yet</h3>
          <p className="text-xs text-slate-400">Buyer orders will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 hover:border-emerald-200 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    KD
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-sm">Order #{order.orderNumber}</span>
                    <span className="text-[11px] text-slate-400 block">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      order.status === 'COMPLETED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'PACKED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items Table / List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ordered Produce</h4>
                  <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-200/60 text-xs">
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

                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Buyer Destination: <strong>{order.shippingAddress}</strong></span>
                  </div>
                </div>

                {/* Settlement Calculation & Actions */}
                <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 space-y-3 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] mb-2">
                      Farmer Settlement Breakdown
                    </h4>
                    <div className="space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Produce Gross:</span>
                        <span className="font-semibold text-slate-800">{formatINR(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Platform Direct Fee (2%):</span>
                        <span>- {formatINR(order.platformFee || order.subtotal * 0.02)}</span>
                      </div>
                      <div className="border-t border-emerald-200 pt-1 flex justify-between font-black text-emerald-900 text-sm">
                        <span>Net Farmer Payout:</span>
                        <span>{formatINR(order.subtotal - (order.platformFee || order.subtotal * 0.02))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-emerald-200">
                    {order.status === 'PAYMENT_PENDING' && (
                      <button
                        onClick={() => updateStatus(order.id, 'CONFIRMED')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition"
                      >
                        Confirm & Accept Order
                      </button>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'PACKED')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                      >
                        Mark as Packed
                      </button>
                    )}

                    {order.status === 'PACKED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg transition"
                      >
                        Ready for Driver Pickup
                      </button>
                    )}

                    <Link
                      href={`/buyer/tracking/${order.id}`}
                      className="w-full text-center block bg-white hover:bg-slate-100 text-slate-700 font-semibold py-1.5 rounded-lg border border-slate-200 transition"
                    >
                      View Live Tracking
                    </Link>
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
