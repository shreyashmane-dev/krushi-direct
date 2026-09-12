'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  RefreshCw,
  Trash2,
  Cpu,
} from 'lucide-react';
import { getStoredGeminiApiKey, setStoredGeminiApiKey } from '@/lib/ai/gemini-key-storage';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeminiKeyModal({ isOpen, onClose }: GeminiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredGeminiApiKey());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredGeminiApiKey(apiKey);
    setTestResult({
      success: true,
      message: apiKey.trim()
        ? 'Gemini API Key saved locally! All AI features will now prioritize your key.'
        : 'Key cleared. App will default to server environment or agro-heuristic fallback.',
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredGeminiApiKey('');
    setTestResult({
      success: true,
      message: 'Custom Gemini API Key removed. Now using server environment or smart offline agronomy.',
    });
  };

  const handleTestConnection = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Please enter a Gemini API Key first before testing.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test against gemini-1.5-flash
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToTest}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: 'Respond with "OK" in 1 word to verify API key connection.' }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        setStoredGeminiApiKey(keyToTest);
        setTestResult({
          success: true,
          message: 'Connection successful! Google Gemini 1.5 Flash verified and active.',
        });
      } else {
        const errData = await res.json();
        const msg = errData?.error?.message || 'Invalid API Key or permission denied.';
        setTestResult({
          success: false,
          message: `API Error: ${msg}`,
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Network error contacting Google Gemini API. Please check your internet connection.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded font-mono">
                Google AI Studio
              </span>
              <span className="text-[10px] text-slate-400">SIH 2026</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Gemini AI Key Manager
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure your Google Gemini API key to activate multimodal crop leaf disease diagnostics, automated produce grading, and farm economics chatbot.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold hover:underline"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition p-1"
                title="Clear Key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            🔒 Your API key is stored strictly in your local browser sandbox and sent via encrypted HTTPS directly to Google Generative AI endpoints.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border animate-in fade-in ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !apiKey.trim()}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{testing ? 'Verifying with Google...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
