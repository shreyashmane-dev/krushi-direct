'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { DEMO_ACCOUNTS, getRoleDashboardUrl } from '@/lib/auth/demo-users';
import {
  Sprout,
  ShoppingBag,
  User,
  Bell,
  CheckCircle,
  TrendingUp,
  Truck,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LogIn,
  KeyRound,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchUser, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Server may be compiling/restarting in dev mode; suppress network error
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [user]);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  // Determine dashboard URL based on user role
  const getDashboardUrl = (role?: string) => {
    return getRoleDashboardUrl(role || user?.role);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-md">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/icons/icon-192.png"
              alt="KisanDirect Logo"
              className="w-10 h-10 rounded-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition border border-emerald-400/30 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                Kisan<span className="text-emerald-600">Direct</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 -mt-1">
                AI Agro-Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className={`hover:text-emerald-600 transition ${
                pathname === '/' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className={`hover:text-emerald-600 transition ${
                pathname.startsWith('/marketplace') ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/farmer/insights"
              className={`hover:text-emerald-600 transition flex items-center gap-1 ${
                pathname.startsWith('/farmer/insights') ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>AI Price Trends</span>
            </Link>
            <Link
              href="/innovation"
              className={`hover:text-emerald-600 transition ${
                pathname === '/innovation' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/documentation"
              className={`hover:text-emerald-600 transition flex items-center gap-1 ${
                pathname === '/documentation' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <span>Docs</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 py-0.2 rounded">AnoS</span>
            </Link>
            <Link
              href={getDashboardUrl()}
              className={`hover:text-emerald-600 transition flex items-center gap-1.5 ${
                pathname.includes('dashboard') ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              <span>Dashboard</span>
              {user && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2.5">
            {/* Direct Customer Account / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 py-1.5 px-2.5 rounded-xl transition text-xs text-slate-800"
                  title="Your Customer Account"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="font-bold text-slate-900 block leading-tight">{user.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wide block">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-2.5 border-b border-slate-100">
                      <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        {user.role} Customer Profile
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs">
                      <Link
                        href={getDashboardUrl()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-900 font-semibold transition"
                      >
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Open Dashboard</span>
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                        <span>Firebase Login / Switch Account</span>
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-sm transition hover:shadow"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center text-xs font-semibold text-slate-700 hover:text-emerald-700 py-1.5 px-2 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Demo Persona Quick-Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-medium py-1.5 px-2.5 rounded-lg transition"
                title="Switch customer demo persona for testing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold hidden xl:inline">Switch Role:</span>
                <span className="font-bold text-slate-800">{user?.role || 'Test Persona'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500">
                    <p className="font-bold text-slate-800">1-Click Demo Persona Switcher</p>
                    <p className="text-[11px] text-slate-500">Instantly test the platform from any user perspective</p>
                  </div>
                  <div className="py-1 space-y-1">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={async () => {
                          await switchUser(acc.id);
                          setShowDemoMenu(false);
                          const target = getRoleDashboardUrl(acc.role);
                          router.push(target);
                          router.refresh();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs transition ${
                          user?.email === acc.email
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-7 h-7 rounded-full object-cover border border-emerald-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{acc.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-medium">{acc.role}</p>
                        </div>
                        {user?.email === acc.email && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-App Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) markAllRead();
                }}
                className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-emerald-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications yet.</div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.linkUrl || '#'}
                          onClick={() => setShowNotifications(false)}
                          className="block p-3 hover:bg-slate-50 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sell Produce / Farmer Action */}
            <Link
              href="/farmer/produce/new"
              className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-600/20 transition hover:shadow-md"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>+ List Produce</span>
            </Link>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-emerald-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800"
          >
            Home
          </Link>
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800"
          >
            Marketplace
          </Link>
          <Link
            href="/farmer/insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800"
          >
            AI Price Trends
          </Link>
          <Link
            href="/innovation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800"
          >
            How It Works
          </Link>
          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="px-1 py-1">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email} • <span className="text-emerald-700 font-bold uppercase">{user.role}</span></p>
              </div>
              <Link
                href={getDashboardUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-emerald-700"
              >
                Open {user.role} Dashboard
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-600"
              >
                Switch Customer Account / Login
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-semibold text-red-600 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm"
              >
                Sign In with Firebase
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-sm"
              >
                Create Customer Account
              </Link>
            </div>
          )}
          <Link
            href="/farmer/produce/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold py-2.5 rounded-lg text-sm"
          >
            + Add Produce Listing
          </Link>
        </div>
      )}
    </header>
  );
}
