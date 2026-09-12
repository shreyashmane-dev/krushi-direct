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
  Layers,
  Award,
} from 'lucide-react';
import GeminiKeyModal from '@/components/gemini-key-modal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchUser, logout } = useAuth();
  const { t, language } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  // Listen for mobile sidebar toggle event dispatched by TopNavbar
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowDemoMenu(false);
  }, [pathname]);

  const dashboardUrl = getRoleDashboardUrl(user?.role);

  const navigationSections = [
    {
      title: 'Marketplace & Trade',
      items: [
        { href: '/', label: t.home, icon: Home, exact: true },
        { href: '/marketplace', label: t.marketplace, icon: ShoppingBag },
        {
          href: '/logistics',
          label: language === 'mr' ? 'स्मार्ट वाहतूक' : language === 'hi' ? 'स्मार्ट लॉजिस्टिक्स' : 'Smart Reefer Logistics',
          icon: Truck,
          badge: 'Live',
        },
        { href: '/farmer/insights', label: t.priceTrends, icon: TrendingUp },
      ],
    },
    {
      title: 'AI AgTech Suite',
      items: [
        {
          href: '/crop-grading',
          label: language === 'mr' ? 'पीक प्रतवारी' : language === 'hi' ? 'फसल ग्रेडिंग' : 'AI Crop Grading',
          icon: Sparkles,
          badge: 'Gemini 2.0',
        },
        {
          href: '/crop-lens',
          label: language === 'mr' ? 'पीक रोग लेन्स' : language === 'hi' ? 'फसल रोग लेंस' : 'Crop Disease Lens',
          icon: Leaf,
        },
        {
          href: '/roi-simulator',
          label: language === 'mr' ? 'आरओआय सिम्युलेटर' : language === 'hi' ? 'आरओआई सिम्युलेटर' : 'Middleman ROI Simulator',
          icon: TrendingUp,
          badge: 'ROI',
        },
        {
          href: '/profit-calculator',
          label: language === 'mr' ? 'नफा कॅल्क्युलेटर' : language === 'hi' ? 'मुनाफा कैलकुलेटर' : 'Profit & MSP Calc',
          icon: Calculator,
        },
      ],
    },
    {
      title: 'Workspace & Operations',
      items: [
        { href: dashboardUrl, label: `${user?.role || 'User'} Command Hub`, icon: LayoutDashboard },
        { href: '/farmer/produce/new', label: t.sellProduce, icon: Sprout },
        { href: user?.role === 'FARMER' ? '/farmer/orders' : '/buyer/orders', label: t.orders, icon: Package },
        { href: '/innovation', label: t.howItWorks, icon: Layers },
      ],
    },
  ];

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Section: Brand + User Capsule */}
      <div className="space-y-3.5">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            href="/"
            onClick={() => isMobile && setMobileOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <img
                src="/icons/icon-192.png"
                alt="KisanDirect Logo"
                className="w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition object-cover border border-emerald-500/40"
              />
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Kisan<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider -mt-1 font-mono">
                Direct Farmgate OS &bull; v2.5
              </span>
            </div>
          </Link>

          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Card with Role Badge */}
        {user ? (
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {user.name}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono inline-block border ${
                    user.role === 'FARMER'
                      ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-700'
                      : user.role === 'ADMIN'
                      ? 'text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/90 border-rose-300 dark:border-rose-700'
                      : 'text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/90 border-sky-300 dark:border-sky-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Switch Role</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  if (isMobile) setMobileOpen(false);
                }}
                className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Expandable Switch User Menu */}
            {showDemoMenu && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase font-mono tracking-wider block">
                  Select Persona:
                </span>
                <div className="space-y-0.5 max-h-36 overflow-y-auto">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        switchUser(acc.id);
                        setShowDemoMenu(false);
                        if (isMobile) setMobileOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        user.id === acc.id
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{acc.name.split(' ')[0]}</span>
                      <span className="text-[9px] font-black uppercase text-slate-400 font-mono">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Direct Farmer Trade OS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => isMobile && setMobileOpen(false)}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-xl text-xs transition shadow-2xs"
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

        {/* Categorized Navigation Links */}
        <nav className="space-y-4 pt-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 px-3 font-mono block">
                {section.title}
              </span>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobile && setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Controls */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        {/* Gemini AI Key Trigger */}
        <button
          type="button"
          onClick={() => {
            setKeyModalOpen(true);
            if (isMobile) setMobileOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gemini AI Key</span>
          </span>
          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">
            Setup
          </span>
        </button>

        {/* Language & Theme Controls */}
        <div className="flex items-center justify-between px-1">
          <LanguageSwitcher compact />
          <ThemeToggle />
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-400 text-center font-mono">
          KisanDirect &bull; Zero Middlemen
        </div>
      </div>
    </div>
  );

  return (
    <>
      <GeminiKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />

      {/* 1. Desktop Vertical Navigation Sidebar */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 border-r border-slate-200/80 dark:border-slate-800 z-40 p-4 shadow-sm bg-white dark:bg-slate-950">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full p-4 shadow-2xl animate-in slide-in-from-left duration-200 bg-white dark:bg-slate-950 z-10 flex flex-col">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
