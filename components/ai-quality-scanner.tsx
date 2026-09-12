'use client';

import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Check,
  Upload,
  Calendar,
  IndianRupee,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getGeminiAuthHeaders } from '@/lib/ai/gemini-key-storage';

interface AIQualityScannerProps {
  cropName: string;
  externalImageUrl?: string;
  onApplyGrade?: (grade: string) => void;
  onApplyPrice?: (price: number) => void;
}

export interface QualityAssessmentResult {
  cropName: string;
  detectedVariety?: string;
  estimatedGrade: 'A+' | 'A' | 'B' | 'C';
  confidenceScore: number;
  suggestedPriceInr?: number;
  estimatedShelfLifeDays?: number;
  reasons: string[];
  parameters: {
    colorUniformity: number;
    freshnessScore: number;
    defectScore: number;
    sizeConsistency: number;
  };
  isLiveGeminiVision?: boolean;
  disclaimer: string;
}

export default function AIQualityScanner({
  cropName = 'Tomato',
  externalImageUrl,
  onApplyGrade,
  onApplyPrice,
}: AIQualityScannerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(externalImageUrl || null);
  const [result, setResult] = useState<QualityAssessmentResult | null>(null);
  const [applied, setApplied] = useState(false);

  // Sync external image URL if passed
  React.useEffect(() => {
    if (externalImageUrl) {
      setImagePreview(externalImageUrl);
    }
  }, [externalImageUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          runAnalysis(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (customImg?: string) => {
    setAnalyzing(true);
    setApplied(false);
    try {
      const imgToSend = customImg || imagePreview || '';
      const headers = getGeminiAuthHeaders({ 'Content-Type': 'application/json' });

      const res = await fetch('/api/ai/quality-check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cropName,
          imageBase64: imgToSend,
          visibleDamagePercent: 3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Quality check failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Multimodal Quality Grading
              </h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-mono font-bold">
                APMC AGMARK
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Computer vision produce inspection powered by Google Gemini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <label
            htmlFor="quality-photo-upload"
            className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload Photo</span>
          </label>
          <input
            type="file"
            id="quality-photo-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => runAnalysis()}
            disabled={analyzing}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition disabled:opacity-50 shadow-sm"
          >
            <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Grading Produce...' : result ? 'Re-scan' : 'Scan Grade'}</span>
          </button>
        </div>
      </div>

      {/* Image Preview & Active Status */}
      {imagePreview && (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <img
            src={imagePreview}
            alt="Produce Preview"
            className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              Inspecting {cropName}
            </span>
            <span className="text-[10px] text-slate-500">
              Ready for commercial optical grading
            </span>
          </div>
          {result?.isLiveGeminiVision && (
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded font-bold">
              Gemini Vision Live
            </span>
          )}
        </div>
      )}

      {result ? (
        <div className="space-y-4">
          {/* Main Grade Header Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm shrink-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Assessed Grade</span>
                <span className="text-3xl font-black">{result.estimatedGrade}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {result.detectedVariety || `${cropName} Commercial`}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-mono">
                    {result.confidenceScore}% Confidence
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  {result.estimatedGrade === 'A+'
                    ? 'Export Quality: Flawless skin, calibrated size, premium hotel specification.'
                    : result.estimatedGrade === 'A'
                    ? 'Supermarket Grade: High uniformity, minor blemishes, immediate retail dispatch.'
                    : result.estimatedGrade === 'B'
                    ? 'Local Mandi Standard: Good culinary eating quality, variable sizing.'
                    : 'Processing Grade: Suitable for puree, pulping, and commercial sauces.'}
                </p>
              </div>
            </div>

            {/* Valuation & Shelf Life */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200 dark:border-emerald-800 text-right gap-1 shrink-0">
              {result.suggestedPriceInr && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Suggested Price</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    {formatINR(result.suggestedPriceInr)}/kg
                  </span>
                </div>
              )}
              {result.estimatedShelfLifeDays && (
                <span className="text-[10px] text-slate-500 font-medium">
                  ⏳ Shelf Life: ~{result.estimatedShelfLifeDays} Days
                </span>
              )}
            </div>
          </div>

          {/* 4 Diagnostic Parameter Sliders */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Color Uniformity</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.parameters.colorUniformity}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${result.parameters.colorUniformity}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Freshness Score</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.parameters.freshnessScore}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${result.parameters.freshnessScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Surface Defect Rate</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.parameters.defectScore}% (Low)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(5, 100 - result.parameters.defectScore)}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Size Consistency</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.parameters.sizeConsistency}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${result.parameters.sizeConsistency}%` }} />
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
              Gemini Vision Agronomic Notes:
            </span>
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {/* Apply Grade and Price to Form */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[10px] text-slate-400">
              {result.disclaimer}
            </span>

            {(onApplyGrade || onApplyPrice) && (
              <button
                type="button"
                onClick={() => {
                  if (onApplyGrade) {
                    const gradeVal = result.estimatedGrade === 'A+' ? 'A_PLUS' : result.estimatedGrade;
                    onApplyGrade(gradeVal);
                  }
                  if (onApplyPrice && result.suggestedPriceInr) {
                    onApplyPrice(result.suggestedPriceInr);
                  }
                  setApplied(true);
                }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm ${
                  applied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {applied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {applied
                    ? `Applied Grade ${result.estimatedGrade} & Price`
                    : `Apply Grade ${result.estimatedGrade} to Harvest Form`}
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
          <Camera className="w-8 h-8 mx-auto opacity-50 text-emerald-500" />
          <p className="text-xs">
            Upload or take a photo of your harvest to grade optical quality, surface defect %, and fair APMC market price.
          </p>
        </div>
      )}
    </div>
  );
}
