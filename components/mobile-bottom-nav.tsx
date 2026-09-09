'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n';
import { getRoleDashboardUrl } from '@/lib/auth/demo-users';
import {
  Home,
  ShoppingBag,
  Plus,
  Package,
  User,
  TrendingUp,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const isFarmer = user?.role === 'FARMER';
  const ordersUrl = isFarmer ? '/farmer/orders' : '/buyer/orders';
  const dashboardUrl = getRoleDashboardUrl(user?.role);

  const items = [
    { href: '/', label: t.home, icon: Home, exact: true },
    { href: '/marketplace', label: t.marketplace, icon: ShoppingBag },
    {
      href: '/farmer/produce/new',
      label: isFarmer ? t.sellProduce : 'List Crop',
      icon: Plus,
      isCenterAction: true,
    },
    { href: ordersUrl, label: t.orders, icon: Package },
    { href: dashboardUrl, label: user ? user.role.slice(0, 6) : 'Sign In', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          if (item.isCenterAction) {
            return (
              <div key={item.href} className="flex justify-center -mt-5">
                <Link
                  href={item.href}
                  className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white dark:border-slate-950 transition transform active:scale-95"
                  title={item.label}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold transition ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="truncate max-w-[56px] text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
