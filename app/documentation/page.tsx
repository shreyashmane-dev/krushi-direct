'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Truck,
  Sparkles,
  Award,
  Users,
  Building2,
  FileText,
  Code2,
  Database,
  Layers,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Heart,
  BookOpen,
  Cpu,
  Lock,
  Boxes,
  CheckCircle2,
  Globe,
} from 'lucide-react';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'features' | 'team'>('overview');

  return (
    <div className="min-h-screen bg-[#f8faf6] text-slate-900 pb-20">
      {/* Documentation Header Banner */}
      <section className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white py-16 sm:py-24 border-b border-emerald-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80')` }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Company: AnoS</span>
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Made by Kuber Narute &amp; Team</span>
            </span>
            <span className="text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full">
              PWA 2.0 &bull; Next.js 14 &bull; Cloud Sync
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            KisanDirect Technical Dossier &amp; Documentation
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 max-w-3xl leading-relaxed font-normal">
            The complete architectural specification, engineering overview, and product documentation for Maharashtra's premier AI-powered direct farmgate agricultural marketplace.
          </p>

          {/* Quick Nav Tabs */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: 'overview', label: '1. Executive Overview', icon: BookOpen },
              { id: 'architecture', label: '2. System Architecture', icon: Layers },
              { id: 'features', label: '3. Core Modules & Engine', icon: Cpu },
              { id: 'team', label: '4. Company & Team Credits', icon: Users },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === t.id
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ======================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW                                */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Executive Summary &amp; Mission</h2>
                  <p className="text-xs text-slate-500">Built by Kuber Narute and his team at AnoS</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>KisanDirect</strong> is a next-generation agricultural disintermediation ecosystem engineered to eliminate the 4 to 6 tiers of intermediary markups (village aggregators, commission agents, APMC mandi cartels, secondary wholesalers, and urban distributors) that currently siphon up to <strong>55% of consumer spend</strong> away from Indian farmers.
                </p>
                <p>
                  Conceived and engineered by <strong>Kuber Narute and his team at AnoS</strong>, the platform empowers Maharashtra farmers to publish their harvest directly to households, commercial restaurants, retail marts, and agro-processing factories. By combining algorithmic price intelligence with Agmarknet government indices, computer-vision grading, cold-chain logistics, and bank-settled digital escrow, KisanDirect guarantees fair farmgate compensation and reduces procurement costs for buyers.
                </p>
              </div>

              {/* Impact Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                  <span className="text-3xl font-black text-emerald-700 block">+35% to +45%</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">Farmer Price Realization</span>
                  <p className="text-[11px] text-slate-500 mt-1">Direct payout without auction agent deductions.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                  <span className="text-3xl font-black text-blue-700 block">-20% to -28%</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">Buyer Sourcing Cost</span>
                  <p className="text-[11px] text-slate-500 mt-1">Wholesale procurement at farmgate rates.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                  <span className="text-3xl font-black text-amber-700 block">2 Hours</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">Escrow Settlement Speed</span>
                  <p className="text-[11px] text-slate-500 mt-1">Direct Bank of Maharashtra deposit upon delivery.</p>
                </div>
              </div>
            </div>

            {/* Target Value Chain */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900">Multi-Sided Marketplace Stakeholders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <h4 className="font-bold text-emerald-800 text-base flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    <span>1. Producers, Farmers &amp; FPOs</span>
                  </h4>
                  <p className="text-slate-600">
                    Full autonomy to list produce with harvest dates, variety, and photos. Access AI price guidance based on live APMC mandis. Receive counter-offers and guaranteed payments without debtor risk.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <h4 className="font-bold text-blue-800 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>2. Households &amp; Consumers</span>
                  </h4>
                  <p className="text-slate-600">
                    Farm-to-fork freshness delivered within 24-36 hours. Complete traceability with farmer profile photos, land coordinates, and organic certification badges.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <h4 className="font-bold text-amber-800 text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <span>3. Commercial Restaurants &amp; Hotels</span>
                  </h4>
                  <p className="text-slate-600">
                    Wholesale procurement with standardized Grade-A sizes, predictable morning dispatch, and consolidated GST tax invoicing.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <h4 className="font-bold text-purple-800 text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>4. Retail Marts &amp; Agro-Processors</span>
                  </h4>
                  <p className="text-slate-600">
                    Multi-ton bulk purchasing from temperature-controlled consolidation hubs in Pune, Nashik, Satara, and Kolhapur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SYSTEM ARCHITECTURE & TECH STACK                  */}
        {/* ======================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Technical Architecture &amp; Stack</h2>
                  <p className="text-xs text-slate-500">Enterprise Next.js 14 App Router + Cloud Dual-Store</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Full-Stack Framework</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; <strong>Next.js 14.2.15</strong> (App Router)</li>
                    <li>&bull; <strong>React 18.3.1</strong> Server &amp; Client Components</li>
                    <li>&bull; <strong>TypeScript 5.6</strong> with strict typing</li>
                    <li>&bull; <strong>Tailwind CSS 3.4</strong> + Glassmorphism</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>Database &amp; Cloud Persistence</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; <strong>Prisma ORM 5.22</strong> for relational modeling</li>
                    <li>&bull; <strong>SQLite</strong> local development engine</li>
                    <li>&bull; <strong>Google Firebase Firestore 12.18</strong> for cross-container multi-serverless synchronization</li>
                    <li>&bull; System backend auto-auth with <code className="bg-slate-200 px-1 rounded">ensureFirebaseAuth()</code></li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Progressive Web App (PWA)</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; <strong>Service Worker (<code className="bg-slate-200 px-1 rounded">sw.js</code>)</strong> with offline shell caching</li>
                    <li>&bull; Web App Manifest (<code className="bg-slate-200 px-1 rounded">manifest.json</code> &amp; <code className="bg-slate-200 px-1 rounded">manifest.ts</code>)</li>
                    <li>&bull; 3D Glassmorphic Icon (192px, 512px, Apple touch)</li>
                    <li>&bull; 1-Tap interactive installation prompt &amp; iOS guide</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>Mapping &amp; GPS Telemetry</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; <strong>OpenStreetMap &amp; Leaflet 1.9</strong></li>
                    <li>&bull; Free tile layer &mdash; zero Google Maps API fees</li>
                    <li>&bull; Safeguarded against <code className="bg-slate-200 px-1 rounded">_leaflet_pos</code> transition bugs</li>
                    <li>&bull; Live 6-stage agro-corridor highway tracking</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Cpu className="w-4 h-4 text-teal-600" />
                    <span>AI &amp; APMC Intelligence</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; Provider-abstracted <strong>AIService</strong></li>
                    <li>&bull; Historical APMC Mandi trend analysis</li>
                    <li>&bull; Computer vision crop quality scanner</li>
                    <li>&bull; 7-day and 30-day regional demand forecasting</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>Security &amp; Digital Escrow</span>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li>&bull; Razorpay digital escrow integration</li>
                    <li>&bull; Automated 2% platform fee calculation</li>
                    <li>&bull; Instant 2-hour settlement upon buyer inspection</li>
                    <li>&bull; Role-based authentication (Farmer, Buyer, Logistics)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Flow Diagram */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900">Hybrid Cloud Data Sync Workflow</h3>
              <p className="text-xs text-slate-600">
                How products created on any device remain permanently visible across isolated Vercel serverless containers and local development nodes.
              </p>

              <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-emerald-400 font-bold">1. Farmer Action:</div>
                <div className="pl-4">POST /api/products &rarr; Check session or auto-provision FarmerProfile</div>
                <div className="text-blue-400 font-bold mt-2">2. Dual Storage Write:</div>
                <div className="pl-4">&bull; Write to local Prisma (relational integrity, foreign keys)</div>
                <div className="pl-4">&bull; Write to Firebase Firestore via saveProductToFirestore() (global cloud persistence)</div>
                <div className="text-amber-400 font-bold mt-2">3. Consumer / Buyer Query:</div>
                <div className="pl-4">GET /api/products &rarr; Query Prisma + Query Firestore &rarr; Merge &amp; Deduplicate by ID</div>
                <div className="text-purple-400 font-bold mt-2">4. Result:</div>
                <div className="pl-4">&bull; Product is instantly visible to all buyers across any container or device.</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CORE MODULES & FEATURES                          */}
        {/* ======================================================== */}
        {activeTab === 'features' && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Platform Features &amp; Modules</h2>
                  <p className="text-xs text-slate-500">Comprehensive capabilities of KisanDirect</p>
                </div>
              </div>

              <div className="space-y-6 text-xs sm:text-sm">
                <div className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-300 transition">
                  <h3 className="font-bold text-emerald-800 text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>1. Farmgate Harvest Registration</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Farmers can list produce with variety specifications (e.g. Abhinav Hybrid Tomatoes, Lasalgaon Red Onions, GI-Tagged Alphonso Mangoes), available quantity, minimum order quantity, harvest date, location coordinates, and high-resolution photos.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-300 transition">
                  <h3 className="font-bold text-blue-800 text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>2. APMC Mandi Benchmark &amp; Price Transparency</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Every listing displays real-time government APMC modal pricing and retail market pricing. The interactive <em>Price Journey</em> tool reveals the exact economic cuts taken by intermediaries versus KisanDirect's 2% direct model.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-300 transition">
                  <h3 className="font-bold text-amber-800 text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <span>3. Cold-Chain Logistics &amp; Regional Hubs</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Integrated temperature-controlled cold consolidation hubs located in Pune Central APMC, Nashik Agro Cold Storage, Satara Farmers Terminal, and Kolhapur Hub. Real-time GPS route tracking with 6 milestone stages.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-300 transition">
                  <h3 className="font-bold text-purple-800 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span>4. Digital Escrow &amp; Dispute Protection</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Buyers lock funds in Razorpay escrow when initiating an order. Once the produce arrives at the destination and passes quality inspection, payouts are automatically credited directly to the farmer's bank account.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-300 transition">
                  <h3 className="font-bold text-teal-800 text-base flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-teal-600" />
                    <span>5. PWA 2.0 Offline Support</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Installed directly onto Android, iOS, and desktop home screens without app store downloads. Cached offline shells allow farmers with intermittent connectivity to view saved listings, order status, and local hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: COMPANY PROFILE & TEAM CREDITS                    */}
        {/* ======================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-10">
            {/* Company Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-500/30 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full">
                    Parent Organization
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
                    Company: AnoS
                  </h2>
                </div>
                <div className="glass-emerald px-4 py-2 rounded-2xl text-xs font-bold text-emerald-200 border border-emerald-400/40">
                  Agri-Tech &bull; Innovation Labs
                </div>
              </div>

              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                <strong>AnoS</strong> is a forward-thinking technology enterprise dedicated to building transformative digital products that democratize access, eliminate friction, and unlock radical economic efficiency in core Indian sectors.
              </p>
            </div>

            {/* Creators & Leadership Credit Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="border-b border-slate-200 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Engineering &amp; Product Leadership
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Project Lead: Kuber Narute &amp; Team
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  The visionary architects and engineers behind the conception, design, and execution of KisanDirect.
                </p>
              </div>

              {/* Team Members Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-emerald-200/80 rounded-2xl p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    KN
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Kuber Narute</h4>
                    <span className="text-xs font-bold text-emerald-700 block">Lead Architect, Product Visionary &amp; Engineering Lead</span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Company: AnoS</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Spearheaded the platform architecture, multi-container cloud synchronization strategy, algorithmic APMC pricing integration, and progressive web application implementation.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    AT
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">AnoS Team Mates &amp; Collaborators</h4>
                    <span className="text-xs font-bold text-blue-700 block">Core Development, Logistics &amp; Product Design</span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Company: AnoS</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Contributed across user interface design, Leaflet OpenStreetMap telemetry integration, agricultural domain modeling for Maharashtra APMC clusters, and quality assurance.
                  </p>
                </div>
              </div>

              {/* Dedication Statement */}
              <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-emerald-200 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span>Built For India's Annadata (Farmers)</span>
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Proudly designed and developed with precision by Kuber Narute and team at AnoS.
                  </p>
                </div>

                <Link
                  href="/marketplace"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition shrink-0"
                >
                  Explore The Platform
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
