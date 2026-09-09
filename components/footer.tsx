import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, HeartHandshake, Truck, Sparkles, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
      {/* Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Direct Farm Sourcing</h4>
              <p className="text-xs text-slate-400 mt-1">Zero middlemen markups. Direct connection from Maharashtra farmers to verified buyers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">AI Price Intelligence</h4>
              <p className="text-xs text-slate-400 mt-1">Algorithmic farmgate price guidance and 30-day regional demand forecasts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Temperature-Controlled Logistics</h4>
              <p className="text-xs text-slate-400 mt-1">Farmgate direct pickup and regional collection hubs in Pune, Nashik, and Satara.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Test-Mode Escrow</h4>
              <p className="text-xs text-slate-400 mt-1">Server-verified payments with automated settlement directly to farmer bank accounts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Kisan<span className="text-emerald-400">Direct</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An AI-powered Farmer-to-Buyer agricultural marketplace empowering Indian farmers with transparent farmgate price discovery, direct buyer bidding, and guaranteed payouts.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Pilot Region: Western Maharashtra (Pune, Nashik, Satara, Kolhapur)</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Marketplace</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/marketplace?category=vegetables" className="hover:text-emerald-400 transition">Fresh Vegetables</Link></li>
              <li><Link href="/marketplace?category=fruits" className="hover:text-emerald-400 transition">Orchard Fruits</Link></li>
              <li><Link href="/marketplace?category=grains-cereals" className="hover:text-emerald-400 transition">Grains & Wheat</Link></li>
              <li><Link href="/marketplace?category=spices" className="hover:text-emerald-400 transition">Spices & Condiments</Link></li>
              <li><Link href="/marketplace?organic=true" className="hover:text-emerald-400 transition">Certified Organic</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Farmer Tools</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/farmer/produce/new" className="hover:text-emerald-400 transition">List Your Harvest</Link></li>
              <li><Link href="/farmer/insights" className="hover:text-emerald-400 transition">AI Price Intelligence</Link></li>
              <li><Link href="/farmer/dashboard" className="hover:text-emerald-400 transition">Farmer Dashboard</Link></li>
              <li><Link href="/farmer/bids" className="hover:text-emerald-400 transition">Buyer Offers & Bids</Link></li>
              <li><Link href="/farmer/payments" className="hover:text-emerald-400 transition">Settlements & Payouts</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Platform Architecture</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/innovation" className="hover:text-emerald-400 transition font-medium text-emerald-400">How It Works</Link></li>
              <li><Link href="/innovation#supply-chain" className="hover:text-emerald-400 transition">Supply Chain Comparison</Link></li>
              <li><Link href="/innovation#business-model" className="hover:text-emerald-400 transition">Unit Economics & Model</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-emerald-400 transition">Admin Governance Portal</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Disclaimer */}
      <div className="border-t border-slate-900 bg-slate-950/50 py-6 px-4 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 KisanDirect. All agro-climatic predictions are AI-assisted estimates.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Built with Next.js, Prisma, Tailwind & AI</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Maharashtra Agro-Pilot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
