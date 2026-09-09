'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { DEMO_ACCOUNTS, getRoleDashboardUrl } from '@/lib/auth/demo-users';
import LanguageSwitcher from '@/components/language-switcher';
import { useLanguage } from '@/lib/i18n';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogOut,
  ShieldCheck,
  CheckCircle,
  Users,
} from 'lucide-react';

export default function DemoPersonaBanner() {
  const { user, switchUser, logout } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (id: string) => {
    setIsSwitching(true);
    try {
      await switchUser(id);
    } finally {
      setIsSwitching(false);
    }
  };

  const dashboardUrl = getRoleDashboardUrl(user?.role);

  const roleStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    FARMER: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    CONSUMER: {
      bg: 'bg-sky-500/15',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-500/30',
      dot: 'bg-sky-500',
    },
    RESTAURANT: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500',
    },
    RETAILER: {
      bg: 'bg-violet-500/15',
      text: 'text-violet-700 dark:text-violet-300',
      border: 'border-violet-500/30',
      dot: 'bg-violet-500',
    },
    PROCESSOR: {
      bg: 'bg-orange-500/15',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-500/30',
      dot: 'bg-orange-500',
    },
    DELIVERY_PARTNER: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/30',
      dot: 'bg-blue-500',
    },
    ADMIN: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/30',
      dot: 'bg-rose-500',
    },
  };

  const activeStyle = user?.role
    ? roleStyles[user.role] || {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      }
    : null;

  return (
    <div className="w-full bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        {user ? (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Active Persona Identifier */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeStyle?.dot}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeStyle?.dot}`} />
              </span>

              <div className="flex items-center gap-2 truncate">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                  DEMO MODE:
                </span>

                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-700 shrink-0"
                />

                <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                  {user.name}
                </span>

                {/* BOLD ROLE BADGE */}
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono ${activeStyle?.bg} ${activeStyle?.text} ${activeStyle?.border}`}
                >
                  ROLE: <strong>{user.role}</strong>
                </span>
              </div>
            </div>

            {/* Middle: Fast Persona Switcher Pills */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${isSwitching ? 'animate-spin' : ''}`} />
                <span>Switch Persona:</span>
              </span>

              {DEMO_ACCOUNTS.slice(0, 5).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSwitch(acc.id)}
                  disabled={isSwitching}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                    user.id === acc.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>{acc.name.split(' ')[0]}</span>
                  <span className="opacity-70 text-[9px] font-mono">({acc.role.slice(0, 4)})</span>
                </button>
              ))}
            </div>

            {/* Right: Dashboard Action + Language + Logout */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>

              <Link
                href={dashboardUrl}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Go to {user.role} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-400 text-xs font-semibold p-1.5 rounded-lg transition"
                title="Sign Out / Exit Demo"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Non-logged in quick test persona bar */
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Quick Test Drive</span>
              </span>
              <span className="text-slate-300 text-xs font-medium hidden sm:inline">
                Click any role to test KisanDirect with preloaded live demo data:
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {DEMO_ACCOUNTS.slice(0, 4).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSwitch(acc.id)}
                  disabled={isSwitching}
                  className="bg-slate-800 hover:bg-emerald-700 hover:text-white text-slate-200 px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 border border-slate-700 shrink-0"
                >
                  <span>{acc.name.split(' ')[0]}</span>
                  <span className="text-emerald-400 text-[10px] font-mono">[{acc.role}]</span>
                </button>
              ))}

              <Link
                href="/login"
                className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 underline underline-offset-2 ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
