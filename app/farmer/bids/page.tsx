'use client';

import React, { useState, useEffect } from 'react';
import {
  HandCoins,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  User,
  Clock,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function FarmerBidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Counter offer modal
  const [activeBid, setActiveBid] = useState<any>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bids?role=FARMER');
      if (res.ok) {
        const data = await res.json();
        setBids(data.bids || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleUpdateBid = async (bidId: string, status: string, counter?: number) => {
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...(counter && { counterPrice: counter }),
        }),
      });

      if (res.ok) {
        setBids((prev) =>
          prev.map((b) => (b.id === bidId ? { ...b, status, counterPrice: counter || b.counterPrice } : b))
        );
        setActiveBid(null);
      }
    } catch {
      alert('Error updating offer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Buyer Bulk Offers & Bids</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review commercial purchase offers submitted by hotels, restaurants, and wholesale processors.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading incoming bids...</div>
      ) : bids.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
          <HandCoins className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Bids Pending</h3>
          <p className="text-xs text-slate-400">Buyer negotiation offers will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bids.map((bid) => {
            const originalPrice = bid.product?.pricePerKg || 20;
            const diff = Math.round((bid.offeredPrice - originalPrice) * 10) / 10;

            return (
              <div
                key={bid.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-emerald-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={bid.buyer?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'}
                      alt={bid.buyer?.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{bid.buyer?.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Role: {bid.buyer?.role}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      bid.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : bid.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : bid.status === 'COUNTERED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>

                {/* Offer Details */}
                <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Target Crop:</span>
                    <span className="text-slate-900 font-bold">{bid.product?.cropName} ({bid.product?.variety})</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Offered Price:</span>
                    <span className="text-emerald-700 font-black text-sm">
                      ₹{bid.offeredPrice}/kg{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        ({diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`} vs list price)
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Requested Volume:</span>
                    <span className="text-slate-800 font-bold">{bid.quantity} kg</span>
                  </div>

                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-slate-950">
                    <span>Total Proposed Value:</span>
                    <span className="text-emerald-700 text-sm">{formatINR(bid.offeredPrice * bid.quantity)}</span>
                  </div>

                  {bid.counterPrice && (
                    <div className="bg-amber-100/70 p-2 rounded-lg text-amber-900 font-bold flex justify-between">
                      <span>Your Counter Offer:</span>
                      <span>₹{bid.counterPrice}/kg</span>
                    </div>
                  )}
                </div>

                {bid.message && (
                  <div className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="italic">{bid.message}</p>
                  </div>
                )}

                {/* Action Buttons for PENDING */}
                {bid.status === 'PENDING' && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleUpdateBid(bid.id, 'ACCEPTED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveBid(bid);
                        setCounterPrice(bid.offeredPrice + 1.5);
                      }}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Counter</span>
                    </button>

                    <button
                      onClick={() => handleUpdateBid(bid.id, 'REJECTED')}
                      className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Counter Offer Modal */}
      {activeBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Send Counter-Offer</h3>
            <p className="text-xs text-slate-500">
              Buyer {activeBid.buyer?.name} offered ₹{activeBid.offeredPrice}/kg. Propose your counter price:
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Counter Price (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-black text-emerald-700"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveBid(null)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateBid(activeBid.id, 'COUNTERED', counterPrice)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
