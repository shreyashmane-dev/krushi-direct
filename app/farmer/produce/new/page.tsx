'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sprout,
  ArrowLeft,
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  Calendar,
  MapPin,
  Leaf,
  DollarSign,
} from 'lucide-react';
import AIPriceAssistant from '@/components/ai-price-assistant';
import AIQualityScanner from '@/components/ai-quality-scanner';

export default function NewProducePage() {
  const router = useRouter();

  // Form state
  const [cropName, setCropName] = useState('Tomato');
  const [categorySlug, setCategorySlug] = useState('vegetables');
  const [variety, setVariety] = useState('Abhinav Hybrid (Table & Cooking)');
  const [quantity, setQuantity] = useState(500);
  const [unit, setUnit] = useState('kg');
  const [grade, setGrade] = useState('A');
  const [pricePerKg, setPricePerKg] = useState(18);
  const [minOrderQty, setMinOrderQty] = useState(20);
  const [harvestDate, setHarvestDate] = useState('2026-09-07');
  const [availableDate, setAvailableDate] = useState('2026-09-07');
  const [expiryDays, setExpiryDays] = useState(8);
  const [farmLocation, setFarmLocation] = useState('Manchar, Pune, Maharashtra');
  const [description, setDescription] = useState(
    'Naturally ripened, firm, Grade-A red tomatoes harvested this morning. Ideal for commercial kitchens, salads, and curries with high shelf stability.'
  );
  const [isOrganic, setIsOrganic] = useState(true);
  const [certification, setCertification] = useState('PGS-India Certified Organic (MH-PUN-084)');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCameraUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          categorySlug,
          variety,
          quantity,
          unit,
          grade,
          pricePerKg,
          minOrderQty,
          harvestDate,
          availableDate,
          expiryDays,
          farmLocation,
          latitude: 19.0063,
          longitude: 73.9458,
          description,
          isOrganic,
          certification,
          images: [imageUrl],
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/farmer/produce');
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Unable to create listing. Please check quantity and price.');
      }
    } catch {
      alert('Network error creating listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/farmer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>Farmgate Produce Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">List Your Agricultural Harvest</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish produce directly to individual consumers, restaurants, retailers, and food processors.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Listing Published Successfully!</h4>
              <p className="text-xs text-emerald-700">Redirecting to your produce inventory...</p>
            </div>
          </div>
        )}

        {/* 1. AI Smart Assistants inline banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Price Assistant */}
          <AIPriceAssistant
            cropName={cropName}
            grade={grade}
            quantity={quantity}
            location={farmLocation}
            onApplyPrice={(suggested) => setPricePerKg(suggested)}
          />

          {/* AI Quality Scanner with Gemini Multimodal Vision */}
          <AIQualityScanner
            cropName={cropName}
            externalImageUrl={imageUrl}
            onApplyGrade={(g) => setGrade(g)}
            onApplyPrice={(suggested) => setPricePerKg(suggested)}
          />
        </div>

        {/* 2. Listing Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Crop Name</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Tomato, Onion, Potato"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Crop Category</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="vegetables">Fresh Vegetables</option>
                <option value="fruits">Fresh Fruits</option>
                <option value="grains-cereals">Grains & Cereals</option>
                <option value="spices">Spices & Condiments</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Variety / Cultivar</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Abhinav Hybrid, Lasalgaon Red"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measurement</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintals (100 kg)</option>
                <option value="crate">Crates (25 kg)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="A_PLUS">Grade A+ (Export Quality)</option>
                <option value="A">Grade A (Premium Commercial)</option>
                <option value="B">Grade B (Standard Market)</option>
                <option value="C">Grade C (Processing/Juicing)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Expected Price (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-emerald-500 rounded-xl p-3 text-xs font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Minimum Order Qty ({unit})</label>
              <input
                type="number"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Harvest Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Farm Location (Village / District)</label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="e.g. Manchar, Pune"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                required
              />
            </div>
          </div>

          {/* Organic & Certification */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOrganic"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="isOrganic" className="font-bold text-slate-800 flex items-center gap-1 cursor-pointer">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certified Organic Produce</span>
              </label>
            </div>

            {isOrganic && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Certification Authority / License No.</label>
                <input
                  type="text"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  placeholder="e.g. PGS-India, NPOP, Jaivik Bharat"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>
            )}
          </div>

          {/* Crop Photograph: Phone Camera / Gallery / URL */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">
              Crop Photograph (Phone Camera or Gallery)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imageUrl && (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-900">
                  <img src={imageUrl} alt="Crop Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 bg-black/75 text-white text-[9px] font-bold text-center py-0.5 rounded">
                    Preview
                  </span>
                </div>
              )}

              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="camera-capture"
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap with Phone Camera</span>
                  </label>
                  <input
                    type="file"
                    id="camera-capture"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraUpload}
                    className="hidden"
                  />

                  <label
                    htmlFor="file-gallery"
                    className="cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload from Device</span>
                  </label>
                  <input
                    type="file"
                    id="file-gallery"
                    accept="image/*"
                    onChange={handleCameraUpload}
                    className="hidden"
                  />
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description & Storage Instructions</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sprout className="w-5 h-5" />
            <span>{isSubmitting ? 'Publishing to Marketplace...' : 'Publish Produce Listing'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
