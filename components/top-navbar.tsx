'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Cpu,
  Truck,
  Sparkles,
  ChevronDown,
  User,
  ShieldCheck,
  MapPin,
  KeyRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { DEMO_ACCOUNTS, getRoleDashboardUrl } from '@/lib/auth/demo-users';
import PwaNotificationBell from '@/components/pwa-notification-bell';
import LanguageSwitcher from '@/components/language-switcher';
import ThemeToggle from '@/components/theme-toggle';
import GeminiKeyModal from '@/components/gemini-key-modal';

export default function TopNavbar() {
  const router = useRouter();
  const { user, switchUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
    }
  };

  const dashboardUrl = getRoleDashboardUrl(user?.role);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-2.5 transition-colors shadow-xs">
        <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
          {/* Left Side: Mobile Hamburger + Brand / Desktop Global Search */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-xl">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={toggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition border border-slate-200/80 dark:border-slate-800 shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Emblem */}
            <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
              <img
                src="/icons/icon-192.png"
                alt="KisanDirect"
                className="w-7 h-7 rounded-lg shadow-sm border border-emerald-500/30 object-cover"
              />
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Kisan<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh produce, mandis, farmers, logistics..."
                className="w-full pl-10 pr-12 py-2 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-none">
                ↵
              </span>
            </form>

            {/* Live Reefer Logistics Pill (Desktop) */}
            <Link
              href="/logistics"
              className="hidden xl:inline-flex items-center gap-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-full text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition shrink-0"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>6 Reefer Corridors Live</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </div>

          {/* Right Side: Quick Action Pills, Notification Bell, User Capsule */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle search input"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Gemini AI Key Setup Pill */}
            <button
              type="button"
              onClick={() => setKeyModalOpen(true)}
              title="Configure Gemini 2.0 Flash API Key"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full transition shadow-2xs"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[11px]">Gemini 2.0 AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* PWA Notification Bell */}
            <PwaNotificationBell />

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher compact />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Capsule & Persona Switcher */}
            {user ? (
              <div className="relative" ref={personaRef}>
                <button
                  type="button"
                  onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition"
                  aria-expanded={personaMenuOpen}
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/50 shrink-0"
                  />
                  <span className="hidden md:inline text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded font-mono border ${
                      user.role === 'FARMER'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : user.role === 'ADMIN'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                        : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                    }`}
                  >
                    {user.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Persona Switcher Dropdown */}
                {personaMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                      onClick={() => setPersonaMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-left animate-in fade-in-50 zoom-in-95 duration-100 space-y-1">
                      {/* Active User Card */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-emerald-500/50"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={dashboardUrl}
                          onClick={() => setPersonaMenuOpen(false)}
                          className="mt-2 w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <span>Open {user.role} Dashboard</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="px-2 pt-2 pb-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                          Switch Test Persona:
                        </span>
                      </div>

                      <div className="space-y-0.5 max-h-48 overflow-y-auto">
                        {DEMO_ACCOUNTS.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={async () => {
                              await switchUser(acc.id);
                              setPersonaMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                              user.id === acc.id
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="truncate">{acc.name}</span>
                            <span className="text-[9px] font-black uppercase text-slate-500 font-mono">
                              {acc.role}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setPersonaMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-bold flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition shadow-2xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh crops, mandis, logistics..."
                className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </header>

      <GeminiKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </>
  );
}
