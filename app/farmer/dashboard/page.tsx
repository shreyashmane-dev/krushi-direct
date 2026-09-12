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
  PlusCircle,
  Truck,
  Leaf,
  RefreshCw,
  QrCode,
  ArrowRight,
  Send,
  Building2,
  Check,
  X,
  CreditCard,
  Wallet,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';
import confetti from 'canvas-confetti';
import { sendPwaNotification } from '@/lib/pwa-notifications';

interface DemoBid {
  id: string;
  cropName: string;
  buyerName: string;
  buyerType: string;
  quantity: number;
  offeredPrice: number;
  listedPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  timestamp: string;
}

const INITIAL_FARMER_BIDS: DemoBid[] = [
  {
    id: 'bid-101',
    cropName: 'Grade-A Tomato',
    buyerName: 'GreenBite Bistro (Pune)',
    buyerType: 'Restaurant Kitchen',
    quantity: 400,
    offeredPrice: 19.5,
    listedPrice: 18.0,
    status: 'PENDING',
    timestamp: '14 mins ago',
  },
  {
    id: 'bid-102',
    cropName: 'Nashik Red Onion',
    buyerName: 'FreshMart Supermarkets',
    buyerType: 'Retail Mart (Vashi)',
    quantity: 1000,
    offeredPrice: 24.5,
    listedPrice: 24.0,
    status: 'PENDING',
    timestamp: '32 mins ago',
  },
  {
    id: 'bid-103',
    cropName: 'Alphonso Mango (Hapus)',
    buyerName: 'Sahyadri Agro Processors',
    buyerType: 'Export Processor',
    quantity: 300,
    offeredPrice: 145.0,
    listedPrice: 140.0,
    status: 'PENDING',
    timestamp: '1 hour ago',
  },
];

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bids, setBids] = useState<DemoBid[]>(INITIAL_FARMER_BIDS);
  const [loading, setLoading] = useState(true);

  // Escrow Wallet State
  const [escrowPending, setEscrowPending] = useState(36800);
  const [escrowAvailable, setEscrowAvailable] = useState(124500);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    async function loadFarmerData() {
      setLoading(true);
      try {
        const farmerId = user?.farmerProfile?.id || user?.id;
        const productsUrl = farmerId ? `/api/products?farmerId=${farmerId}` : '/api/products';
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders?role=FARMER'),
          fetch(productsUrl),
        ]);

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(oData.orders || []);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          if (pData.products && pData.products.length > 0) {
            setProducts(pData.products);
          } else {
            const allP = await fetch('/api/products');
            if (allP.ok) {
              const allJson = await allP.json();
              setProducts(allJson.products || []);
            }
          }
        }
      } catch (err) {
        console.warn('Error loading farmer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmerData();
  }, [user]);

  // Handle Bid Accept
  const handleAcceptBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'ACCEPTED' } : b))
    );
    const acceptedBid = bids.find((b) => b.id === bidId);
    if (acceptedBid) {
      const addedValue = acceptedBid.offeredPrice * acceptedBid.quantity;
      setEscrowPending((prev) => prev + addedValue);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      sendPwaNotification({
        title: `🤝 Bid Accepted for ${acceptedBid.cropName}!`,
        body: `${acceptedBid.buyerName}'s bid of ₹${acceptedBid.offeredPrice}/kg was confirmed. ₹${addedValue.toLocaleString()} locked into Escrow.`,
        url: '/farmer/payments',
      });
    }
  };

  const handleDeclineBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'REJECTED' } : b))
    );
  };

  // Handle Instant Bank Withdrawal
  const handleWithdrawal = () => {
    if (escrowAvailable <= 0 || withdrawing) return;
    setWithdrawing(true);
    setTimeout(() => {
      const amountWithdrawn = escrowAvailable;
      setEscrowAvailable(0);
      setWithdrawing(false);
      setWithdrawSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      sendPwaNotification({
        title: '⚡ Instant Bank Transfer Successful!',
        body: `₹${amountWithdrawn.toLocaleString()} credited to SBI A/C ending in 4109 via IMPS. Reference #IMPS992481.`,
        url: '/farmer/dashboard',
      });
      setTimeout(() => setWithdrawSuccess(false), 5000);
    }, 1500);
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0) + 142000;
  const availableProduceKg = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Specialized Farmer Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
            alt="Farmer Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                Namaste, {user?.name || 'Ramesh Patil'}!
              </h1>
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Farmer &bull; 7/12 Land Synced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {user?.farmerProfile?.farmLocation || 'Manchar-Narayangaon Belt, Pune District • 8.5 Acres'}
              </span>
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            href="/farmer/produce/new"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ List New Harvest</span>
          </Link>

          <Link
            href="/crop-lens"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Scan Crop Disease</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Operational Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider font-mono text-[11px]">Realized Farmgate Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
            {formatINR(totalSales)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block">
            +44% higher than APMC Middleman Net
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider font-mono text-[11px]">Harvest In Inventory</span>
            <Sprout className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
            {availableProduceKg.toLocaleString()} kg
          </span>
          <span className="text-[10px] text-slate-400 block">
            Across {products.length} listed crop varieties
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider font-mono text-[11px]">Active Bids Received</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block font-mono">
            {bids.filter((b) => b.status === 'PENDING').length} Pending
          </span>
          <span className="text-[10px] text-slate-400 block">From verified hotels &amp; marts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider font-mono text-[11px]">Cold Corridor Pooling</span>
            <Truck className="w-4 h-4 text-teal-500" />
          </div>
          <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block font-mono">
            6 Corridors
          </span>
          <span className="text-[10px] text-teal-600 font-bold block">
            Saving 58% on transport freight
          </span>
        </div>
      </div>

      {/* 3. Specialized Farmer Section A: Received Bids Inbox (Interactive) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Commercial Procurement Bids Inbox</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Direct Buyer Bids On Your Harvest
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hotels, culinary kitchens, and supermarkets compete with transparent bids. Accept to instantly lock buyers’ funds into Digital Escrow.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-xl self-start sm:self-auto">
            ⚡ 0% Middleman Auction Cuts
          </span>
        </div>

        {/* Bids List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bids.map((b) => {
            const isPending = b.status === 'PENDING';
            const isAccepted = b.status === 'ACCEPTED';
            const totalValue = b.offeredPrice * b.quantity;
            const diff = b.offeredPrice - b.listedPrice;

            return (
              <div
                key={b.id}
                className={`rounded-2xl p-5 border transition flex flex-col justify-between space-y-4 ${
                  isAccepted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : b.status === 'REJECTED'
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {b.cropName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{b.timestamp}</span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>{b.buyerName}</strong> &bull; <span className="text-slate-400">{b.buyerType}</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-800 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Requested Volume:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{b.quantity} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Offered Price:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                        ₹{b.offeredPrice.toFixed(2)}/kg
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Escrow Value:</span>
                      <strong className="text-slate-900 dark:text-white">{formatINR(totalValue)}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-600 pt-0.5">
                      {diff >= 0 ? `+₹${diff.toFixed(2)}/kg over your listed rate!` : 'Near your asking price'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAcceptBid(b.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Bid</span>
                      </button>
                      <button
                        onClick={() => handleDeclineBid(b.id)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Accepted &bull; Locked in Escrow</span>
                    </div>
                  )}

                  {b.status === 'REJECTED' && (
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-center text-xs font-medium">
                      Declined
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Specialized Farmer Section B: Digital Escrow Wallet & Instant Bank Payout Terminal */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  RBI Regulated Escrow
                </span>
                <span className="text-xs text-slate-400">&bull; SLA: &lt; 2 Hours</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Farmer Digital Escrow &amp; Direct Bank Wallet
              </h2>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Registered Bank Account</span>
            <strong className="text-emerald-400 font-mono">State Bank of India (A/C: ****4109)</strong>
          </div>
        </div>

        {/* Balances & Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1">
            <span className="text-slate-400 text-xs font-mono uppercase block">Locked In Transit Escrow</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
              {formatINR(escrowPending)}
            </span>
            <span className="text-[10px] text-slate-400">
              Releases immediately upon buyer OTP delivery scan
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1">
            <span className="text-emerald-300 text-xs font-mono uppercase font-bold block">Available For Bank Payout</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
              {formatINR(escrowAvailable)}
            </span>
            <span className="text-[10px] text-emerald-200/80">
              Zero commission deductions &bull; 100% net realization
            </span>
          </div>

          <div className="flex flex-col justify-center space-y-2">
            <button
              onClick={handleWithdrawal}
              disabled={escrowAvailable <= 0 || withdrawing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              {withdrawing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Instant IMPS...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Withdraw {formatINR(escrowAvailable)} to SBI Now</span>
                </>
              )}
            </button>

            {withdrawSuccess && (
              <div className="p-2.5 bg-emerald-900/80 border border-emerald-400 rounded-xl text-center text-xs font-bold text-emerald-200 animate-in fade-in">
                ✓ Deposited to Bank! IMPS Ref #992481 verified.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Active Harvest Listings from Database */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
              Live Database Catalog
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              My Active Farmgate Harvest Lots
            </h2>
          </div>

          <Link
            href="/farmer/produce/new"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>+ Add Another Crop Lot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                    alt={p.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono">
                    Grade {p.grade}
                  </div>
                  {p.isOrganic && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Organic
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {p.cropName}
                    </h3>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-base">
                      ₹{p.pricePerKg}/{p.unit || 'kg'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{p.variety}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 font-mono">
                    <span>Available:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {p.quantity} {p.unit || 'kg'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/products/${p.id}`}
                  className="w-full text-center bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold py-2 rounded-xl text-xs transition block border border-slate-200 dark:border-slate-600"
                >
                  View Public Listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
