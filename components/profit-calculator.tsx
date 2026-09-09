'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  Percent,
  Layers
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface CropPreset {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  defaultPricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
}

const CROP_PRESETS: CropPreset[] = [
  { id: 'onion', nameEn: 'Lasalgaon Onion', nameMr: 'लासलगाव कांदा', nameHi: 'लासलगांव प्याज', defaultPricePerQuintal: 2400, minPrice: 1000, maxPrice: 6000, unit: 'Quintal' },
  { id: 'tomato', nameEn: 'Hybrid Tomato', nameMr: 'हायब्रिड टोमॅटो', nameHi: 'हाइब्रिड टमाटर', defaultPricePerQuintal: 1800, minPrice: 800, maxPrice: 5000, unit: 'Quintal' },
  { id: 'soybean', nameEn: 'Yellow Soybean', nameMr: 'पिवळी सोयाबीन', nameHi: 'पीली सोयाबीन', defaultPricePerQuintal: 4600, minPrice: 3200, maxPrice: 7500, unit: 'Quintal' },
  { id: 'mango', nameEn: 'Ratnagiri Alphonso', nameMr: 'रत्नागिरी हापूस आंबा', nameHi: 'रत्नागिरी हापुस आम', defaultPricePerQuintal: 14000, minPrice: 6000, maxPrice: 28000, unit: 'Quintal' },
  { id: 'pomegranate', nameEn: 'Bhagwa Pomegranate', nameMr: 'भगवा डाळिंब', nameHi: 'भगवा अनार', defaultPricePerQuintal: 8500, minPrice: 4000, maxPrice: 16000, unit: 'Quintal' },
  { id: 'cotton', nameEn: 'Medium Staple Cotton', nameMr: 'मध्यम लांब कापूस', nameHi: 'कपास', defaultPricePerQuintal: 6800, minPrice: 4500, maxPrice: 9500, unit: 'Quintal' },
];

export function ProfitCalculator() {
  const { language: lang, t } = useLanguage();
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(40);
  
  const currentCrop = useMemo(() => {
    return CROP_PRESETS.find(c => c.id === selectedCropId) || CROP_PRESETS[0];
  }, [selectedCropId]);

  const [pricePerQuintal, setPricePerQuintal] = useState<number>(currentCrop.defaultPricePerQuintal);

  // When crop changes, update price to default
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const crop = CROP_PRESETS.find(c => c.id === cropId);
    if (crop) {
      setPricePerQuintal(crop.defaultPricePerQuintal);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const grossMandi = quantityQuintals * pricePerQuintal;

    // Traditional Mandi cuts
    const agentCommission = Math.round(grossMandi * 0.085); // 8.5% Adat
    const mandiCess = Math.round(grossMandi * 0.035); // 3.5% Market Cess
    const hamaliUnloading = Math.round(quantityQuintals * 85); // ₹85 per quintal handling/weighment
    const transitSpoilageLoss = Math.round(grossMandi * 0.05); // 5% unofficial deduction/spoilage
    const mandiTotalDeductions = agentCommission + mandiCess + hamaliUnloading + transitSpoilageLoss;
    const mandiNetPayout = Math.max(0, grossMandi - mandiTotalDeductions);

    // KisanDirect Model
    // Direct buyers pay 10% premium for graded, certified farmgate produce
    const directPricePremium = 1.10;
    const kisanGross = Math.round(grossMandi * directPricePremium);
    const kisanPlatformFee = 0; // 0% commission for farmers!
    const kisanNetPayout = kisanGross - kisanPlatformFee;

    const extraGain = kisanNetPayout - mandiNetPayout;
    const percentageIncrease = mandiNetPayout > 0 ? ((extraGain / mandiNetPayout) * 100).toFixed(1) : '0';

    return {
      grossMandi,
      agentCommission,
      mandiCess,
      hamaliUnloading,
      transitSpoilageLoss,
      mandiTotalDeductions,
      mandiNetPayout,
      kisanGross,
      kisanNetPayout,
      extraGain,
      percentageIncrease
    };
  }, [quantityQuintals, pricePerQuintal]);

  const cropTitle = lang === 'mr' ? currentCrop.nameMr : lang === 'hi' ? currentCrop.nameHi : currentCrop.nameEn;

  const handleShareResult = () => {
    const text = encodeURIComponent(
      `🌾 *KisanDirect Mandi Disintermediation Calculator*\n` +
      `Crop: ${cropTitle}\n` +
      `Quantity: ${quantityQuintals} Quintals (${quantityQuintals * 100} kg)\n` +
      `Traditional APMC Mandi Payout: ₹${calculations.mandiNetPayout.toLocaleString('en-IN')}\n` +
      `KisanDirect Farmgate Payout: ₹${calculations.kisanNetPayout.toLocaleString('en-IN')}\n` +
      `💰 *Extra Net Profit: +₹${calculations.extraGain.toLocaleString('en-IN')} (+${calculations.percentageIncrease}%)*\n` +
      `⚡ Payment received in 2 hours via UPI Escrow without middlemen deductions!\n` +
      `Calculate yours: ${typeof window !== 'undefined' ? window.location.origin : 'https://kisandirect.com'}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background ambient decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-stone-800 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 border border-emerald-600/20 dark:border-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {lang === 'mr' ? 'नफा व मध्यस्थ बचत कॅल्क्युलेटर' : lang === 'hi' ? 'मुनाफा और बिचौलिया बचत कैलकुलेटर' : 'Direct Farmgate Profit Calculator'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            {lang === 'mr' ? 'पारंपरिक बाजार समिती vs किसानडायरेक्ट नफा' : lang === 'hi' ? 'पारंपरिक मंडी vs किसानडायरेक्ट मुनाफा' : 'APMC Mandi vs Direct Farmgate Yield'}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
            {lang === 'mr' 
              ? 'दलाली (आडत), हमाली आणि तोलमाप कपात वाचवून थेट ०% कमिशनवर शेतमालाची विक्री करा.' 
              : lang === 'hi'
              ? 'दलाली (आढ़त), हम्माली और तोल कटौतियां बचाकर सीधे 0% कमीशन पर अपनी फसल बेचें।'
              : 'Calculate how much extra take-home revenue you earn by bypassing middleman cartels & delayed credit.'}
          </p>
        </div>

        <button
          onClick={handleShareResult}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-semibold shadow-sm transition-all self-start md:self-center"
        >
          <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {lang === 'mr' ? 'WhatsApp वर शेअर करा' : lang === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share Estimate'}
        </button>
      </div>

      {/* Interactive Controls & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 relative z-10">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Crop Selector Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
              {lang === 'mr' ? '१. पीक निवडा' : lang === 'hi' ? '१. फसल चुनें' : '1. Select Crop'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CROP_PRESETS.map((crop) => {
                const isSelected = crop.id === selectedCropId;
                const label = lang === 'mr' ? crop.nameMr : lang === 'hi' ? crop.nameHi : crop.nameEn;
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleCropChange(crop.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-white dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/80 hover:border-emerald-400'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-stone-600 dark:text-stone-400">
                {lang === 'mr' ? '२. उत्पादन प्रमाण (क्विंटल)' : lang === 'hi' ? '२. उत्पादन मात्रा (क्विंटल)' : '2. Estimated Harvest Volume'}
              </span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {quantityQuintals} Quintals <span className="text-xs font-normal text-stone-500">({quantityQuintals * 100} kg)</span>
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>5 Quintals</span>
              <span>100 Quintals</span>
              <span>250 Quintals</span>
            </div>
          </div>

          {/* Price Per Quintal Slider */}
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-stone-600 dark:text-stone-400">
                {lang === 'mr' ? '३. अपेक्षित बाजार भाव (₹/क्विंटल)' : lang === 'hi' ? '३. अपेक्षित बाजार भाव (₹/क्विंटल)' : '3. Expected Mandi Rate'}
              </span>
              <span className="text-base font-black text-stone-900 dark:text-white font-mono">
                ₹{pricePerQuintal.toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-500">/ Qtl</span>
              </span>
            </div>
            <input
              type="range"
              min={currentCrop.minPrice}
              max={currentCrop.maxPrice}
              step="50"
              value={pricePerQuintal}
              onChange={(e) => setPricePerQuintal(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>₹{currentCrop.minPrice}</span>
              <span>₹{Math.round((currentCrop.minPrice + currentCrop.maxPrice) / 2)}</span>
              <span>₹{currentCrop.maxPrice}</span>
            </div>
          </div>

          {/* Prompt CTA */}
          <Link
            href="/farmer/produce/new"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{lang === 'mr' ? 'हा माल थेट लिस्ट करा' : lang === 'hi' ? 'यह फसल सीधे लिस्ट करें' : 'Post Direct Harvest Lot'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Comparative Ledger (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Net Gain Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  {lang === 'mr' ? 'थेट विक्रीतून अतिरिक्त निव्वळ फायदा' : lang === 'hi' ? 'सीधे बिक्री से अतिरिक्त शुद्ध लाभ' : 'Net Extra Farmer Take-Home'}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                    +₹{calculations.extraGain.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-amber-400 text-stone-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                    +{calculations.percentageIncrease}%
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1">
                  {lang === 'mr'
                    ? 'हा पैसा दलाल, आडत्यांना न देता थेट तुमच्या बँक खात्यात २ तासांत जमा होतो.'
                    : lang === 'hi'
                    ? 'यह राशि बिचौलियों को न जाकर सीधे आपके खाते में २ घंटे में क्रेडिट होती है।'
                    : 'Real profit staying in your pocket through 0% commissions and premium direct institutional contracts.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center sm:text-right shrink-0">
                <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-medium">
                  {lang === 'mr' ? 'पेमेंट गती' : lang === 'hi' ? 'भुगतान गति' : 'Payment Settlement'}
                </div>
                <div className="text-lg font-black text-amber-300 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <Clock className="w-4 h-4" /> &lt; 2 Hours
                </div>
                <div className="text-[10px] text-emerald-200">
                  {lang === 'mr' ? 'मंडीत १५-३० दिवस लागतात' : lang === 'hi' ? 'मंडी में १५-३० दिन लगते हैं' : 'vs 15-30 days in APMC'}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Cards: Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Traditional Mandi */}
            <div className="bg-white dark:bg-stone-800/90 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    {lang === 'mr' ? 'पारंपरिक बाजार समिती' : lang === 'hi' ? 'पारंपरिक मंडी (APMC)' : 'Traditional Mandi'}
                  </h4>
                </div>
                <span className="text-[11px] text-red-600 dark:text-red-400 font-mono font-bold">
                  {calculations.grossMandi > 0 ? `-${((calculations.mandiTotalDeductions / calculations.grossMandi) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>{lang === 'mr' ? 'एकूण विक्री किंमत' : lang === 'hi' ? 'सकल मंडी मूल्य' : 'Gross Value'}:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">₹{calculations.grossMandi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>- {lang === 'mr' ? 'आडत / कमिशन (८.५%)' : lang === 'hi' ? 'आढ़त / कमीशन (८.५%)' : 'Middleman Cut (8.5%)'}:</span>
                  <span className="font-mono">-₹{calculations.agentCommission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>- {lang === 'mr' ? 'बाजार सेस (३.५%)' : lang === 'hi' ? 'मंडी शुल्क (३.५%)' : 'Mandi Cess (3.5%)'}:</span>
                  <span className="font-mono">-₹{calculations.mandiCess.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>- {lang === 'mr' ? 'हमाली व तोलमाप' : lang === 'hi' ? 'हम्माली और तौलाई' : 'Labor & Weighing'}:</span>
                  <span className="font-mono">-₹{calculations.hamaliUnloading.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>- {lang === 'mr' ? 'वाहतूक घट (५%)' : lang === 'hi' ? 'वजन घट / नुकसान' : 'Transit Weigh Loss (5%)'}:</span>
                  <span className="font-mono">-₹{calculations.transitSpoilageLoss.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-stone-200 dark:border-stone-700 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'mr' ? 'शेतकऱ्याला मिळणारे' : lang === 'hi' ? 'किसान को प्राप्ति' : 'Farmer Payout'}:
                </span>
                <span className="text-sm font-black text-stone-900 dark:text-white font-mono">
                  ₹{calculations.mandiNetPayout.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Right: KisanDirect Model */}
            <div className="bg-white dark:bg-stone-800/90 border-2 border-emerald-500 dark:border-emerald-500/80 rounded-2xl p-4 shadow-md space-y-3 relative">
              <div className="absolute -top-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                {lang === 'mr' ? 'शिफारस' : lang === 'hi' ? 'अनुशंसित' : 'Recommended'}
              </div>

              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    KisanDirect Farmgate
                  </h4>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  +10% Premium
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>{lang === 'mr' ? 'प्रमाणित शेतमाल दर' : lang === 'hi' ? 'ग्रेडिंग प्रमाणित दर' : 'Graded Contract Value'}:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">₹{calculations.kisanGross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>✓ {lang === 'mr' ? 'शेतकरी कमिशन' : lang === 'hi' ? 'किसान कमीशन' : 'Farmer Platform Cut'}:</span>
                  <span className="font-mono font-bold">₹0 (0%)</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>✓ {lang === 'mr' ? 'डिजिटल तोलमाप हमी' : lang === 'hi' ? 'डिजिटल तौल सुरक्षा' : 'Certified Weighment'}:</span>
                  <span className="font-mono font-bold">100% Secure</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>✓ {lang === 'mr' ? 'एस्क्रो सुरक्षित पेमेंट' : lang === 'hi' ? 'एस्क्रो सुरक्षित भुगतान' : 'Escrow Collateral'}:</span>
                  <span className="font-mono font-bold">Bank-Backed</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>✓ {lang === 'mr' ? 'थेट शेतातून उचल' : lang === 'hi' ? 'खेत से सीधी उठाई' : 'Farmgate Pickup'}:</span>
                  <span className="font-mono font-bold">Included</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-800 flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-950/20 -mx-4 -mb-4 p-4 rounded-b-2xl">
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  {lang === 'mr' ? 'थेट बँक खात्यात जमा' : lang === 'hi' ? 'सीधे खाते में जमा' : 'Direct Bank Payout'}:
                </span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  ₹{calculations.kisanNetPayout.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
