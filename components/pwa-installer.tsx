'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check for iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      // Check session dismissal
      const dismissed = sessionStorage.getItem('kisandirect_pwa_dismissed');
      if (dismissed) {
        setIsDismissed(true);
      }
    }

    // 2. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 3. Listen for BeforeInstallPrompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for AppInstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] KisanDirect installed successfully!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSPrompt(true);
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kisandirect_pwa_dismissed', 'true');
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  // Only display if install prompt is ready or on iOS
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom PWA Banner (positioned above mobile nav) */}
      <div className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md z-30 animate-float">
        <div className="bg-slate-950/95 border border-emerald-500/40 text-white rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 relative overflow-hidden">
          {/* Subtle green ambient light */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* App Icon */}
          <img
            src="/icons/icon-192.png"
            alt="KisanDirect App Icon"
            className="w-14 h-14 rounded-2xl object-cover shadow-md border border-emerald-400/40 shrink-0"
          />

          {/* Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.2 rounded-full border border-amber-500/30">
                Official PWA
              </span>
              <span className="text-xs font-black text-white truncate">KisanDirect</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 line-clamp-2 leading-tight">
              Install for 1-tap farmgate prices, offline cache & instant order alerts.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Install App</span>
              </button>

              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 transition"
              >
                Not Now
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base flex items-center gap-2 text-emerald-400">
                <Smartphone className="w-5 h-5" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button onClick={() => setShowIOSPrompt(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.
              </li>
              <li>
                Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </li>
              <li>
                Tap <strong>&quot;Add&quot;</strong> in the top right to install KisanDirect!
              </li>
            </ol>

            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
