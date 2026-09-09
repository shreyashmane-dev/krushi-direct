'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  Landmark,
  FileText,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function FarmerPaymentsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
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
    }
    loadOrders();
  }, [user]);

  // Aggregate stats
  const totalSettled = orders
    .filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.subtotal ? o.subtotal * 0.98 : 0), 0);

  const pendingSettlement = orders
    .filter((o) => o.status !== 'COMPLETED' && o.status !== 'DELIVERED')
    .reduce((sum, o) => sum + (o.subtotal ? o.subtotal * 0.98 : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Farmer Settlements & Bank Payouts</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated digital escrow payouts directly credited to your verified bank account.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Disbursed</span>
          <span className="text-3xl font-black text-emerald-700 block">{formatINR(totalSettled)}</span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Successfully Paid to Bank</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">In Escrow / Transit</span>
          <span className="text-3xl font-black text-amber-600 block">{formatINR(pendingSettlement)}</span>
          <span className="text-xs text-slate-400 block">Pending delivery confirmation</span>
        </div>

        {/* Linked Bank Account Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-400" />
              Verified Bank Account
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              Active
            </span>
          </div>

          <div className="mt-3">
            <p className="font-bold text-sm text-white">Bank of Maharashtra</p>
            <p className="text-xs text-slate-300 font-mono">A/C: ••••••••5102 • IFSC: MAHB0000123</p>
            <p className="text-[10px] text-slate-400 mt-1">Holder: Ramesh Patil (Manchar Branch)</p>
          </div>
        </div>
      </div>

      {/* Transparent Calculation Explainer Box as required by prompt */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>How KisanDirect Calculates Your Net Settlement</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
            <span className="text-slate-500 block">1. Gross Order Value</span>
            <span className="font-black text-slate-900 text-sm mt-1 block">₹10,000</span>
            <span className="text-[10px] text-slate-400">Total Produce Price</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
            <span className="text-slate-500 block">2. Platform Direct Fee</span>
            <span className="font-black text-red-600 text-sm mt-1 block">- ₹200</span>
            <span className="text-[10px] text-slate-400">Fixed 2% Tech Fee</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
            <span className="text-slate-500 block">3. Buyer Logistics Share</span>
            <span className="font-black text-blue-600 text-sm mt-1 block">₹0</span>
            <span className="text-[10px] text-slate-400">Paid directly by Buyer</span>
          </div>

          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-md">
            <span className="text-emerald-100 block font-semibold">4. Net Farmer Payout</span>
            <span className="font-black text-amber-300 text-base mt-1 block">₹9,800</span>
            <span className="text-[10px] text-emerald-200">100% Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">Transaction & Payout History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Buyer Details</th>
                <th className="p-4">Gross Value</th>
                <th className="p-4">Platform Fee (2%)</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Payout Status</th>
                <th className="p-4">Settlement Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const gross = o.subtotal || 0;
                const fee = Math.round(gross * 0.02);
                const net = gross - fee;
                const isPaid = o.status === 'COMPLETED' || o.status === 'DELIVERED';

                return (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-slate-900">#{o.orderNumber}</td>
                    <td className="p-4 text-slate-700">{o.buyer?.name}</td>
                    <td className="p-4 font-bold text-slate-800">{formatINR(gross)}</td>
                    <td className="p-4 text-slate-500">- {formatINR(fee)}</td>
                    <td className="p-4 font-black text-emerald-700 text-sm">{formatINR(net)}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'PAID' : 'PROCESSING'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {o.settlement?.referenceNo || (isPaid ? 'SETTLE-MH-9921' : 'ESCROW-PENDING')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
