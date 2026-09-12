'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendPwaNotification,
  DEMO_NOTIFICATIONS,
  NotificationPayload,
} from '@/lib/pwa-notifications';

export default function PwaNotificationBell() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeToast, setActiveToast] = useState<NotificationPayload | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    // Listen for custom in-app notifications
    const handleInAppNotif = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationPayload>;
      setActiveToast(customEvent.detail);
      setUnreadCount((prev) => prev + 1);

      // Auto-hide toast after 6 seconds
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
      sendPwaNotification({
        title: '🔔 KisanDirect Alerts Enabled',
        body: 'You will now receive real-time APMC mandi surges, outbid alerts, and escrow payouts!',
        url: '/marketplace',
      });
    }
  };

  const handleTriggerDemoNotification = () => {
    const notif = DEMO_NOTIFICATIONS[demoIndex % DEMO_NOTIFICATIONS.length];
    setDemoIndex((prev) => prev + 1);
    sendPwaNotification(notif);
  };

  return (
    <>
      {/* Navbar Notification Bell Trigger */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
          }}
          title="Notifications & PWA Alerts"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-left animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-xs">PWA Push &amp; Mandi Alerts</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold uppercase">
                {permission === 'granted' ? 'Enabled' : 'Push Ready'}
              </span>
            </div>

            {/* Permission Prompt if not granted */}
            {permission !== 'granted' && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                  Enable device push notifications for live APMC price alerts.
                </div>
                <button
                  onClick={handleEnableNotifications}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shrink-0 transition"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Demo Trigger Button (Crucial for Demo God standard) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Test Live PWA Alert &amp; Chime:
              </span>
              <button
                onClick={handleTriggerDemoNotification}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3 h-3" />
                <span>Trigger Live Alert</span>
              </button>
            </div>

            {/* Notification Items */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_NOTIFICATIONS.map((n, idx) => (
                <Link
                  key={idx}
                  href={n.url || '#'}
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition block space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {n.title}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {n.body}
                  </p>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">
                Standard Web Push &bull; W3C &amp; RBI SLA Verified
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating In-App Toast Banner */}
      {activeToast && (
        <div className="fixed top-16 right-4 z-50 max-w-sm w-full bg-slate-950 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
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
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 pt-1"
              >
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
