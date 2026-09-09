'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Phone,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import DeliveryMap from '@/components/delivery-map';
import { formatINR } from '@/lib/utils';

export default function DeliveryTrackingPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  // Demo shortcut: Advance delivery milestone
  const advanceMilestone = async () => {
    if (!order) return;
    const flow = [
      'ORDER_CONFIRMED',
      'PICKUP_ASSIGNED',
      'PICKED_UP',
      'IN_TRANSIT',
      'NEAR_DESTINATION',
      'DELIVERED',
    ];
    const currentIdx = flow.indexOf(order.deliveryStatus || 'ORDER_CONFIRMED');
    const nextStatus = flow[Math.min(flow.length - 1, currentIdx + 1)];

    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryStatus: nextStatus,
          status: nextStatus === 'DELIVERED' ? 'DELIVERED' : order.status,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        if (nextStatus === 'DELIVERED') {
          setReviewOpen(true);
        }
      }
    } catch {
      alert('Error advancing status');
    }
  };

  // Submit verified review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setTimeout(() => {
          setReviewOpen(false);
        }, 1500);
      }
    } catch {
      alert('Error submitting review');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading delivery telemetry...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <h3 className="text-xl font-bold">Order Tracking Not Found</h3>
        <Link href="/buyer/orders" className="text-emerald-700 font-bold hover:underline text-xs">
          Return to Purchases
        </Link>
      </div>
    );
  }

  const isDelivered = order.deliveryStatus === 'DELIVERED' || order.status === 'DELIVERED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/buyer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Purchases</span>
        </Link>

        {/* SIH Demo Testing Button to advance shipment */}
        <button
          onClick={advanceMilestone}
          disabled={isDelivered}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{isDelivered ? 'Shipment Fully Delivered' : 'Simulate Next Milestone →'}</span>
        </button>
      </div>

      {/* Main Delivery Visual Map Component */}
      <DeliveryMap
        status={order.deliveryStatus || 'IN_TRANSIT'}
        trackingNumber={order.delivery?.trackingNumber || `TRK-KD-${order.orderNumber}`}
        origin={order.delivery?.pickupLocation || order.farmer?.farmerProfile?.farmLocation || 'Manchar, Pune'}
        destination={order.shippingAddress || 'Koregaon Park, Pune'}
        eta={order.delivery?.eta || (isDelivered ? 'Delivered' : '24-36 Hours (Express Agro-Transit)')}
        partnerName="Vikram Shinde (KisanLogistics)"
        partnerPhone="+91 99770 22334"
      />

      {/* Post-Delivery Review Banner if delivered */}
      {isDelivered && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Order Delivered & Inspected</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Your produce has been delivered in refrigerated transit. Please rate the farmer to release peer feedback.
            </p>
          </div>

          <button
            onClick={() => setReviewOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 shadow"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Submit Farmer Review</span>
          </button>
        </div>
      )}

      {/* Order Item Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900">Consignment Manifest</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {order.items?.map((item: any) => (
            <div key={item.id} className="py-2.5 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">{item.cropName}</span>
                <span className="text-slate-500 block text-[11px]">
                  Quantity: {item.quantity} {item.unit} • Farmgate Rate: ₹{item.unitPrice}/{item.unit}
                </span>
              </div>
              <span className="font-black text-emerald-700 text-sm">{formatINR(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Review Dialog */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Rate Farmer: {order.farmer?.name}</h3>
                <p className="text-xs text-slate-500">Verified post-delivery feedback for Order #{order.orderNumber}</p>
              </div>
              <button onClick={() => setReviewOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Review Published!</h4>
                <p className="text-xs text-slate-500">
                  Thank you for helping maintain high quality and trust on the KisanDirect marketplace.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Produce Quality & Delivery Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Review & Feedback</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="e.g. Excellent firmness and uniform Grade-A color, zero transit damage..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
