'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { DEMO_ACCOUNTS, getRoleDashboardUrl } from '@/lib/auth/demo-users';
import ThemeToggle from '@/components/theme-toggle';
import LanguageSwitcher from '@/components/language-switcher';
import { useLanguage } from '@/lib/i18n';
import {
  Home,
  ShoppingBag,
  Sprout,
  Package,
  TrendingUp,
  HelpCircle,
  LayoutDashboard,
  Bell,
  LogOut,
  LogIn,
  KeyRound,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Calculator,
  Leaf,
  Truck,
  Sparkles,
  Cpu,
} from 'lucide-react';
import GeminiKeyModal from '@/components/gemini-key-modal';
import PwaNotificationBell from '@/components/pwa-notification-bell';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchUser, logout } = useAuth();
  const { t, language } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // ignore
      }
    }
    fetchNotifications();
  }, [user]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowDemoMenu(false);
  }, [pathname]);

  const dashboardUrl = getRoleDashboardUrl(user?.role);

  const navLinks = [
    { href: '/', label: t.home, icon: Home, exact: true },
    { href: '/marketplace', label: t.marketplace, icon: ShoppingBag },
    { 
      href: '/logistics', 
      label: language === 'mr' ? 'स्मार्ट वाहतूक' : language === 'hi' ? 'स्मार्ट लॉजिस्टिक्स' : 'Logistics Pooling', 
      icon: Truck 
    },
    { 
      href: '/crop-grading', 
      label: language === 'mr' ? 'पीक प्रतवारी' : language === 'hi' ? 'फसल ग्रेडिंग' : 'AI Crop Grading', 
      icon: Sparkles 
    },
    { 
      href: '/crop-lens', 
      label: language === 'mr' ? 'पीक रोग लेन्स' : language === 'hi' ? 'फसल रोग लेंस' : 'Crop Disease Lens', 
      icon: Leaf 
    },
    { 
      href: '/profit-calculator', 
      label: language === 'mr' ? 'नफा कॅल्क्युलेटर' : language === 'hi' ? 'मुनाफा कैलकुलेटर' : 'Profit Calculator', 
      icon: Calculator 
    },
    { href: '/farmer/produce/new', label: t.sellProduce, icon: Sprout },
    { href: user?.role === 'FARMER' ? '/farmer/orders' : '/buyer/orders', label: t.orders, icon: Package },
    { href: '/farmer/insights', label: t.priceTrends, icon: TrendingUp },
    { href: '/innovation', label: t.howItWorks, icon: HelpCircle },
    { href: dashboardUrl, label: t.dashboard, icon: LayoutDashboard },
  ];

  const renderSidebar = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Section: Brand + User Info */}
      <div className="space-y-4">
        {/* Brand Logo or Mobile Header with Close */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link 
            href="/" 
            onClick={() => isMobile && setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <img
              src="/icons/icon-192.png"
              alt="KisanDirect Logo"
              className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition object-cover border border-emerald-500/30"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Kisan<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider -mt-1">
                Agro Marketplace
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {!isMobile && <PwaNotificationBell />}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* User Card with BOLD ROLE */}
        {user ? (
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {user.name}
                </span>
                <div className="mt-0.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block font-mono border ${
                      user.role === 'FARMER'
                        ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-700'
                        : user.role === 'CONSUMER'
                        ? 'text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/90 border-sky-300 dark:border-sky-700'
                        : user.role === 'RESTAURANT'
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 border-amber-300 dark:border-amber-700'
                        : user.role === 'RETAILER'
                        ? 'text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/90 border-violet-300 dark:border-violet-700'
                        : 'text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    ROLE: <strong>{user.role}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Switch Demo</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  if (isMobile) setMobileOpen(false);
                }}
                className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Switch User Dropdown */}
            {showDemoMenu && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Persona:
                </span>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      switchUser(acc.id);
                      setShowDemoMenu(false);
                      if (isMobile) setMobileOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      user.id === acc.id
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold'
                        : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{acc.name}</span>
                    <span className="text-[9px] font-black uppercase text-slate-500 font-mono">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Welcome to KisanDirect</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => isMobile && setMobileOpen(false)}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-xl text-xs transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => isMobile && setMobileOpen(false)}
                className="w-full text-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-1.5 rounded-xl text-xs transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Clean Navigation Links */}
        <nav className="space-y-1 pt-1 overflow-y-auto max-h-[45vh]">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls: Theme Toggle & Quick Action */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Gemini AI Key Trigger */}
        <button
          type="button"
          onClick={() => {
            setKeyModalOpen(true);
            if (isMobile) setMobileOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gemini AI Key</span>
          </span>
          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">
            Setup
          </span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Language</span>
          <LanguageSwitcher compact />
        </div>

        {/* Theme Toggle Button */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.theme}</span>
          <ThemeToggle />
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium">
          KisanDirect &bull; AnoS Platform
        </div>
      </div>
    </div>
  );

  return (
    <>
      <GeminiKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />

      {/* 1. Desktop Vertical Navigation Sidebar */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 border-r border-slate-200 dark:border-slate-800 z-40 p-4 shadow-sm">
        {renderSidebar(false)}
      </aside>

      {/* 2. Mobile Top Navigation Header */}
      <header className="md:hidden sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/icons/icon-192.png"
            alt="KisanDirect Logo"
            className="w-8 h-8 rounded-lg shadow-sm border border-emerald-500/30 object-cover"
          />
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Kisan<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 px-1.5 py-0.5 rounded font-mono">
              <strong>{user.role}</strong>
            </span>
          )}
          <PwaNotificationBell />
          <button
            onClick={() => setKeyModalOpen(true)}
            className="p-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 transition"
            aria-label="Gemini API Key"
            title="Gemini AI Key"
          >
            <Cpu className="w-4 h-4" />
          </button>
          <LanguageSwitcher compact />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition border border-slate-200 dark:border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 3. Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full p-4 shadow-2xl animate-in slide-in-from-left duration-200 bg-white dark:bg-slate-950 z-10 flex flex-col">
            {renderSidebar(true)}
          </div>
        </div>
      )}
    </>
  );
}
