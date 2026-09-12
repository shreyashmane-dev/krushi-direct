'use client';

import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Leaf,
  ArrowRight,
  Upload,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  KeyRound,
  FileText,
  Activity,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { getGeminiAuthHeaders } from '@/lib/ai/gemini-key-storage';
import GeminiKeyModal from '@/components/gemini-key-modal';

export interface DiagnosticResult {
  diseaseName: string;
  marathiName: string;
  hindiName: string;
  scientificName: string;
  crop: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  affectedAreaPercent: number;
  pathogenType: string;
  symptoms: string[];
  organicRemedy: string;
  chemicalRemedy: string;
  preventiveAdvice: string;
  weatherRiskAlert?: string;
  isLiveGeminiVision: boolean;
}

const SAMPLE_CROPS = [
  {
    key: 'tomato',
    label: '🍅 Tomato (करपा)',
    sampleUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  },
  {
    key: 'onion',
    label: '🧅 Onion (जांभळा करपा)',
    sampleUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800',
  },
  {
    key: 'mango',
    label: '🥭 Mango (भुरी रोग)',
    sampleUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
  },
  {
    key: 'chilli',
    label: '🌶️ Chilli (चुरडा-मुरडा)',
    sampleUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800',
  },
  {
    key: 'potato',
    label: '🥔 Potato (अगेती करपा)',
    sampleUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
  },
  {
    key: 'grapes',
    label: '🍇 Grapes (केवडा)',
    sampleUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
  },
];

export default function CropDiseaseScanner() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_CROPS[0].sampleUrl);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  // Convert uploaded file to base64 and trigger diagnosis
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          runDiagnosis(selectedCrop, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiagnosis = async (cropKey: string, base64Image?: string) => {
    setAnalyzing(true);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const imgToSend = base64Image || imagePreview || '';
      const headers = getGeminiAuthHeaders({ 'Content-Type': 'application/json' });

      const res = await fetch('/api/ai/crop-disease', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cropHint: cropKey,
          imageBase64: imgToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch (err) {
      console.error('Diagnosis call failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Initial load diagnosis
  React.useEffect(() => {
    runDiagnosis('tomato', SAMPLE_CROPS[0].sampleUrl);
  }, []);

  // Audio Speech Synthesis for Rural Farmers
  const handleSpeakAdvisory = () => {
    if (!diagnosis || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    let voiceLang = 'en-IN';

    if (language === 'mr') {
      speechText = `रोग: ${diagnosis.marathiName}. तीव्रता: ${diagnosis.severity}. सेंद्रिय उपाय: ${diagnosis.organicRemedy}. रासायनिक उपाय: ${diagnosis.chemicalRemedy}.`;
      voiceLang = 'mr-IN';
    } else if (language === 'hi') {
      speechText = `रोग: ${diagnosis.hindiName}. गंभीरता: ${diagnosis.severity}. जैविक उपचार: ${diagnosis.organicRemedy}. रासायनिक उपचार: ${diagnosis.chemicalRemedy}.`;
      voiceLang = 'hi-IN';
    } else {
      speechText = `Detected disease: ${diagnosis.diseaseName}. Severity is ${diagnosis.severity}. Organic remedy: ${diagnosis.organicRemedy}. Chemical spray: ${diagnosis.chemicalRemedy}. Preventive advice: ${diagnosis.preventiveAdvice}.`;
      voiceLang = 'en-IN';
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = voiceLang;
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // WhatsApp Share Prescription
  const handleWhatsAppShare = () => {
    if (!diagnosis) return;
    const text = `🌿 *KisanDirect AI Crop Health Prescription* 🌿\n\n🌾 *Crop:* ${diagnosis.crop}\n🩺 *Condition:* ${diagnosis.diseaseName} (${diagnosis.marathiName})\n⚠️ *Severity:* ${diagnosis.severity} (${diagnosis.affectedAreaPercent}% Area Affected)\n\n🌱 *Bio-Organic Remedy:* ${diagnosis.organicRemedy}\n\n🧪 *Chemical Intervention:* ${diagnosis.chemicalRemedy}\n\n🛡️ *Field Prevention:* ${diagnosis.preventiveAdvice}\n\n_Verified by KisanDirect Gemini Agronomy Engine_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Print Prescription Card
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <GeminiKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Agronomy &amp; Plant Pathology</span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded font-black">
              Gemini Vision 2.0
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'mr' ? 'पीक रोग निदान व कृषी सल्ला' : 'Crop Disease & Leaf Pathology AI Scanner'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Snap leaf or fruit photo with your phone for instant diagnosis, bio-organic remedies, chemical dosages, and voice instructions.
          </p>
        </div>

        {/* Gemini Key Status & Configuration */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setKeyModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gemini Key</span>
          </button>

          {diagnosis?.isLiveGeminiVision ? (
            <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini AI Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 font-mono">
              Offline Heuristics
            </span>
          )}
        </div>
      </div>

      {/* Sample Crop Quick Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Crop or Upload Field Photo:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SAMPLE_CROPS.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setSelectedCrop(c.key);
                setImagePreview(c.sampleUrl);
                runDiagnosis(c.key, c.sampleUrl);
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

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera HUD Viewport */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 h-80 flex items-center justify-center shadow-lg group">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Crop Inspection"
                  className="w-full h-full object-cover opacity-90 transition group-hover:scale-105 duration-300"
                />

                {/* Futuristic Camera HUD Overlays */}
                <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between">
                  {/* Top HUD Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      SPECTRAL SCAN
                    </span>
                    <span>550nm - 850nm</span>
                  </div>

                  {/* Center Crosshair Reticle & Bounding Box */}
                  {diagnosis && !analyzing && (
                    <div className="relative border-2 border-dashed border-emerald-400 rounded-2xl p-4 m-4 bg-emerald-500/10">
                      {/* Laser scanning beam */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                      <div className="absolute -top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono shadow">
                        {diagnosis.crop}: {diagnosis.confidence}% Match
                      </div>
                      <div className="absolute -bottom-3 right-3 bg-slate-900 text-emerald-400 border border-emerald-500 text-[9px] font-mono px-2 py-0.5 rounded shadow">
                        {diagnosis.pathogenType} Pathogen
                      </div>
                    </div>
                  )}

                  {/* Bottom HUD Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-700">
                    <span>APMC AGMARKNET SPEC</span>
                    <span>AI CALIBRATED</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-10 h-10 mx-auto mb-2 opacity-50 text-emerald-400" />
                <p className="text-xs">Take or upload a photo of infected leaf</p>
              </div>
            )}

            {/* Scanning Loader */}
            {analyzing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                <RefreshCw className="w-10 h-10 animate-spin text-emerald-400" />
                <span className="text-xs font-black tracking-wider uppercase font-mono text-emerald-300">
                  Multimodal Gemini Pathology Analysis...
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: Camera Snap & Gallery Upload */}
          <div className="grid grid-cols-2 gap-3">
            <label
              htmlFor="crop-camera-input"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 text-center"
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
              className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-3.5 px-3 rounded-2xl border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-2 text-center"
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

        {/* Right Column: Comprehensive AI Diagnostic Card */}
        <div className="lg:col-span-7 space-y-5">
          {diagnosis && (
            <div className="space-y-4">
              {/* Diagnosis Header */}
              <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
                      Identified Condition:
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                      {diagnosis.confidence}% Confidence
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {diagnosis.diseaseName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    <span>{diagnosis.marathiName}</span>
                    <span>&bull;</span>
                    <span className="italic text-slate-500 dark:text-slate-400">{diagnosis.scientificName}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl border font-mono ${
                      diagnosis.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        : diagnosis.severity === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {diagnosis.severity} Severity ({diagnosis.affectedAreaPercent}% Area)
                  </span>

                  {/* Audio Speech Button */}
                  <button
                    type="button"
                    onClick={handleSpeakAdvisory}
                    className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-xs"
                    title="Speak diagnosis out loud"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                        <span>Listen Voice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Identified Symptoms */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Identified Visual Pathology Symptoms:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {diagnosis.symptoms.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Biological Treatment (Zero Chemical Residue) */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Bio-Organic &amp; Natural Remedy (Zero Residue):</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-6 font-medium">
                  {diagnosis.organicRemedy}
                </p>
              </div>

              {/* Chemical Intervention with Exact Dosage */}
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>Chemical Fungicide / Agrochemical Dosage:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-6 font-medium">
                  {diagnosis.chemicalRemedy}
                </p>
              </div>

              {/* Agronomic Prevention & Weather Risk */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Agronomic Field Prevention &amp; Canopy Spacing:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                  {diagnosis.preventiveAdvice}
                </p>

                {diagnosis.weatherRiskAlert && (
                  <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 p-2.5 rounded-xl mt-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Weather Alert:</strong> {diagnosis.weatherRiskAlert}</span>
                  </div>
                )}
              </div>

              {/* Share & Export Utility Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Advisory</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Health Card</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">
                  SIH 2026 AI Plant Pathology Service
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
