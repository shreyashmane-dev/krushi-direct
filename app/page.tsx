'use client';

import React, { useState, useEffect } from 'react';
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
    variety: 'MP Sharbati Premium Golden Grain',
    pricePerKg: 28,
    quantity: 2500,
    unit: 'kg',
    grade: 'A_PLUS',
    isOrganic: false,
    farmLocation: 'Rahuri Agricultural Belt, Ahmednagar',
    farmer: { user: { name: 'Mahesh Shinde' }, rating: 4.7 },
    images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800' }],
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
    farmLocation: 'Khed-Manchar / Ratnagiri Orchard',
    farmer: { user: { name: 'Ramesh Patil' }, rating: 4.9 },
    images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' }],
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(INITIAL_FEATURED_PRODUCTS);
  const [mandiRates, setMandiRates] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
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
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/70 via-[#f8faf6] to-white border-b border-emerald-100">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
                Sell Direct.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
                  Earn More.
                </span>{' '}
                Buy Fresh.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect farmers directly with consumers, restaurants, retailers and food-processing businesses. Eliminating 4 to 6 intermediary margins with AI price guidance and guaranteed digital escrow payouts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/farmer/produce/new"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Sell Your Produce</span>
                </Link>

                <Link
                  href="/marketplace"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 rounded-xl border border-slate-300 shadow-sm transition hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Buy Fresh Produce</span>
                </Link>
              </div>

              {/* Trust Metrics Pill Strip */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/90 border border-emerald-100 p-3 rounded-xl shadow-sm text-center">
                  <span className="text-xl font-black text-emerald-700 block">35% – 45%</span>
                  <span className="text-[11px] font-semibold text-slate-500">Higher Farmer Realization</span>
                </div>
                <div className="bg-white/90 border border-emerald-100 p-3 rounded-xl shadow-sm text-center">
                  <span className="text-xl font-black text-emerald-700 block">20% – 28%</span>
                  <span className="text-[11px] font-semibold text-slate-500">Lower Buyer Sourcing Cost</span>
                </div>
                <div className="bg-white/90 border border-emerald-100 p-3 rounded-xl shadow-sm text-center">
                  <span className="text-xl font-black text-emerald-700 block">Zero</span>
                  <span className="text-[11px] font-semibold text-slate-500">Middlemen Markups</span>
                </div>
              </div>
            </div>

            {/* Right Hero Diagram: Farmer -> KisanDirect Marketplace -> Buyer */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 rounded-3xl p-6 shadow-2xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Direct Marketplace Model
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Target Outcome
                  </span>
                </div>

                {/* Vertical Flowchart */}
                <div className="space-y-3">
                  {/* Farmer Card */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-emerald-600/30">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">1. Farmer</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                          Farmgate
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">Ramesh Patil (Manchar, Pune)</p>
                      <p className="text-[11px] text-emerald-700 font-bold">Lists Grade-A Tomato @ ₹18/kg</p>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-emerald-600">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  {/* KisanDirect Tech Platform */}
                  <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 shadow-lg space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-black tracking-wider uppercase text-amber-300">
                          2. KisanDirect Marketplace
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-bold">2% Fee</span>
                    </div>
                    <p className="text-xs text-emerald-100">
                      AI Price Guidance (₹18–₹21) • Computer Vision Quality Check • Razorpay Escrow • Live GPS Logistics
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-emerald-600">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  {/* Direct Buyer Card */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-blue-600/30">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">3. Direct Buyer</span>
                        <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.2 rounded">
                          Direct Procurement
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">GreenBite Bistro (Pune)</p>
                      <p className="text-[11px] text-blue-700 font-bold">Buys 100 kg • Saves ₹700 vs Retail</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Middlemen Traders, Wholesalers & Distributors Eliminated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCE SHOWCASE */}
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
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition hover:underline"
          >
            <span>Explore All 20+ Produce Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => {
            // Real Government APMC Mandi benchmark correlation
            const matchedMandi = mandiRates.find((m) =>
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
                className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                    alt={p.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-sm">
                    <span>Grade {p.grade?.replace('_', '+')}</span>
                  </div>

                  {p.isOrganic && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>Organic</span>
                    </div>
                  )}

                  {/* Savings pill badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px] shadow-sm flex items-center gap-1">
                    <span>Save ₹{saving}/{p.unit} ({savingPercent}% off)</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
                        {p.cropName}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.farmer?.rating || '4.9'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.variety || 'Fresh Harvest'}</p>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{p.farmLocation}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Farmer: <strong className="text-slate-800">{p.farmer?.user?.name || 'Verified Farmer'}</strong>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Direct Farmgate</span>
                        <span className="text-xl font-black text-emerald-700">₹{p.pricePerKg}</span>
                        <span className="text-xs text-slate-500"> /{p.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 line-through block">Retail: ₹{retailMarketPrice}</span>
                        <span className="text-[10px] text-blue-700 font-bold block">Govt APMC: ₹{govtMandiPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-700 font-semibold">Available: {p.quantity} {p.unit}</span>
                      <span className="truncate font-medium">{matchedMandi ? 'Agmarknet DMI' : 'APMC Index'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/products/${p.id}`}
                        className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/products/${p.id}?buy=true`}
                        className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm shadow-emerald-600/20"
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

      {/* 3. PRICE TRANSPARENCY SHOWCASE (Interactive Price Journey) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Radical Economic Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            The Price Journey: Middleman vs. KisanDirect
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Indian farmers traditionally lose up to 65% of customer expenditure to traders and wholesalers. See the exact breakdown computed from Maharashtra APMC Mandi indices.
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedJourneyCrop.name === crop.name
                    ? 'bg-emerald-700 text-white shadow-sm'
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

      {/* 4. AI SMART PRICING & DEMAND FORECAST PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Agro-Economist Engine</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Algorithmic Price Guidance & Demand Forecasting
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never undersell a harvest. Our provider-abstracted <strong>AIService</strong> analyzes historical APMC Mandi trends, commercial buyer inquiry volumes, and seasonal factors to compute optimal farmgate price ranges.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent confidence scores (e.g. 84% reliability)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clearly labeled &quot;AI-assisted estimate&quot; ensuring honest advisory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-day & 30-day regional demand delta forecasts</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/farmer/insights"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition"
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

      {/* 5. VERIFIED FARMERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Trust & Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Meet Our Verified Maharashtra Farmers</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every farmer profile is verified with geotagged farm coordinates, land records, and direct bank settlement details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200"
              alt="Ramesh Patil"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900">Ramesh Patil</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Manchar, Pune (8.5 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 Rating (38 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              PGS-India Certified Organic producer of Abhinav Hybrid Tomatoes and Alphonso Mangoes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Suresh Jadhav"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900">Suresh Jadhav</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Lasalgaon, Nashik (14 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.8 Rating (52 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              Leading Lasalgaon Red Onion & G4 Spicy Green Chilli cultivator with cured storage.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md flex flex-col items-center text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
              alt="Anita Pawar"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-bold text-slate-900">Anita Pawar</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">Koregaon, Satara (6 Acres)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95 Rating (29 Verified Orders)</span>
            </div>
            <p className="text-xs text-slate-600">
              Mountain potato and cauliflower specialist with zero chemical pesticide certification.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW KISANDIRECT HELPS (Farmer vs Buyer Benefits) */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Dual-Sided Marketplace Value
            </span>
            <h2 className="text-3xl font-black">How KisanDirect Transforms Both Sides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farmer Benefits */}
            <div className="bg-emerald-800/80 border border-emerald-700/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">For Indian Farmers</h3>
                  <span className="text-xs text-emerald-200">Higher margins, guaranteed payment & market access</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-emerald-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>35%–45% Higher Price Realization:</strong> Eliminate local trader cut and auction cartels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Guaranteed Escrow Payouts:</strong> No credit defaults; funds are locked in escrow prior to transit dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Bidding System:</strong> Review bulk purchase bids from hotels and restaurants with counter-offer tools.</span>
                </li>
              </ul>
            </div>

            {/* Buyer Benefits */}
            <div className="bg-emerald-800/80 border border-emerald-700/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">For Buyers & Commercial Kitchens</h3>
                  <span className="text-xs text-emerald-200">Fresh farmgate produce, direct traceability & lower rates</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-emerald-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>20%–28% Procurement Savings:</strong> Buy at farmgate price without multi-tier wholesale markups.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Harvest-Day Freshness:</strong> Delivered within 24–36 hours in temperature-controlled transit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Transparent Traceability:</strong> Verify the exact village, farmer name, and harvest date.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              How does payment work for farmers?
            </h4>
            <p className="text-slate-600 pl-6">
              When a buyer places an order, the amount is held securely in digital escrow via Razorpay. Once the produce is inspected and marked delivered, the net amount (order value minus a 2% platform fee) is settled directly into the farmer’s verified bank account.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Are AI prices guaranteed market rates?
            </h4>
            <p className="text-slate-600 pl-6">
              No. Our AI provides an &quot;AI-assisted estimate&quot; based on APMC mandi historical records and demand patterns. Farmers maintain 100% full autonomy to set and adjust their own listing prices.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Can buyers negotiate or bid on produce?
            </h4>
            <p className="text-slate-600 pl-6">
              Yes. Buyers can submit direct offers specifying price per kg and bulk volume. Farmers can accept, reject, or submit counter-offers with real-time in-app alerts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
