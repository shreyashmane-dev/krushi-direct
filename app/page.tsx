'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Users,
  BadgePercent,
  HelpCircle,
  Award,
  Leaf,
  ChevronRight,
  Clock,
  Coins,
  Building2,
  Utensils,
  Store,
  Factory,
  Sliders,
  Scale,
  Zap,
} from 'lucide-react';
import PriceJourney from '@/components/price-journey';
import AIPriceAssistant from '@/components/ai-price-assistant';
import { formatINR } from '@/lib/utils';

const INITIAL_FEATURED_PRODUCTS = [
  {
    id: 'prod-tomato-01',
    cropName: 'Grade-A Tomato',
    variety: 'Abhinav Hybrid (Table & Cooking)',
    pricePerKg: 18,
    quantity: 500,
    unit: 'kg',
    grade: 'A',
    isOrganic: true,
    farmLocation: 'Manchar-Narayangaon Belt, Pune',
    farmer: { user: { name: 'Ramesh Patil' }, rating: 4.9 },
    images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800' }],
  },
  {
    id: 'prod-onion-02',
    cropName: 'Nashik Red Onion',
    variety: 'Garwa Lasalgaon Red (Long Storage)',
    pricePerKg: 24,
    quantity: 1200,
    unit: 'kg',
    grade: 'A',
    isOrganic: false,
    farmLocation: 'Lasalgaon Mandi Belt, Nashik',
    farmer: { user: { name: 'Suresh Jadhav' }, rating: 4.8 },
    images: [{ url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' }],
  },
  {
    id: 'prod-mango-07',
    cropName: 'Alphonso Mango (Hapus)',
    variety: 'GI-Tagged Straw Ripened Hapus',
    pricePerKg: 140,
    quantity: 400,
    unit: 'kg',
    grade: 'A_PLUS',
    isOrganic: true,
    farmLocation: 'Ratnagiri Orchard Belt',
    farmer: { user: { name: 'Ramesh Patil' }, rating: 4.9 },
    images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' }],
  },
  {
    id: 'prod-potato-03',
    cropName: 'Satara Table Potato',
    variety: 'Kufri Jyoti (Low Sugar, Firm)',
    pricePerKg: 22,
    quantity: 800,
    unit: 'kg',
    grade: 'A',
    isOrganic: true,
    farmLocation: 'Koregaon Agro Cluster, Satara',
    farmer: { user: { name: 'Anita Pawar' }, rating: 4.95 },
    images: [{ url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800' }],
  },
  {
    id: 'prod-chilli-06',
    cropName: 'G4 Green Chilli',
    variety: 'G4 Hot Green Pungent',
    pricePerKg: 55,
    quantity: 300,
    unit: 'kg',
    grade: 'A',
    isOrganic: false,
    farmLocation: 'Walwa, Sangli Agro Cluster',
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
    farmLocation: 'Rahuri Belt, Ahmednagar',
    farmer: { user: { name: 'Mahesh Shinde' }, rating: 4.7 },
    images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800' }],
  },
];

const MANDI_TICKER_DATA = [
  { crop: 'Tomato (Grade A)', market: 'Pune APMC', mandiRate: '₹14-16', directRate: '₹18', change: '+5.2%', up: true },
  { crop: 'Nashik Red Onion', market: 'Lasalgaon APMC', mandiRate: '₹19-21', directRate: '₹24', change: '+3.8%', up: true },
  { crop: 'Alphonso Mango', market: 'Ratnagiri APMC', mandiRate: '₹110-125', directRate: '₹140', change: '+8.4%', up: true },
  { crop: 'Satara Potato', market: 'Satara APMC', mandiRate: '₹16-18', directRate: '₹22', change: '+1.9%', up: true },
  { crop: 'G4 Green Chilli', market: 'Vashi Navi Mumbai', mandiRate: '₹42-48', directRate: '₹55', change: '+4.1%', up: true },
  { crop: 'Sharbati Wheat', market: 'Ahmednagar APMC', mandiRate: '₹23-25', directRate: '₹28', change: '+2.5%', up: true },
  { crop: 'Cabbage', market: 'Gultekdi Pune', mandiRate: '₹10-12', directRate: '₹15', change: '-1.2%', up: false },
  { crop: 'Ginger (Fresh)', market: 'Sangli APMC', mandiRate: '₹65-72', directRate: '₹85', change: '+6.3%', up: true },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(INITIAL_FEATURED_PRODUCTS);
  const [mandiRates, setMandiRates] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeRoleTab, setActiveRoleTab] = useState<'FARMER' | 'BUYER' | 'RESTAURANT' | 'RETAILER'>('FARMER');

  // ROI Interactive Calculator State
  const [calcCrop, setCalcCrop] = useState('tomato');
  const [calcQty, setCalcQty] = useState(500);

  const cropCalculatorRates: Record<string, { name: string; farmgate: number; middlemanRetail: number; unit: string }> = {
    tomato: { name: 'Grade-A Tomato', farmgate: 18, middlemanRetail: 38, unit: 'kg' },
    onion: { name: 'Nashik Red Onion', farmgate: 24, middlemanRetail: 45, unit: 'kg' },
    mango: { name: 'Alphonso Mango', farmgate: 140, middlemanRetail: 260, unit: 'kg' },
    potato: { name: 'Satara Potato', farmgate: 22, middlemanRetail: 40, unit: 'kg' },
    wheat: { name: 'Sharbati Wheat', farmgate: 28, middlemanRetail: 48, unit: 'kg' },
    chilli: { name: 'G4 Green Chilli', farmgate: 55, middlemanRetail: 95, unit: 'kg' },
  };

  const currentCalc = cropCalculatorRates[calcCrop] || cropCalculatorRates.tomato;
  const directFarmerIncome = calcQty * currentCalc.farmgate;
  const traditionalFarmerIncome = Math.round(calcQty * (currentCalc.farmgate * 0.65));
  const farmerExtraGain = directFarmerIncome - traditionalFarmerIncome;

  const directBuyerCost = calcQty * currentCalc.farmgate;
  const retailBuyerCost = calcQty * currentCalc.middlemanRetail;
  const buyerSavings = retailBuyerCost - directBuyerCost;
  const savingsPercent = Math.round((buyerSavings / retailBuyerCost) * 100);

  const [selectedJourneyCrop, setSelectedJourneyCrop] = useState({
    name: 'Grade-A Tomato',
    price: 18,
    unit: 'kg',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, mandiRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/mandi-prices'),
        ]);

        if (prodRes.ok) {
          const pData = await prodRes.json();
          if (pData.products && pData.products.length > 0) {
            setFeaturedProducts(pData.products.slice(0, 6));
          }
        }

        if (mandiRes.ok) {
          const mData = await mandiRes.json();
          setMandiRates(mData.rates || []);
        }
      } catch {
        // ignore
      } finally {
        setLoadingProducts(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO SECTION WITH RICH BACKGROUND IMAGE     */}
      {/* ======================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-emerald-950/40">
        {/* Cinematic Agricultural Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform animate-pulse duration-10000 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80')`,
            filter: 'brightness(0.72) saturate(1.25)',
          }}
        />

        {/* Multi-layered Glassmorphic Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/80 to-slate-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

        {/* Hero Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Headline & Actions */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Live Agro-Corridor Pill */}
              <div className="inline-flex items-center gap-2.5 bg-emerald-950/80 border border-emerald-400/30 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg shadow-emerald-900/30">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Maharashtra Agro Corridor Active
                </span>
                <span className="text-[10px] bg-emerald-800/80 text-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                  2,450+ Qntl Traded
                </span>
              </div>

              {/* Master Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                Direct Farmgate.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
                  Zero Middlemen.
                </span>{' '}
                Guaranteed Pay.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connecting Maharashtra farmers directly with households, restaurants, retail marts, and agro-processors. Eliminating 4 to 6 intermediary cuts with real-time APMC AI price guidance and protected digital escrow.
              </p>

              {/* Dual Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/farmer/produce/new"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 text-sm"
                >
                  <Sprout className="w-5 h-5 text-slate-950" />
                  <span>List Harvest as Farmer</span>
                </Link>

                <Link
                  href="/marketplace"
                  className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800/90 text-white font-bold px-8 py-4 rounded-2xl border border-emerald-400/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 text-sm"
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <span>Browse Fresh Produce</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>

              {/* Verified Trust Stats Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-4">
                <div className="glass-dark p-3.5 rounded-2xl text-center border border-emerald-500/20 shadow-xl">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 block tracking-tight">
                    +42%
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-100/80 mt-0.5 block leading-tight">
                    Farmer Profit Realized
                  </span>
                </div>

                <div className="glass-dark p-3.5 rounded-2xl text-center border border-emerald-500/20 shadow-xl">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-300 block tracking-tight">
                    -26%
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-100/80 mt-0.5 block leading-tight">
                    Buyer Cost Reduced
                  </span>
                </div>

                <div className="glass-dark p-3.5 rounded-2xl text-center border border-emerald-500/20 shadow-xl">
                  <span className="text-2xl sm:text-3xl font-black text-teal-300 block tracking-tight">
                    Zero
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-100/80 mt-0.5 block leading-tight">
                    Auction Cartels
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero: Live Interactive Supply-Chain Visual Card */}
            <div className="lg:col-span-5 relative">
              {/* Floating Escrow Alert Pill */}
              <div className="absolute -top-6 -right-2 z-20 glass-emerald text-white px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-float">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Escrow Payout: ₹18,400 released</span>
              </div>

              {/* Floating Cold Chain Badge */}
              <div className="absolute -bottom-5 -left-4 z-20 glass-dark text-white px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-teal-400/40 animate-float-delayed">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>4°C Reefer Transit Active</span>
              </div>

              {/* Main Interactive Glass Container */}
              <div className="glass-dark rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Live Transaction Architecture
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    2% Platform Rate
                  </span>
                </div>

                {/* Step 1: Farmer Farmgate */}
                <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-400 transition">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/20">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                        1. Producer Farmgate
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded">
                        Pune Rural
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-0.5 truncate">Ramesh Patil (Manchar)</p>
                    <p className="text-[11px] text-amber-300 font-semibold">Lists 500 kg Grade-A Tomatoes @ ₹18/kg</p>
                  </div>
                </div>

                {/* Flow Connector */}
                <div className="flex justify-center text-emerald-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 2: KisanDirect Tech Platform Core */}
                <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900/90 border border-emerald-400/40 rounded-2xl p-4 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-black text-white tracking-wider uppercase">
                        2. KisanDirect AI Hub
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      Auto-Graded 98%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-100/90">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>APMC Realtime Benchmark</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Razorpay Digital Escrow</span>
                    </div>
                  </div>
                </div>

                {/* Flow Connector */}
                <div className="flex justify-center text-emerald-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>

                {/* Step 3: Verified Direct Buyer */}
                <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3.5 hover:border-blue-400 transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-500/20">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-300 uppercase tracking-wide">
                        3. Commercial Buyer
                      </span>
                      <span className="text-[10px] font-bold bg-blue-900 text-blue-200 px-2 py-0.5 rounded">
                        Koregaon Park
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-0.5 truncate">GreenBite Bistro (Pune)</p>
                    <p className="text-[11px] text-emerald-300 font-semibold">Buys 100 kg • Direct Savings of ₹700</p>
                  </div>
                </div>

                {/* Middlemen Eliminated Notice */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    No commission auction agents
                  </span>
                  <Link href="/how-it-works" className="text-emerald-400 hover:underline font-bold flex items-center gap-0.5">
                    <span>Explore System</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Continuous Mandi Rates Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-emerald-500/20 py-2.5 overflow-hidden backdrop-blur-md z-20">
          <div className="animate-marquee flex items-center gap-8 text-xs font-semibold text-white whitespace-nowrap">
            {MANDI_TICKER_DATA.concat(MANDI_TICKER_DATA).map((t, idx) => (
              <div key={idx} className="inline-flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{t.crop}</span>
                <span className="text-slate-400 text-[11px]">({t.market}):</span>
                <span className="text-slate-200">APMC {t.mandiRate}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-amber-400 font-bold">KisanDirect {t.directRate}/kg</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${t.up ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                  {t.change}
                </span>
                <span className="text-slate-600 ml-4">|</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE ROI & SAVINGS CALCULATOR                  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/30 space-y-8 relative overflow-hidden">
          {/* Ambient light inside card */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Calculator Header */}
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
              Live Economic Disintermediation Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              See How Much You Save & Earn
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90">
              Middlemen siphon off up to 55% of crop value between the village APMC gate and the city kitchen. Slide quantity and see the direct economic impact.
            </p>
          </div>

          {/* Commodity Selector Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(cropCalculatorRates).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setCalcCrop(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  calcCrop === key
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                    : 'glass-dark text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Quantity Slider */}
          <div className="bg-slate-950/50 rounded-2xl p-6 border border-emerald-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Quantity to Trade:</span>
              </label>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{calcQty.toLocaleString()}</span>
                <span className="text-sm text-slate-400 font-bold ml-1">kg ({ (calcQty / 100).toFixed(1) } Quintals)</span>
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={calcQty}
              onChange={(e) => setCalcQty(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50 kg (Boutique Cafe)</span>
              <span>1,000 kg (Restaurant Chain)</span>
              <span>5,000 kg (Wholesale Supermarket)</span>
            </div>
          </div>

          {/* Dual Impact Grid: Farmer vs Buyer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farmer Realization Card */}
            <div className="glass-dark rounded-2xl p-6 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">For The Producer (Farmer)</h3>
                  <span className="text-[11px] text-slate-400">Direct farmgate sale without commission agent cut</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Traditional Mandi Yard Payout:</span>
                  <span className="line-through text-slate-400">{formatINR(traditionalFarmerIncome)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-300 font-bold">
                  <span>KisanDirect Direct Payout:</span>
                  <span className="text-base text-emerald-400 font-black">{formatINR(directFarmerIncome)}</span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200">Extra Net Income Kept:</span>
                <span className="text-lg font-black text-amber-400">+{formatINR(farmerExtraGain)}</span>
              </div>
            </div>

            {/* Buyer Procurement Savings Card */}
            <div className="glass-dark rounded-2xl p-6 border border-blue-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">For The Buyer (Consumer/Business)</h3>
                  <span className="text-[11px] text-slate-400">Wholesale purchase without 4-tier retail markup</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Traditional Retail / Agent Cost:</span>
                  <span className="line-through text-slate-400">{formatINR(retailBuyerCost)}</span>
                </div>
                <div className="flex justify-between text-xs text-blue-300 font-bold">
                  <span>KisanDirect Sourcing Cost:</span>
                  <span className="text-base text-blue-400 font-black">{formatINR(directBuyerCost)}</span>
                </div>
              </div>

              <div className="bg-blue-950/80 border border-blue-500/40 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-200">Direct Savings ({savingsPercent}%):</span>
                <span className="text-lg font-black text-emerald-400">Save {formatINR(buyerSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED FRESH FARMGATE HARVEST CATALOG              */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Harvest Fresh Today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Featured Direct Farm Produce</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Directly harvested in Pune, Nashik, and Satara with live APMC benchmark comparison.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition hover:underline group"
          >
            <span>Explore All 20+ Produce Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => {
            const matchedMandi = mandiRates.find(
              (m) =>
                p.cropName.toLowerCase().includes(m.commodity.toLowerCase()) ||
                m.commodity.toLowerCase().includes(p.cropName.toLowerCase())
            );
            const govtMandiPrice = matchedMandi ? matchedMandi.modalPrice : Math.round(p.pricePerKg * 1.25);
            const retailMarketPrice = matchedMandi
              ? Math.round(matchedMandi.modalPrice * 1.55)
              : Math.round(p.pricePerKg * 1.55);
            const saving = Math.max(0, retailMarketPrice - p.pricePerKg);
            const savingPercent = Math.round((saving / retailMarketPrice) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                    alt={p.cropName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-emerald-800 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-md">
                    <span>Grade {p.grade?.replace('_', '+')}</span>
                  </div>

                  {p.isOrganic && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>Organic</span>
                    </div>
                  )}

                  {/* Savings pill badge */}
                  <div className="absolute bottom-3 right-3 bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] shadow-md flex items-center gap-1">
                    <span>Save ₹{saving}/{p.unit} ({savingPercent}% off)</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-700 transition">
                        {p.cropName}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.farmer?.rating || '4.9'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.variety || 'Fresh Harvest'}</p>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-2.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{p.farmLocation}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Farmer: <strong className="text-slate-800">{p.farmer?.user?.name || 'Verified Farmer'}</strong>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Direct Farmgate</span>
                        <span className="text-2xl font-black text-emerald-700">₹{p.pricePerKg}</span>
                        <span className="text-xs text-slate-500 font-semibold"> /{p.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through block">Retail: ₹{retailMarketPrice}</span>
                        <span className="text-xs text-blue-700 font-bold block">APMC: ₹{govtMandiPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-emerald-700 font-bold">Available: {p.quantity} {p.unit}</span>
                      <span className="truncate text-[11px] font-medium text-slate-400">
                        {matchedMandi ? 'Agmarknet DMI' : 'Govt APMC Index'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/products/${p.id}`}
                        className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/products/${p.id}?buy=true`}
                        className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. THE 4-WAY MULTI-SIDED MARKETPLACE ECOSYSTEM           */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            One Platform. Four Pillars.
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Tailored For Maharashtra's Whole Agri Value Chain
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Whether you cultivate the land or procure 5 tons daily for a restaurant group, KisanDirect delivers custom tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Farmers */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Farmers & FPOs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List harvest in 60s, access AI price recommendations, review buyer bids, and receive guaranteed escrow settlements directly in your bank account.
              </p>
            </div>
            <Link
              href="/farmer/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Farmer Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Households */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Households</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Taste produce harvested that very morning. Traceable to the exact farmer and certified organic without the 100% retail grocery markup.
              </p>
            </div>
            <Link
              href="/consumer/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Consumer Sourcing</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Restaurants */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Restaurants</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized culinary sizes, predictable scheduled morning deliveries, GST invoicing, and 28% lower food costs on tomatoes, onions and greens.
              </p>
            </div>
            <Link
              href="/buyer/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              <span>Commercial Procurement</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: Retailers & Processors */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Retail & Agro-Co</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order 5-ton to 50-ton bulk truckloads through regional cold consolidation hubs in Pune, Nashik, and Satara with automated grading certs.
              </p>
            </div>
            <Link
              href="/processor/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              <span>Processor Bulk Desk</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. APMC PRICE DISCOVERY & PRICE JOURNEY COMPARISON       */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Radical Economic Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            The Price Journey: Middleman vs. KisanDirect
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            See the exact price breakdown computed from Maharashtra APMC Mandi indices.
          </p>

          {/* Commodity Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { name: 'Grade-A Tomato', price: 18, unit: 'kg' },
              { name: 'Nashik Red Onion', price: 24, unit: 'kg' },
              { name: 'Satara Table Potato', price: 22, unit: 'kg' },
              { name: 'G4 Green Chilli', price: 55, unit: 'kg' },
              { name: 'Ratnagiri Alphonso Mango', price: 140, unit: 'kg' },
            ].map((crop) => (
              <button
                key={crop.name}
                onClick={() => setSelectedJourneyCrop(crop)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedJourneyCrop.name === crop.name
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {crop.name} (₹{crop.price}/{crop.unit})
              </button>
            ))}
          </div>
        </div>

        <PriceJourney
          farmerPrice={selectedJourneyCrop.price}
          cropName={selectedJourneyCrop.name}
          unit={selectedJourneyCrop.unit}
        />
      </section>

      {/* ======================================================== */}
      {/* 6. AI SMART ENGINE & LIVE BENCHMARK ADVISORY             */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Agro-Economist Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Algorithmic Price Guidance & Demand Forecasting
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never undersell a harvest. Our provider-abstracted <strong>AIService</strong> analyzes historical APMC Mandi trends, commercial buyer inquiry volumes, and seasonal factors to compute optimal farmgate price ranges.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent confidence scores (e.g. 88% reliability rating)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clearly labeled &quot;AI-assisted estimate&quot; ensuring farmer autonomy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-day & 30-day regional demand delta forecasts</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/farmer/insights"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3.5 rounded-2xl transition shadow-lg"
              >
                <span>Explore Live AI Trends Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AIPriceAssistant
              cropName="Tomato"
              grade="A"
              quantity={500}
              location="Pune, Maharashtra"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. VERIFIED MAHARASHTRA PRODUCERS SPOTLIGHT             */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Direct Traceability
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Meet Our Verified Maharashtra Farmers</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every producer profile is backed by geotagged farm coordinates, land survey verification, and direct bank settlement details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200"
              alt="Ramesh Patil"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900 text-base">Ramesh Patil</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Manchar, Pune (8.5 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 Rating (38 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              PGS-India Certified Organic producer of Abhinav Hybrid Tomatoes and GI-Tagged Alphonso Mangoes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Suresh Jadhav"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900 text-base">Suresh Jadhav</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Lasalgaon, Nashik (14 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.8 Rating (52 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              Leading Lasalgaon Red Onion & G4 Spicy Green Chilli cultivator with cured dry storage.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
              alt="Anita Pawar"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900 text-base">Anita Pawar</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Koregaon, Satara (6 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95 Rating (29 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              Mountain potato and cauliflower specialist with zero chemical pesticide certification.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CALL TO ACTION BANNER WITH BACKGROUND IMAGE           */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 p-8 sm:p-14 text-white text-center space-y-6">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=80')`,
              filter: 'brightness(0.28) saturate(1.3)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-950/90" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-emerald-900/80 border border-emerald-400/40 px-3.5 py-1.5 rounded-full">
              Join 1,200+ Farmers & 3,400+ Buyers
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Transform Your Agricultural Trade Today
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-normal">
              Whether you are listing this season's harvest or securing farmgate quality for your business, start in less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/30 transition hover:scale-105 text-sm"
              >
                Create Free Account
              </Link>
              <Link
                href="/marketplace"
                className="w-full sm:w-auto glass-dark hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 transition hover:scale-105 text-sm"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FAQ ACCORDION                                         */}
      {/* ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              How does payment work for farmers?
            </h4>
            <p className="text-slate-600 pl-6 leading-relaxed">
              When a buyer places an order, the amount is held securely in digital escrow via Razorpay. Once the produce is inspected and marked delivered, the net amount (order value minus a 2% platform fee) is settled directly into the farmer’s verified bank account within 2 hours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Are AI prices mandatory or guaranteed market rates?
            </h4>
            <p className="text-slate-600 pl-6 leading-relaxed">
              No. Our AI provides an &quot;AI-assisted estimate&quot; based on APMC mandi historical records and demand patterns. Farmers maintain 100% full autonomy to set and adjust their own listing prices anytime.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Can commercial buyers negotiate or bid on bulk produce?
            </h4>
            <p className="text-slate-600 pl-6 leading-relaxed">
              Yes. Buyers can submit direct offers specifying price per kg and bulk volume. Farmers can accept, reject, or submit counter-offers with real-time in-app alerts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
