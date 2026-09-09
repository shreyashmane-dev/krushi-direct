'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { DEMO_ACCOUNTS, getRoleDashboardUrl } from '@/lib/auth/demo-users';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Leaf,
  Scale,
  Utensils,
  Store,
  Factory,
  ChevronRight,
  Eye,
  LayoutDashboard,
  PlusCircle,
  Clock,
  IndianRupee,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

const INITIAL_FEATURED_PRODUCTS = [
  {
    id: 'prod-tomato-01',
    cropName: 'Grade-A Tomato',
    variety: 'Abhinav Hybrid (Cooking & Salads)',
    pricePerKg: 18,
    quantity: 500,
    unit: 'kg',
    grade: 'A',
    isOrganic: true,
    farmLocation: 'Manchar, Pune',
    farmer: { user: { name: 'Ramesh Patil' }, rating: 4.9 },
    images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' }],
  },
  {
    id: 'prod-onion-02',
    cropName: 'Nashik Red Onion',
    variety: 'Garwa Lasalgaon Red (Cured)',
    pricePerKg: 24,
    quantity: 1200,
    unit: 'kg',
    grade: 'A',
    isOrganic: false,
    farmLocation: 'Lasalgaon, Nashik',
    farmer: { user: { name: 'Suresh Jadhav' }, rating: 4.8 },
    images: [{ url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' }],
  },
  {
    id: 'prod-mango-07',
    cropName: 'Alphonso Mango (Hapus)',
    variety: 'GI-Tagged Straw Ripened',
    pricePerKg: 140,
    quantity: 400,
    unit: 'kg',
    grade: 'A_PLUS',
    isOrganic: true,
    farmLocation: 'Ratnagiri Orchards',
    farmer: { user: { name: 'Ramesh Patil' }, rating: 4.9 },
    images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' }],
  },
  {
    id: 'prod-potato-03',
    cropName: 'Satara Table Potato',
    variety: 'Kufri Jyoti (Firm, Low Sugar)',
    pricePerKg: 22,
    quantity: 800,
    unit: 'kg',
    grade: 'A',
    isOrganic: true,
    farmLocation: 'Koregaon, Satara',
    farmer: { user: { name: 'Anita Pawar' }, rating: 4.95 },
    images: [{ url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800' }],
  },
  {
    id: 'prod-chilli-06',
    cropName: 'G4 Green Chilli',
    variety: 'G4 Hot Pungent',
    pricePerKg: 55,
    quantity: 300,
    unit: 'kg',
    grade: 'A',
    isOrganic: false,
    farmLocation: 'Walwa, Sangli',
    farmer: { user: { name: 'Suresh Jadhav' }, rating: 4.8 },
    images: [{ url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800' }],
  },
  {
    id: 'prod-wheat-04',
    cropName: 'Sharbati Wheat',
    variety: 'MP Sharbati Golden Grain',
    pricePerKg: 28,
    quantity: 2500,
    unit: 'kg',
    grade: 'A_PLUS',
    isOrganic: false,
    farmLocation: 'Rahuri, Ahmednagar',
    farmer: { user: { name: 'Mahesh Shinde' }, rating: 4.7 },
    images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800' }],
  },
];

const MANDI_BENCHMARKS = [
  { crop: 'Grade-A Tomato', market: 'Pune APMC', mandiPrice: 15, farmgatePrice: 18, retailPrice: 38, unit: 'kg' },
  { crop: 'Nashik Red Onion', market: 'Lasalgaon APMC', mandiPrice: 20, farmgatePrice: 24, retailPrice: 45, unit: 'kg' },
  { crop: 'Alphonso Mango', market: 'Ratnagiri APMC', mandiPrice: 120, farmgatePrice: 140, retailPrice: 260, unit: 'kg' },
  { crop: 'Satara Potato', market: 'Satara APMC', mandiPrice: 17, farmgatePrice: 22, retailPrice: 40, unit: 'kg' },
  { crop: 'G4 Green Chilli', market: 'Vashi APMC', mandiPrice: 45, farmgatePrice: 55, retailPrice: 95, unit: 'kg' },
  { crop: 'Sharbati Wheat', market: 'Ahmednagar APMC', mandiPrice: 24, farmgatePrice: 28, retailPrice: 48, unit: 'kg' },
];

export default function HomePage() {
  const { user, switchUser } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(INITIAL_FEATURED_PRODUCTS);
  const [activeRole, setActiveRole] = useState<'FARMER' | 'CONSUMER' | 'RESTAURANT' | 'RETAILER'>('FARMER');
  const [previewPublicLanding, setPreviewPublicLanding] = useState(false);
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setFeaturedProducts(data.products.slice(0, 6));
          }
        }
      } catch {
        // ignore
      }
    }
    loadProducts();
  }, []);

  const handleQuickPersonaSwitch = async (role: string) => {
    setIsSwitchingPersona(true);
    const target = DEMO_ACCOUNTS.find((d) => d.role === role);
    if (target) {
      await switchUser(target.id);
    }
    setIsSwitchingPersona(false);
  };

  const roleDetails = {
    FARMER: {
      tag: 'For Farmers & FPOs',
      title: 'Sell Directly at Fair Farmgate Rates',
      desc: 'Keep the 35% to 45% margin that middleman cartels usually take. Set your own prices with APMC mandi AI guidance, accept buyer bids, and get paid straight to your bank account via digital escrow.',
      bullets: [
        'Zero commission auction fees',
        'Direct escrow deposit in your bank within 2 hours of delivery',
        'Transparent bidding from restaurants and supermarkets',
      ],
      ctaText: 'List Your Harvest as Farmer',
      ctaUrl: '/farmer/produce/new',
      demoUserId: 'user-farmer-ramesh',
    },
    CONSUMER: {
      tag: 'For Households & Individuals',
      title: 'Farm-Fresh Produce Delivered Direct',
      desc: 'Get vegetables and fruits harvested that morning from verified Maharashtra farms. No artificial waxing, no cold-storage delay, and no 100% retail grocery markup.',
      bullets: [
        'Delivered within 24 to 36 hours of harvest',
        'Know the exact farmer, village, and harvest date',
        'Certified organic and chemical-tested options',
      ],
      ctaText: 'Shop Farm Fresh Produce',
      ctaUrl: '/marketplace',
      demoUserId: 'user-consumer-priya',
    },
    RESTAURANT: {
      tag: 'For Restaurants & Commercial Kitchens',
      title: 'Consistent Wholesale Quality with 25% Savings',
      desc: 'Source uniform Grade-A produce with scheduled morning delivery. Eliminate daily early-morning mandi visits and cut food procurement costs by 20% to 28%.',
      bullets: [
        'Standardized culinary grades and sizes',
        'GST compliant digital invoices',
        'Reliable 4°C cold chain transportation',
      ],
      ctaText: 'Explore Commercial Procurement',
      ctaUrl: '/marketplace',
      demoUserId: 'user-buyer-greenbite',
    },
    RETAILER: {
      tag: 'For Retail Supermarkets & Agro-Processors',
      title: 'Multi-Ton Bulk Supply from Regional Hubs',
      desc: 'Procure 5-ton to 50-ton truckloads aggregated at temperature-controlled hubs in Pune, Nashik, Satara, and Kolhapur with automated quality inspection reports.',
      bullets: [
        'Direct farmgate contracts with verified grower clusters',
        'Standardized QA grading certificates',
        'Consolidated freight and regional cold storage',
      ],
      ctaText: 'Access Processor Bulk Portal',
      ctaUrl: '/processor/dashboard',
      demoUserId: 'user-retailer-omkar',
    },
  };

  const currentRole = roleDetails[activeRole];
  const dashboardUrl = getRoleDashboardUrl(user?.role);

  // =========================================================================
  // VIEW A: PERSONALIZED ACTIVE WORKSPACE (Rendered when user is logged in)
  // =========================================================================
  if (user && !previewPublicLanding) {
    const isFarmer = user.role === 'FARMER';
    const isBuyer = ['CONSUMER', 'RESTAURANT', 'RETAILER', 'PROCESSOR', 'BUYER'].includes(user.role);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Control Bar: Active Persona Badge + Switch to Public Landing Page */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Welcome back, {user.name}
                </h1>
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-md font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  ROLE: <strong>{user.role}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized Workspace &bull; {user.farmerProfile?.farmLocation || user.buyerProfile?.city || 'Maharashtra, India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={dashboardUrl}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Full {user.role} Dashboard</span>
            </Link>

            <button
              onClick={() => setPreviewPublicLanding(true)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Public Landing Page</span>
            </button>
          </div>
        </div>

        {/* Farmer-Specific Quick Command Center */}
        {isFarmer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Active Produce Batches</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">4 Active</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for buyer bids</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Incoming Buyer Bids</span>
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">7 Offers</div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1">Highest bid: ₹26/kg (Onion)</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Escrow Payout Balance</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">₹74,500</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Direct bank payout ready</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Mandi Profit Advantage</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">+42%</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">vs APMC commission mandi</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/farmer/produce/new"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Harvest Produce</span>
              </Link>

              <Link
                href="/farmer/bids"
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>View &amp; Accept Buyer Bids (7)</span>
              </Link>

              <Link
                href="/farmer/insights"
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Live APMC Price Intelligence</span>
              </Link>

              <Link
                href="/farmer/payments"
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center gap-2"
              >
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>Escrow Wallet &amp; Payouts</span>
              </Link>
            </div>
          </div>
        )}

        {/* Buyer-Specific Quick Command Center */}
        {isBuyer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Fresh Harvests Online</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {featuredProducts.length} Lots Available
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Direct from Maharashtra farms</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Cost Saved vs Retail</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">-28% Average</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">Zero retail broker markups</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Next Delivery Window</span>
                  <Clock className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Tomorrow 7:00 AM</div>
                <div className="text-[11px] text-sky-600 font-semibold mt-1">Refrigerated farmgate transit</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Full Marketplace Catalog</span>
              </Link>

              <Link
                href="/buyer/orders"
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Track My Active Orders</span>
              </Link>
            </div>
          </div>
        )}

        {/* Live Marketplace Produce Feed */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Live Farmgate Produce Available Right Now
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Harvested within 24 hours &bull; Verified Maharashtra Farmers &bull; Direct Digital Escrow
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View all listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                      alt={p.cropName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider font-mono">
                      Grade {p.grade}
                    </div>
                    {p.isOrganic && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                        Organic
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {p.cropName}
                      </h3>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ₹{p.pricePerKg}/{p.unit || 'kg'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {p.variety}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{p.farmLocation}</span>
                      </span>
                      <span>{p.quantity} {p.unit || 'kg'} left</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/products/${p.id}`}
                    className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold py-2 rounded-xl text-xs transition block"
                  >
                    View Harvest Details &amp; Bid
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: HUMAN-DESIGNED EDITORIAL LANDING PAGE (Public / Preview Mode)
  // =========================================================================
  return (
    <div className="space-y-20 pb-16">
      {/* If previewing public landing while logged in, provide a return banner */}
      {user && previewPublicLanding && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2">
          <span>Viewing Public Landing Page Preview.</span>
          <button
            onClick={() => setPreviewPublicLanding(false)}
            className="bg-white text-emerald-900 px-3 py-1 rounded-md text-xs font-black hover:bg-emerald-50 transition"
          >
            &larr; Back to My Personalized Workspace
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. HERO SECTION: CRISP, HIGH-CONTRAST, HUMAN-CRAFTED     */}
      {/* ======================================================== */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Sharp Editorial Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                <span>Direct Agricultural Marketplace &bull; Maharashtra</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Fresh from the Farmgate.{' '}
                <span className="text-emerald-600 dark:text-emerald-400">Fair Pay for Farmers.</span>{' '}
                Zero Middlemen.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                KisanDirect directly connects Maharashtra cultivators with households, restaurants, and retail marts. Real APMC mandi benchmark pricing, verified harvest quality, and protected escrow payouts.
              </p>

              {/* Dual Primary Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/marketplace"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-sm transition hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Fresh Produce</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/farmer/produce/new"
                  className="w-full sm:w-auto bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold px-7 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sell Harvest as Cultivator</span>
                </Link>
              </div>

              {/* Key Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                    +42%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Farmer Profit
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
                    -26%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Buyer Cost
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 block">
                    2 Hours
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Bank Escrow Payout
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Crystal-Clear Photograph with Real Context Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1000&q=90"
                  alt="Verified Maharashtra Farmer with Fresh Harvest"
                  className="w-full h-[420px] object-cover object-center"
                />

                {/* Clear Floating Harvest Info Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg text-slate-900 dark:text-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Maharashtra Producer</span>
                    </span>
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                      Grade-A Fresh
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">Ramesh Patil</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Manchar, Pune (8.5 Acres)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹18/kg</span>
                      <span className="text-[10px] text-slate-400 line-through ml-1">Retail ₹38</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. ROLE SELECTION MATRIX: BOLD ROLES & INSTANT TEST DRIVE */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left space-y-1 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tailored For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Select Your Role in the Agricultural Value Chain
          </h2>
        </div>

        {/* Role Switcher Tabs with BOLD ROLES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {[
            { key: 'FARMER', label: 'FARMER', icon: Sprout, sub: 'Cultivator / FPO' },
            { key: 'CONSUMER', label: 'CONSUMER', icon: ShoppingBag, sub: 'Household Buyer' },
            { key: 'RESTAURANT', label: 'RESTAURANT', icon: Utensils, sub: 'Commercial Kitchen' },
            { key: 'RETAILER', label: 'RETAILER', icon: Store, sub: 'Supermarket / Co.' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeRole === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveRole(item.key as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span className="text-sm font-black uppercase tracking-wider font-mono">
                    <strong>{item.label}</strong>
                  </span>
                </div>
                <span className={`text-[11px] block ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-block bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase px-2.5 py-0.5 rounded font-mono">
                ROLE: <strong>{activeRole}</strong>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentRole.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentRole.desc}
              </p>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                {currentRole.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4 flex flex-col justify-center gap-3">
              <Link
                href={currentRole.ctaUrl}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-sm"
              >
                {currentRole.ctaText}
              </Link>

              {/* 1-Click Instant Demo Persona Activation */}
              <button
                onClick={() => handleQuickPersonaSwitch(activeRole)}
                disabled={isSwitchingPersona}
                className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Test Drive As {activeRole} Now &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TRANSPARENT PRICE COMPARISON: APMC VS KISANDIRECT     */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left space-y-1 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Transparent Market Economics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Direct Farmgate vs Middleman APMC Price Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real data indexed from Maharashtra Mandis. Farmers earn more, while buyers pay significantly less.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-mono font-bold text-slate-500">
                <tr>
                  <th className="p-4">Commodity / Crop</th>
                  <th className="p-4">Benchmark Mandi</th>
                  <th className="p-4 text-rose-600">APMC Trader Price</th>
                  <th className="p-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40">
                    KisanDirect Farmgate
                  </th>
                  <th className="p-4">Retail Supermarket</th>
                  <th className="p-4 text-right">Farmer Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {MANDI_BENCHMARKS.map((item, idx) => {
                  const gain = Math.round(((item.farmgatePrice - item.mandiPrice) / item.mandiPrice) * 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{item.crop}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">{item.market}</td>
                      <td className="p-4 font-semibold text-rose-600">₹{item.mandiPrice}/{item.unit}</td>
                      <td className="p-4 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                        ₹{item.farmgatePrice}/{item.unit}
                      </td>
                      <td className="p-4 text-slate-400 line-through">₹{item.retailPrice}/{item.unit}</td>
                      <td className="p-4 text-right">
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-xs">
                          +{gain}% Income
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. VERIFIED FRESH HARVEST SHOWCASE                      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Direct From The Soil
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Verified Maharashtra Fresh Produce Lots
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View all produce listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                    alt={p.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider font-mono">
                    Grade {p.grade}
                  </div>
                  {p.isOrganic && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                      Organic Certified
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {p.cropName}
                    </h3>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ₹{p.pricePerKg}/{p.unit || 'kg'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {p.variety}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.farmLocation}</span>
                    </span>
                    <span className="font-bold">{p.quantity} {p.unit || 'kg'} available</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/products/${p.id}`}
                  className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs transition block"
                >
                  View Details &amp; Place Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. ZERO-MIDDLEMAN 4-STEP PROCESS                         */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left space-y-1 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Direct Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How KisanDirect Eliminates Middleman Exploitation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Farmer Lists Produce',
              desc: 'Farmer uploads crop photos, estimated quantity, and harvest date. AI suggests fair benchmark pricing based on APMC mandi feeds.',
            },
            {
              step: '02',
              title: 'Transparent Buyer Bidding',
              desc: 'Households, restaurants, and supermarkets review lots and place binding digital bids with zero commission cuts.',
            },
            {
              step: '03',
              title: 'Escrow Lock & Pickup',
              desc: 'Buyer funds are locked in digital escrow. Temperature-controlled transit picks up from the farmgate or regional hub.',
            },
            {
              step: '04',
              title: 'Instant Escrow Release',
              desc: 'Quality is verified via digital QA checklist on delivery. Funds are transferred to the cultivator’s bank account in under 2 hours.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {item.step}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. ANOS & KUBER NARUTE TEAM CREDITS SPOTLIGHT           */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
              ENGINEERED BY COMPANY ANOS
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Crafted by Kuber Narute and his team
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              KisanDirect is developed by AnoS to transform agricultural supply chains across Maharashtra. Review full architectural specifications, API integrations, and developer documentation.
            </p>
          </div>

          <Link
            href="/documentation"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <span>Read Technical Documentation</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
