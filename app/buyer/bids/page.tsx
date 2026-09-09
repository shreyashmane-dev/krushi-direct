'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HandCoins,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function BuyerBidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBids() {
      try {
        const res = await fetch('/api/bids');
        if (res.ok) {
          const data = await res.json();
          setBids(data.bids || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadBids();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Bulk Purchase Offers & Bids</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track negotiations and counter-offers with Maharashtra verified farmers.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading your offers...</div>
      ) : bids.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
          <HandCoins className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Active Offers</h3>
          <p className="text-xs text-slate-400">You haven&apos;t submitted any bulk offers to farmers yet.</p>
          <Link href="/marketplace" className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs mt-2">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-emerald-200 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{bid.product?.cropName}</h4>
                  <span className="text-xs text-slate-500">
                    Farmer: <strong>{bid.product?.farmer?.user?.name || 'Local Farmer'}</strong>
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    bid.status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bid.status === 'COUNTERED'
                      ? 'bg-amber-100 text-amber-800'
                      : bid.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {bid.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Offered Price:</span>
                  <span className="font-bold text-slate-900">₹{bid.offeredPrice}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Quantity:</span>
                  <span className="font-bold text-slate-900">{bid.quantity} kg</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-black text-slate-950">
                  <span>Total Offer Value:</span>
                  <span className="text-emerald-700">{formatINR(bid.offeredPrice * bid.quantity)}</span>
                </div>

                {bid.status === 'COUNTERED' && (
                  <div className="bg-amber-100 p-2.5 rounded-lg text-amber-950 font-bold flex justify-between items-center mt-2">
                    <span>Farmer Counter-Offer:</span>
                    <span className="text-sm text-emerald-800">₹{bid.counterPrice}/kg</span>
                  </div>
                )}
              </div>

              {bid.status === 'ACCEPTED' && (
                <Link
                  href={`/products/${bid.productId}?buy=true`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center block text-xs transition"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
