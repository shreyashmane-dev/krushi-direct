'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin,
  Star,
  ShieldCheck,
  Leaf,
  Calendar,
  Truck,
  Sparkles,
  ShoppingBag,
  HandCoins,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import PriceJourney from '@/components/price-journey';
import RazorpayCheckoutModal from '@/components/razorpay-checkout-modal';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [shippingAddress, setShippingAddress] = useState('Lane 6, Koregaon Park, Shivajinagar, Pune - 411001');
  const [contactPhone, setContactPhone] = useState('+91 98900 88776');

  // Checkout modal
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  // Bidding modal
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidQuantity, setBidQuantity] = useState<number>(100);
  const [bidMessage, setBidMessage] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setSelectedImage(data.product.images?.[0]?.url || '');
          setOrderQuantity(Math.max(data.product.minOrderQty || 10, 100));
          setBidPrice(data.product.pricePerKg);
          setBidQuantity(Math.max(data.product.minOrderQty || 10, 100));

          if (searchParams.get('action') === 'buy') {
            // Can auto-scroll or focus
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading produce details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Produce Listing Not Found</h2>
        <Link href="/marketplace" className="text-emerald-700 font-bold hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Cost calculations
  const subtotal = Math.round(orderQuantity * product.pricePerKg);
  const platformFee = Math.round(subtotal * 0.02);
  const deliveryFee = 150;
  const totalAmount = subtotal + platformFee + deliveryFee;

  // Handle Create Order & Open Checkout
  const handleInitiateOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: orderQuantity,
          shippingAddress,
          contactPhone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveOrder(data.order);
        setCheckoutOpen(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to initiate order');
      }
    } catch {
      alert('Network error initiating order');
    }
  };

  // Handle Submit Bid
  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          offeredPrice: bidPrice,
          quantity: bidQuantity,
          message: bidMessage,
        }),
      });

      if (res.ok) {
        setBidSubmitted(true);
        setTimeout(() => {
          setBidModalOpen(false);
          setBidSubmitted(false);
        }, 2000);
      }
    } catch {
      alert('Error submitting bid');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/marketplace" className="hover:text-emerald-700">Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800">{product.cropName}</span>
      </nav>

      {/* Main Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={selectedImage}
              alt={product.cropName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow">
              Grade {product.grade?.replace('_', '+')}
            </div>
            {product.isOrganic && (
              <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>Certified Organic</span>
              </div>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img.url ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img.url} alt="Crop" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Farmer Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={product.farmer?.user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
                alt="Farmer"
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900">{product.farmer?.user?.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">{product.farmer?.farmLocation || product.farmLocation}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.farmer?.rating || 4.9} Rating • Verified Producer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Ordering & Bidding */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {product.category?.name || 'Fresh Vegetable'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">{product.cropName}</h1>
            <p className="text-xs sm:text-sm text-slate-600">{product.variety}</p>
          </div>

          {/* Farmgate Price Banner */}
          <div className="bg-emerald-50/80 border-2 border-emerald-500/30 rounded-2xl p-5 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">Direct Farmgate Price</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-700">₹{product.pricePerKg}</span>
                <span className="text-sm font-semibold text-slate-600">/{product.unit}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">Available Quantity</span>
              <span className="text-lg font-black text-slate-800">{product.quantity} {product.unit}</span>
              <span className="text-[11px] text-slate-500 block">Min. Order: {product.minOrderQty} {product.unit}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Harvest & Freshness Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Harvest Date</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Today'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Freshness</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{product.expiryDays || 7} Days Shelf Life</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit Logistics</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">Direct GPS Cold-Van</span>
            </div>
          </div>

          {/* Quantity Selector & Order Breakdown Box */}
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Order Quantity ({product.unit})
              </label>
              <span className="text-xs text-slate-500">
                Max Available: <strong>{product.quantity} {product.unit}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={product.minOrderQty || 10}
                max={product.quantity}
                step={10}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.min(product.quantity, Math.max(1, Number(e.target.value))))}
                className="w-32 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 text-center focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-2">
                {[50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setOrderQuantity(Math.min(product.quantity, preset))}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                  >
                    {preset}kg
                  </button>
                ))}
              </div>
            </div>

            {/* Price calculation details */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Produce Subtotal ({orderQuantity} {product.unit} × ₹{product.pricePerKg})</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Platform Fee (2%)</span>
                <span className="font-semibold text-slate-900">{formatINR(platformFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Agro-Logistics Delivery Fee</span>
                <span className="font-semibold text-slate-900">{formatINR(deliveryFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-black text-slate-950">
                <span>Estimated Total (Test Escrow)</span>
                <span className="text-emerald-700">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Action Buttons: Direct Buy or Make Offer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleInitiateOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now ({formatINR(totalAmount)})</span>
              </button>

              <button
                type="button"
                onClick={() => setBidModalOpen(true)}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <HandCoins className="w-4 h-4 text-amber-700" />
                <span>Make a Bulk Offer / Bid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specific Price Journey */}
      <div className="pt-6">
        <PriceJourney
          farmerPrice={product.pricePerKg}
          cropName={product.cropName}
          unit={product.unit}
        />
      </div>

      {/* Razorpay Test Checkout Modal */}
      {activeOrder && (
        <RazorpayCheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          orderId={activeOrder.id}
          orderNumber={activeOrder.orderNumber}
          amount={activeOrder.totalAmount}
          onPaymentSuccess={(data) => {
            setCheckoutOpen(false);
            router.push(`/buyer/tracking/${activeOrder.id}?payment=success`);
          }}
        />
      )}

      {/* Buyer Bidding Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Submit Bulk Purchase Offer</h3>
                <p className="text-xs text-slate-500">Negotiate direct pricing for {product.cropName}</p>
              </div>
              <button
                onClick={() => setBidModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {bidSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Offer Submitted to Farmer!</h4>
                <p className="text-xs text-slate-500">
                  {product.farmer?.user?.name} has received an in-app notification and can accept or counter your offer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Offered Price per {product.unit} (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Current listed price: ₹{product.pricePerKg}</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Desired Quantity ({product.unit})</label>
                  <input
                    type="number"
                    value={bidQuantity}
                    onChange={(e) => setBidQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message to Farmer (Optional)</label>
                  <textarea
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    rows={3}
                    placeholder="e.g. Weekly restaurant delivery, can pick up from local collection center..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  ></textarea>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-slate-600 flex justify-between font-bold">
                  <span>Total Proposed Value:</span>
                  <span className="text-emerald-700 text-sm">{formatINR(bidPrice * bidQuantity)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  Send Offer to Farmer
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
