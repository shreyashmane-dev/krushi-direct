'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Leaf, ArrowRight, Upload } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface DiagnosticResult {
  diseaseName: string;
  marathiName: string;
  crop: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  symptoms: string[];
  organicRemedy: string;
  chemicalRemedy: string;
  preventiveAdvice: string;
}

const SAMPLE_DISEASE_DB: Record<string, DiagnosticResult> = {
  tomato: {
    diseaseName: 'Early Blight (Alternaria solani)',
    marathiName: 'टोमॅटो करपा रोग (अल्टरनेरिया)',
    crop: 'Tomato',
    confidence: 96,
    severity: 'MEDIUM',
    symptoms: ['Dark brown concentric rings on lower leaves', 'Yellow halo surrounding spots', 'Premature leaf drop'],
    organicRemedy: 'Neem oil spray (5ml/L) + Trichoderma viride bio-fungicide (5g/L water). Apply early morning.',
    chemicalRemedy: 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L at 10-day intervals.',
    preventiveAdvice: 'Maintain 45cm row spacing for aeration and avoid overhead sprinkler watering on foliage.',
  },
  onion: {
    diseaseName: 'Purple Blotch (Alternaria porri)',
    marathiName: 'कांदा जांभळा करपा रोग',
    crop: 'Onion',
    confidence: 94,
    severity: 'HIGH',
    symptoms: ['Water-soaked elongated lesions with purple center', 'Yellowing of tip leaves', 'Stunted bulb development'],
    organicRemedy: 'Pseudomonas fluorescens bio-spray (10g/L) mixed with fermented cow urine (Jeevamrut 10%).',
    chemicalRemedy: 'Tebuconazole 25.9% EC @ 1.5ml/L or Difenoconazole 25% EC @ 1ml/L water.',
    preventiveAdvice: 'Ensure field drainage in heavy black soil and crop rotation with non-allium crops.',
  },
  mango: {
    diseaseName: 'Powdery Mildew & Anthracnose',
    marathiName: 'आंबा भुरी व करपा रोग',
    crop: 'Mango (Alphonso)',
    confidence: 98,
    severity: 'LOW',
    symptoms: ['White powdery growth on floral panicles', 'Small black angular spots on fruit skin'],
    organicRemedy: 'Sulfur 80% WDG @ 2g/L or Dashaparni ark organic decoction sprayed during evening hours.',
    chemicalRemedy: 'Hexaconazole 5% SC @ 1ml/L or Carbendazim 50% WP @ 1g/L at flowering initiation.',
    preventiveAdvice: 'Thin inner foliage after post-harvest pruning to maximize sun penetration in Ratnagiri orchards.',
  },
  chilli: {
    diseaseName: 'Chilli Leaf Curl Virus (Gemini Virus)',
    marathiName: 'मिरची चुरडा-मुरडा (बोकड्या)',
    crop: 'Chilli',
    confidence: 92,
    severity: 'HIGH',
    symptoms: ['Upward curling of leaf margins', 'Thickening and brittleness of leaves', 'Vector: Thrips and Whiteflies'],
    organicRemedy: 'Yellow and blue sticky traps (25 traps/acre) + Agniastra organic garlic-chilli extract spray.',
    chemicalRemedy: 'Diafenthiuron 50% WP @ 1.2g/L or Fipronil 5% SC @ 1.5ml/L to control sucking pest vectors.',
    preventiveAdvice: 'Plant border rows of maize or bajra to prevent whitefly migration into chilli plots.',
  },
};

export default function CropDiseaseScanner() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'
  );
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(SAMPLE_DISEASE_DB.tomato);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          runDiagnosis(selectedCrop);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiagnosis = (cropKey: string) => {
    setAnalyzing(true);
    setDiagnosis(null);
    setTimeout(() => {
      setDiagnosis(SAMPLE_DISEASE_DB[cropKey] || SAMPLE_DISEASE_DB.tomato);
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Agronomy &amp; Plant Pathology</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'mr' ? 'पीक रोग निदान व कृषी सल्ला' : 'Crop Disease & Leaf Health AI Diagnostics'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Snap leaf or fruit photo with your phone for instant diagnosis and bio-organic treatments.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { key: 'tomato', label: '🍅 Tomato' },
            { key: 'onion', label: '🧅 Onion' },
            { key: 'mango', label: '🥭 Mango' },
            { key: 'chilli', label: '🌶️ Chilli' },
          ].map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setSelectedCrop(c.key);
                runDiagnosis(c.key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCrop === c.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Camera / Image Viewport */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500/40 bg-slate-50 dark:bg-slate-800/40 h-72 flex items-center justify-center">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Crop Inspection"
                  className="w-full h-full object-cover"
                />

                {/* Simulated AI Vision Bounding Box Overlay */}
                {diagnosis && !analyzing && (
                  <div className="absolute inset-8 border-2 border-emerald-400 rounded-xl pointer-events-none animate-pulse">
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono shadow">
                      {diagnosis.crop}: {diagnosis.confidence}% Match
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Take a photo of crop leaf</p>
              </div>
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="text-xs font-bold">Scanning leaf pathology with Computer Vision...</span>
              </div>
            )}
          </div>

          {/* Action Buttons for Mobile Phone */}
          <div className="grid grid-cols-2 gap-2">
            <label
              htmlFor="crop-camera-input"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <Camera className="w-4 h-4" />
              <span>Camera Snap</span>
            </label>
            <input
              type="file"
              id="crop-camera-input"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            <label
              htmlFor="crop-gallery-input"
              className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs py-3 px-3 rounded-xl border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-1.5 text-center"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload Photo</span>
            </label>
            <input
              type="file"
              id="crop-gallery-input"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Right: AI Diagnostic Report & Advisory */}
        <div className="lg:col-span-7 space-y-4">
          {diagnosis && (
            <div className="space-y-4">
              {/* Diagnosis Header Card */}
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
                      Detected Condition:
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                      {diagnosis.confidence}% AI Accuracy
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {diagnosis.diseaseName}
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono block">
                    {diagnosis.marathiName}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border font-mono ${
                    diagnosis.severity === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : diagnosis.severity === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {diagnosis.severity} Severity
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Identified Leaf Symptoms:
                </span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {diagnosis.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic Biological Treatment */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Leaf className="w-4 h-4" />
                  <span>Organic &amp; Bio-Remedy (Zero Chemical Residue):</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                  {diagnosis.organicRemedy}
                </p>
              </div>

              {/* Scientific Preventive Advice */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Field Prevention &amp; Agronomy:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                  {diagnosis.preventiveAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
