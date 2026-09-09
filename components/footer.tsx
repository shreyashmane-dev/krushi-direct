import React from 'react';
import Link from 'next/link';
import { Sprout, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/icons/icon-192.png"
                alt="KisanDirect Logo"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40"
              />
              <span className="text-xl font-black text-white tracking-tight">
                Kisan<span className="text-emerald-400">Direct</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct agricultural marketplace connecting Maharashtra farmers with consumers, restaurants, and retail marts with zero middlemen.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium pt-1">
              Pune &bull; Nashik &bull; Satara &bull; Kolhapur
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/marketplace?category=vegetables" className="hover:text-emerald-400 transition">Fresh Vegetables</Link></li>
              <li><Link href="/marketplace?category=fruits" className="hover:text-emerald-400 transition">Orchard Fruits</Link></li>
              <li><Link href="/marketplace?category=grains-cereals" className="hover:text-emerald-400 transition">Grains &amp; Wheat</Link></li>
              <li><Link href="/marketplace?category=spices" className="hover:text-emerald-400 transition">Spices &amp; Chillies</Link></li>
            </ul>
          </div>

          {/* Col 3: Direct Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/farmer/produce/new" className="hover:text-emerald-400 transition">List Harvest (Farmer)</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition">Browse Catalog (Buyer)</Link></li>
              <li><Link href="/farmer/insights" className="hover:text-emerald-400 transition">AI Price Forecasts</Link></li>
              <li><Link href="/innovation" className="hover:text-emerald-400 transition">How It Works</Link></li>
            </ul>
          </div>

          {/* Col 4: Dossier & Docs (AnoS & Kuber Narute) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Dossier &amp; Team
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete project documentation, company profile, and architectural specification.
            </p>
            <Link
              href="/documentation"
              className="inline-flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl transition"
            >
              <span>View Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Creator & Company Credit Banner */}
        <div className="border-t border-slate-800/80 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-300">&copy; 2026 KisanDirect</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-bold">Company: AnoS</span>
            <span>&bull;</span>
            <span>
              Made with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> by{' '}
              <strong className="text-white font-black">Kuber Narute and his team</strong>
            </span>
          </div>

          <Link
            href="/documentation"
            className="text-slate-400 hover:text-emerald-400 transition underline underline-offset-4 font-medium"
          >
            Read AnoS Technical Documentation &rarr;
          </Link>
        </div>
      </div>
    </footer>
  );
}
