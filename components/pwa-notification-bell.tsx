'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Truck,
  IndianRupee,
  TrendingUp,
  X,
  Volume2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Trash2,
  Radio,
  Clock,
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendPwaNotification,
  DEMO_NOTIFICATIONS,
  NotificationPayload,
} from '@/lib/pwa-notifications';

// Web Audio API chime - zero network requests, zero mp3 file dependencies
function playSyntheticChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 cheerful chime
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.1, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.3);
    });
  } catch {
    // AudioContext may require user interaction first; ignore if blocked
  }
}

export default function PwaNotificationBell() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeToast, setActiveToast] = useState<NotificationPayload | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);
  const [notificationsList, setNotificationsList] = useState<NotificationPayload[]>(DEMO_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'mandi' | 'orders'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    const handleInAppNotif = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationPayload>;
      setActiveToast(customEvent.detail);
      setUnreadCount((prev) => prev + 1);
      setNotificationsList((prev) => [customEvent.detail, ...prev]);
      playSyntheticChime();

      setTimeout(() => {
        setActiveToast((current) => (current === customEvent.detail ? null : current));
      }, 6000);
    };

    window.addEventListener('kisandirect-pwa-notification', handleInAppNotif);
    return () => {
      window.removeEventListener('kisandirect-pwa-notification', handleInAppNotif);
    };
  }, []);

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      playSyntheticChime();
      sendPwaNotification({
        title: '🔔 KisanDirect Alerts Enabled',
        body: 'You will now receive real-time APMC mandi surges, outbid alerts, and escrow payouts!',
        url: '/marketplace',
      });
    }
  };

  const handleTriggerDemoNotification = () => {
    playSyntheticChime();
    const notif = DEMO_NOTIFICATIONS[demoIndex % DEMO_NOTIFICATIONS.length];
    setDemoIndex((prev) => prev + 1);
    sendPwaNotification(notif);
  };

  const handleClearAll = () => {
    setNotificationsList([]);
    setUnreadCount(0);
  };

  const filteredNotifications = notificationsList.filter((n) => {
    if (activeTab === 'mandi') return n.title.toLowerCase().includes('mandi') || n.title.toLowerCase().includes('price') || n.title.toLowerCase().includes('surge');
    if (activeTab === 'orders') return n.title.toLowerCase().includes('order') || n.title.toLowerCase().includes('escrow') || n.title.toLowerCase().includes('reefer') || n.title.toLowerCase().includes('outbid');
    return true;
  });

  return (
    <>
      {/* Bell Trigger Button */}
      <div className="relative inline-block" ref={panelRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
          }}
          aria-expanded={isOpen}
          aria-label="Open notifications"
          title="Notifications & Live Alerts"
          className={`relative p-2 rounded-xl transition-all duration-150 flex items-center justify-center ${
            isOpen
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/40'
              : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-amber-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 font-mono">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </button>

        {/* Global Click-Away Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Dropdown Container - Perfectly Aligned and Never Clipped */}
        {isOpen && (
          <div
            className="fixed sm:absolute top-16 sm:top-full right-2 sm:right-0 mt-2 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[420px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-left animate-in fade-in-50 zoom-in-95 duration-150 ring-1 ring-black/5"
          >
            {/* Header with Emerald Gradient */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-emerald-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-white">Live Push & Mandi Intel</span>
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">
                    {permission === 'granted' ? 'W3C Push Connected' : 'In-App Live Stream'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTriggerDemoNotification}
                  title="Simulate Push Alert"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span className="hidden sm:inline">Simulate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close notification panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Permission Banner if not enabled */}
            {permission !== 'granted' && (
              <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium leading-tight">
                  Enable OS push notifications for APMC mandi spikes & outbid alerts.
                </div>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shrink-0 transition shadow-xs"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Tab Filter Pills */}
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeTab === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                All ({notificationsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mandi')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeTab === 'mandi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                Mandi Spikes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                Orders & Reefer
              </button>
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="font-bold text-slate-600 dark:text-slate-400">All clear! No notifications here.</p>
                  <p className="text-[11px] text-slate-400">
                    Click &quot;Simulate&quot; above to test a live push alert.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n, idx) => (
                  <Link
                    key={idx}
                    href={n.url || '#'}
                    onClick={() => setIsOpen(false)}
                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition block space-y-1 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Just now</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pl-4">
                      {n.body}
                    </p>
                  </Link>
                ))
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Latency APMC Stream</span>
              </span>
              {notificationsList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating In-App Toast Banner */}
      {activeToast && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-[100] max-w-sm w-[calc(100vw-1.5rem)] sm:w-full bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500/60 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <h5 className="font-black text-xs text-white leading-tight">
              {activeToast.title}
            </h5>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {activeToast.body}
            </p>
            {activeToast.url && (
              <Link
                href={activeToast.url}
                onClick={() => setActiveToast(null)}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 pt-1 font-mono uppercase tracking-wider"
              >
                <span>View Details &rarr;</span>
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
