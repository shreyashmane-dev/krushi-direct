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
  QrCode,
  Package,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import WeatherWidget from '@/components/weather-widget';
import UpiQrModal from '@/components/upi-qr-modal';
import WhatsAppShare from '@/components/whatsapp-share';
import { ProfitCalculator } from '@/components/profit-calculator';
import CropDiseaseScanner from '@/components/crop-disease-scanner';
import SmartRoutePlanner from '@/components/logistics/smart-route-planner';
import AIQualityScanner from '@/components/ai-quality-scanner';
import MiddlemanSimulator from '@/components/middleman-simulator';
import LogisticsCorridorRadar from '@/components/logistics-corridor-radar';

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
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(INITIAL_FEATURED_PRODUCTS);
  const [activeRole, setActiveRole] = useState<'FARMER' | 'CONSUMER' | 'RESTAURANT' | 'RETAILER'>('FARMER');
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);
  const [selectedEscrowProduct, setSelectedEscrowProduct] = useState<any | null>(null);
  const [homeToolTab, setHomeToolTab] = useState<'LOGISTICS' | 'DISEASE' | 'GRADING' | 'PROFIT'>('LOGISTICS');

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
      tag: language === 'mr' ? 'शेतकरी व एफपीओ साठी' : language === 'hi' ? 'किसानों और एफपीओ के लिए' : 'For Farmers & FPOs',
      title: language === 'mr' ? 'थेट शेतातून योग्य दरात शेतमाल विका' : language === 'hi' ? 'खेत से सीधे सही दाम पर उपज बेचें' : 'Sell Directly at Fair Farmgate Rates',
      desc: language === 'mr' 
        ? 'दलालांचे ३५% ते ४५% कमिशन वाचवा. एपीएमसी मंडी एआय मार्गदर्शनाने स्वतःचे दर ठरवा आणि सुरक्षित एस्क्रो द्वारे थेट बँक खात्यात पैसे मिळवा.'
        : language === 'hi'
        ? 'बिचौलियों का 35% से 45% कमीशन बचाएं। एपीएमसी मंडी एआई मार्गदर्शन से अपने भाव तय करें और सीधे बैंक खाते में भुगतान प्राप्त करें।'
        : 'Keep the 35% to 45% margin that middleman cartels usually take. Set your own prices with APMC mandi AI guidance, accept buyer bids, and get paid straight to your bank account via digital escrow.',
      bullets: language === 'mr' 
        ? ['०% लिलाव कमिशन फी', 'माल पोहोचल्यावर २ तासांत बँक खात्यात पैसे जमा', 'हॉटेल्स आणि सुपरमार्ट्स कडून थेट पारदर्शक डिजिटल बोली']
        : language === 'hi'
        ? ['0% नीलामी कमीशन शुल्क', 'डिलीवरी के 2 घंटे के भीतर सीधे बैंक में एस्क्रो ट्रांसफर', 'रेस्तरां और सुपरमार्केट्स से पारदर्शी डिजिटल बोलियां']
        : [
            'Zero commission auction fees',
            'Direct escrow deposit in your bank within 2 hours of delivery',
            'Transparent bidding from restaurants and supermarkets',
          ],
      ctaText: t.sellHarvest,
      ctaUrl: '/farmer/produce/new',
      demoUserId: 'user-farmer-ramesh',
    },
    CONSUMER: {
      tag: language === 'mr' ? 'कुटुंबे आणि ग्राहकांसाठी' : language === 'hi' ? 'परिवारों और उपभोक्ताओं के लिए' : 'For Households & Individuals',
      title: language === 'mr' ? 'थेट शेतातून ताजा भाजीपाला घरात' : language === 'hi' ? 'खेत से सीधे ताज़ी सब्जियां घर तक' : 'Farm-Fresh Produce Delivered Direct',
      desc: language === 'mr'
        ? 'त्याच सकाळी काढलेला भाजीपाला आणि फळे मिळवा. कोणतेही कृत्रिम वॅक्स नाही, कोल्ड स्टोरेजचा विलंब नाही आणि अतिरिक्त किरकोळ नफेखोरी नाही.'
        : language === 'hi'
        ? 'उसी सुबह तोड़ी गई सब्जियां और फल सीधे अपने घर पाएं। कोई रासायनिक मोम नहीं, कोई पुराना कोल्ड स्टोरेज नहीं।'
        : 'Get vegetables and fruits harvested that morning from verified Maharashtra farms. No artificial waxing, no cold-storage delay, and no 100% retail grocery markup.',
      bullets: language === 'mr'
        ? ['काढणीनंतर २४ ते ३६ तासांत घरपोच', 'शेतकऱ्याचे नाव, गाव आणि काढणीची तारीख स्पष्ट माहिती', 'सेंद्रिय व प्रमाणित शेतमालाचे पर्याय']
        : language === 'hi'
        ? ['कटाई के 24 से 36 घंटे में डिलीवरी', 'किसान का नाम, गांव और तारीख की पूरी जानकारी', 'प्रमाणित जैविक उत्पाद उपलब्ध']
        : [
            'Delivered within 24 to 36 hours of harvest',
            'Know the exact farmer, village, and harvest date',
            'Certified organic and chemical-tested options',
          ],
      ctaText: t.browseProduce,
      ctaUrl: '/marketplace',
      demoUserId: 'user-consumer-priya',
    },
    RESTAURANT: {
      tag: language === 'mr' ? 'हॉटेल्स आणि व्यावसायिक किचनसाठी' : language === 'hi' ? 'रेस्तरां और व्यावसायिक रसोई के लिए' : 'For Restaurants & Commercial Kitchens',
      title: language === 'mr' ? '२५% बचतीसह उच्च दर्जाचा शेतमाल' : language === 'hi' ? '25% बचत के साथ उच्चतम ग्रेड उत्पाद' : 'Consistent Wholesale Quality with 25% Savings',
      desc: language === 'mr'
        ? 'सकाळी ठरलेल्या वेळेत थेट शेतामधून ग्रेड-ए शेतमाल मिळवा. पहाटेच्या मंडीच्या फेऱ्या बंद करा आणि भाजीपाल्यावरील खर्च २०% ते २८% कमी करा.'
        : language === 'hi'
        ? 'सुबह निर्धारित समय पर ग्रेड-ए उत्पाद प्राप्त करें। रोज़ की मंडी भागदौड़ बंद करें और खरीद लागत 20% से 28% घटाएं।'
        : 'Source uniform Grade-A produce with scheduled morning delivery. Eliminate daily early-morning mandi visits and cut food procurement costs by 20% to 28%.',
      bullets: language === 'mr'
        ? ['प्रमाणित आकार आणि किचन ग्रेडिंग', 'जीएसटी (GST) कर बीजक पावती', 'विश्वसनीय ४°C शीत साखळी वाहतूक व्यवस्था']
        : language === 'hi'
        ? ['सटीक ग्रेड और आकार मानकीकरण', 'जीएसटी युक्त डिजिटल बिलिंग', 'विश्वसनीय कोल्ड चेन परिवहन']
        : [
            'Standardized culinary grades and sizes',
            'GST compliant digital invoices',
            'Reliable 4°C cold chain transportation',
          ],
      ctaText: language === 'mr' ? 'घाऊक शेतमाल खरेदी' : language === 'hi' ? 'थोक खरीद देखें' : 'Explore Commercial Procurement',
      ctaUrl: '/marketplace',
      demoUserId: 'user-buyer-greenbite',
    },
    RETAILER: {
      tag: language === 'mr' ? 'सुपरमार्केट्स आणि प्रक्रियादारांसाठी' : language === 'hi' ? 'सुपरमार्केट्स और एग्रो-प्रोसेसर्स के लिए' : 'For Retail Supermarkets & Agro-Processors',
      title: language === 'mr' ? 'हबमधून अनेक टनांचा थेट पुरवठा' : language === 'hi' ? 'रीजनल हब से भारी टन आपूर्ति' : 'Multi-Ton Bulk Supply from Regional Hubs',
      desc: language === 'mr'
        ? 'पुणे, नाशिक, सातारा आणि कोल्हापूर येथील शीत केंद्रांवरून ५ ते ५० टन क्षमतेचे ट्रकलोड्स स्वयंचलित गुणवत्ता तपासणी अहवालासह मिळवा.'
        : language === 'hi'
        ? 'पुणे, नासिक, सतारा और कोल्हापुर के तापमान नियंत्रित हब से 5 से 50 टन की सीधी आपूर्ति प्राप्त करें।'
        : 'Procure 5-ton to 50-ton truckloads aggregated at temperature-controlled hubs in Pune, Nashik, Satara, and Kolhapur with automated quality inspection reports.',
      bullets: language === 'mr'
        ? ['शेतकरी समूहांसोबत थेट शेतभाव करार', 'प्रमाणित गुणवत्ता तपासणी प्रमाणपत्रे', 'एकात्मिक प्रादेशिक शीत साठवणूक']
        : language === 'hi'
        ? ['सत्यापित उत्पादक समूहों के साथ अनुबंध', 'मानकीकृत गुणवत्ता प्रमाण पत्र', 'समेकित क्षेत्रीय शीत भंडारण']
        : [
            'Direct farmgate contracts with verified grower clusters',
            'Standardized QA grading certificates',
            'Consolidated freight and regional cold storage',
          ],
      ctaText: language === 'mr' ? 'प्रक्रियादार पोर्टल' : language === 'hi' ? 'प्रोसेसर पोर्टल' : 'Access Processor Bulk Portal',
      ctaUrl: '/processor/dashboard',
      demoUserId: 'user-retailer-omkar',
    },
  };

  const currentRole = roleDetails[activeRole];
  const dashboardUrl = getRoleDashboardUrl(user?.role);

  return (
    <div className="space-y-16 pb-16">
      {/* Real-time Agricultural Mandi & Logistics Ticker */}
      <div className="bg-slate-950 text-slate-200 border-b border-emerald-500/30 py-2.5 overflow-hidden select-none -mt-4 shadow-inner">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400 font-black tracking-wider uppercase font-mono pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE AGRO MANDI &amp; LOGISTICS TICKER:
          </span>
          <span className="flex items-center gap-1">🍅 Tomato (Pune Market Yard): <strong className="text-white font-bold">₹18.00/kg</strong> <span className="text-emerald-400 font-bold font-mono">+5.2%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🧅 Lasalgaon Red Onion: <strong className="text-white font-bold">₹24.00/kg</strong> <span className="text-rose-400 font-bold font-mono">-1.8%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🥭 Alphonso Mango (Ratnagiri): <strong className="text-white font-bold">₹140.00/kg</strong> <span className="text-emerald-400 font-bold font-mono">+8.4%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🥔 Satara Table Potato: <strong className="text-white font-bold">₹22.00/kg</strong> <span className="text-emerald-400 font-bold font-mono">+2.1%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🌶️ G4 Green Chilli (Sangli): <strong className="text-white font-bold">₹55.00/kg</strong> <span className="text-emerald-400 font-bold font-mono">+3.4%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1 text-teal-300">🚛 NH60 &amp; NH48 Cold-Chain Pool: <strong>6 Daily Dispatches Active</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1 text-emerald-300">⚡ Digital Escrow Payout SLA: <strong>&lt; 2 Hours Verified</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🍅 Tomato (Pune): <strong className="text-white font-bold">₹18.00/kg</strong> <span className="text-emerald-400 font-bold font-mono">+5.2%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🧅 Lasalgaon Red Onion: <strong className="text-white font-bold">₹24.00/kg</strong> <span className="text-rose-400 font-bold font-mono">-1.8%</span></span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1">🥭 Alphonso Mango: <strong className="text-white font-bold">₹140.00/kg</strong></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 0. LOGGED-IN WORKSPACE BANNER (Shown when user is active) */}
      {/* ======================================================== */}
      {user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    {language === 'mr' ? `स्वागत आहे, ${user.name}` : language === 'hi' ? `स्वागत है, ${user.name}` : `Welcome, ${user.name}`}
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80">
                  {user.farmerProfile?.farmLocation || user.buyerProfile?.city || 'Maharashtra, India'} &bull; {language === 'mr' ? 'सक्रिय खाते' : language === 'hi' ? 'सक्रिय खाता' : 'Active Profile'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <Link
                href={dashboardUrl}
                className="flex-1 md:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-950" />
                <span>{language === 'mr' ? 'माझा डॅशबोर्ड' : language === 'hi' ? 'मेरा डैशबोर्ड' : 'Open Dashboard'}</span>
              </Link>
              {user.role === 'FARMER' ? (
                <Link
                  href="/farmer/produce/new"
                  className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t.sellProduce}</span>
                </Link>
              ) : (
                <Link
                  href="/marketplace"
                  className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>{t.browseProduce}</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 1. HERO SECTION: CRISP, HIGH-CONTRAST, EDITORIAL         */}
      {/* ======================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Sharp Editorial Headline & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                {t.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {t.heroSubheadline}
              </p>

              {/* Primary Actions */}
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/marketplace"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-sm transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.browseProduce}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/farmer/produce/new"
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.sellHarvest}</span>
                  </Link>

                  <Link
                    href="/logistics"
                    className="bg-teal-700 hover:bg-teal-600 text-white font-black px-4 py-3 rounded-xl shadow-sm transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs sm:text-sm border border-teal-500/40"
                  >
                    <Truck className="w-4 h-4 text-teal-300" />
                    <span>Logistics Pooling</span>
                    <span className="text-[9px] bg-teal-400 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono uppercase">
                      Save 60%
                    </span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/crop-lens"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs"
                  >
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>AI Crop Disease Lens</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                      Gemini 2.0
                    </span>
                  </Link>

                  <Link
                    href="/crop-grading"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Quality Grading</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                      AGMARK
                    </span>
                  </Link>

                  <Link
                    href="/profit-calculator"
                    className="bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-bold px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 transition hover:scale-[1.02] flex items-center justify-center gap-2 text-xs"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Profit Calculator</span>
                  </Link>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="pt-2 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                    +42%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {t.farmerProfit}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
                    -26%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {t.buyerSavings}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                    &lt; 2h
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {t.escrowPayout}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Real Farmer Vignette Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800"
                    alt="Maharashtra Farmer in Field"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.verifiedProducer}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        Ramesh Patil
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manchar, Pune &bull; 8.5 Acres
                      </p>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black px-2.5 py-1 rounded-md">
                      4.9 &starf;
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    &ldquo;{language === 'mr' 
                      ? 'मी आधी टोमॅटो वाशी आणि पुणे मंडीत पाठवायचो. १८% कमिशन आणि तोलमापात नुकसान व्हायचे. किसानडायरेक्टमुळे मला थेट मुंबईच्या सुपरमार्केट्सकडून २०% जास्तीचा भाव मिळतो आणि २ तासांत बँक जमा होते.'
                      : language === 'hi'
                      ? 'पहले टमाटर मंडी में बेचने पर 18% दलाली कट जाती थी। किसानडायरेक्ट से मुझे सीधे मुंबई के सुपरमार्केट्स से 20% अधिक भाव मिलता है और तुरंत भुगतान आता है।'
                      : 'I used to lose 18% to commissions and transport deductions at Pune APMC. With KisanDirect, my tomatoes sell directly to Mumbai supermarkets at +20% higher rates with instant escrow release.'}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 1A. INSTITUTIONAL ACCREDITATION & TRUST RIBBON           */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">Smart India Hackathon</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Grand Finale Finalist 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">e-NAM Interoperable</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Direct APMC Mandi Sync</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">RBI Escrow Guard</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Same-Day Payout SLA &lt;2h</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">Cold-Chain Reefer</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ISO 22000 &bull; 4°C Monitored</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 1B. LIVE AGRO WEATHER & ADVISORY WIDGET (OPEN-METEO)      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WeatherWidget />
      </section>

      {/* ======================================================== */}
      {/* 2. PERSONA-BASED BENEFIT SELECTOR                       */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {/* Persona Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 dark:border-slate-800">
            {(
              [
                { role: 'FARMER', label: t.roleFarmer, icon: Sprout },
                { role: 'CONSUMER', label: t.roleConsumer, icon: ShoppingBag },
                { role: 'RESTAURANT', label: t.roleRestaurant, icon: Utensils },
                { role: 'RETAILER', label: t.roleRetailer, icon: Store },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeRole === tab.role;
              return (
                <button
                  key={tab.role}
                  onClick={() => setActiveRole(tab.role)}
                  className={`p-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition border-b-2 ${
                    isSelected
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Persona Content Body */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                {currentRole.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {currentRole.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentRole.desc}
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                {currentRole.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
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
            {language === 'mr' ? 'पारदर्शक बाजार अर्थशास्त्र' : language === 'hi' ? 'पारदर्शी बाज़ार अर्थशास्त्र' : 'Transparent Market Economics'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t.mandiComparison}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.mandiSubtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-mono font-bold text-slate-500">
                <tr>
                  <th className="p-4">{t.colCrop}</th>
                  <th className="p-4">{t.colMandi}</th>
                  <th className="p-4 text-rose-600">{t.colTraderPrice}</th>
                  <th className="p-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40">
                    {t.colFarmgatePrice}
                  </th>
                  <th className="p-4">{t.colRetailPrice}</th>
                  <th className="p-4 text-right">{t.colFarmerBenefit}</th>
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
                          +{gain}% {language === 'mr' ? 'नफा' : language === 'hi' ? 'मुनाफा' : 'Income'}
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
      {/* 3A. INTERACTIVE MIDDLEMAN PROFIT ELIMINATOR CALCULATOR  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MiddlemanSimulator />
      </section>

      {/* ======================================================== */}
      {/* 3B. INTERACTIVE AGRI-INTELLIGENCE OPERATING SYSTEM HUB  */}
      {/* ======================================================== */}
      <section id="ai-agri-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Interactive AI Operating System</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded font-black">
                  Live Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Live Agricultural Intelligence Suite
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience smart logistics corridor pooling, multimodal crop disease diagnostics, commercial quality grading, and direct farmgate ROI.
              </p>
            </div>

            {/* Hub Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {[
                { id: 'LOGISTICS', label: '🚛 Logistics Pooling' },
                { id: 'DISEASE', label: '🌿 Crop Disease Lens' },
                { id: 'GRADING', label: '⚖️ Quality Grading' },
                { id: 'PROFIT', label: '💰 Profit Calculator' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setHomeToolTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    homeToolTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab View */}
          <div>
            {homeToolTab === 'LOGISTICS' && <SmartRoutePlanner />}
            {homeToolTab === 'DISEASE' && <CropDiseaseScanner />}
            {homeToolTab === 'GRADING' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Inspecting produce against APMC AGMARK commercial specifications using Google Gemini Multimodal Vision.
                  </span>
                  <Link href="/crop-grading" className="text-xs font-black text-emerald-700 dark:text-emerald-400 underline">
                    Open Dedicated Studio &rarr;
                  </Link>
                </div>
                <AIQualityScanner cropName="Tomato" />
              </div>
            )}
            {homeToolTab === 'PROFIT' && <ProfitCalculator />}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3D. SMART LOGISTICS POOLING & AI QUALITY GRADING         */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logistics Pooling Spotlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-teal-500/30 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Smart Agro Corridor
                </span>
                <span className="text-xs text-teal-200">Save 40%–60%</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Logistics Pooling &amp; Multi-Stop Routes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your farm pickup location with commercial buyers in Pune, Mumbai, and Navi Mumbai. Pool truck space with fellow farmers along NH60, NH48, and NH65 to slash freight rates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 p-3 rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Solo Fare</span>
                  <span className="font-bold line-through text-slate-400">₹2,800</span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-300 block font-bold uppercase">Pooled Fare</span>
                  <span className="font-black text-emerald-400">₹1,150</span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-300 block font-bold uppercase">Corridors</span>
                  <span className="font-bold text-white">6 Daily</span>
                </div>
              </div>

              <Link
                href="/logistics"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
              >
                <Truck className="w-4 h-4" />
                <span>Calculate Pooled Route &amp; Savings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* AI Quality Grading Studio Spotlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-emerald-500/30 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Gemini Vision 2.0
                </span>
                <span className="text-xs text-emerald-200">APMC &amp; AGMARK</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                AI Automated Produce Quality Grading
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan harvested fruits and vegetables with your phone camera. Gemini Computer Vision instantly computes commercial grades (A+, A, B, C), defect percentage, color uniformity, and fair farmgate valuation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 p-3 rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Export Tier</span>
                  <span className="font-black text-emerald-400">Grade A+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Defect Margin</span>
                  <span className="font-bold text-white">&lt;3%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">AI Accuracy</span>
                  <span className="font-bold text-emerald-400">96.4%</span>
                </div>
              </div>

              <Link
                href="/crop-grading"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Quality Grading Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3E. LIVE LOGISTICS CORRIDOR RADAR & TRUCK POOLS          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LogisticsCorridorRadar />
      </section>

      {/* ======================================================== */}
      {/* 4. VERIFIED FRESH HARVEST SHOWCASE                      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t.verifiedLotsSubtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.verifiedLots}
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t.viewAllLots}</span>
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
                    <span className="font-bold">{p.quantity} {p.unit || 'kg'} {t.available}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs transition block"
                  >
                    {t.viewDetails}
                  </Link>

                  <button
                    onClick={() => setSelectedEscrowProduct(p)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t.payWithUPI}</span>
                  </button>
                </div>

                <WhatsAppShare
                  cropName={p.cropName}
                  variety={p.variety}
                  pricePerKg={p.pricePerKg}
                  farmerName={p.farmer?.user?.name || 'Maharashtra Farmer'}
                  location={p.farmLocation}
                  productId={p.id}
                  unit={p.unit}
                />
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
            {t.directPipeline}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t.howItWorksHeadline}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: t.step1Title,
              desc: t.step1Desc,
            },
            {
              step: '02',
              title: t.step2Title,
              desc: t.step2Desc,
            },
            {
              step: '03',
              title: t.step3Title,
              desc: t.step3Desc,
            },
            {
              step: '04',
              title: t.step4Title,
              desc: t.step4Desc,
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
              {t.anosBadge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              {t.anosTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {t.anosDesc}
            </p>
          </div>

          <Link
            href="/documentation"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <span>{t.readDocs}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. INSTANT UPI ESCROW QR MODAL (ALWAYS MOUNTED)         */}
      {/* ======================================================== */}
      {selectedEscrowProduct && (
        <UpiQrModal
          isOpen={!!selectedEscrowProduct}
          onClose={() => setSelectedEscrowProduct(null)}
          amount={selectedEscrowProduct.pricePerKg * (selectedEscrowProduct.minOrderQty || 20)}
          productName={`${selectedEscrowProduct.cropName} (${selectedEscrowProduct.minOrderQty || 20} ${selectedEscrowProduct.unit || 'kg'} crate)`}
          farmerName={selectedEscrowProduct.farmer?.user?.name || 'Maharashtra Farmer'}
        />
      )}
    </div>
  );
}
