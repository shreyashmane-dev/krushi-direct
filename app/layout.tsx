import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { AuthProvider } from '@/lib/auth/context';

import MandiTicker from '@/components/mandi-ticker';
import DemoPersonaBanner from '@/components/demo-persona-banner';
import AiChatModal from '@/components/ai-chat-modal';
import PwaInstaller from '@/components/pwa-installer';

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'KisanDirect | AI Farmer-to-Buyer Agricultural Marketplace',
  description:
    'Digital agricultural marketplace connecting Indian farmers directly with consumers, restaurants, retailers, and food processors. Features AI price recommendations, direct buyer bidding, transparent price journeys, and digital escrow payments.',
  keywords: [
    'KisanDirect',
    'Farmer Marketplace',
    'AgTech India',
    'AI Price Intelligence',
    'Direct Farm Sourcing',
    'Zero Middlemen Agriculture',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KisanDirect',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

import { ThemeProvider } from '@/lib/theme-context';
import { LanguageProvider } from '@/lib/i18n';
import MobileBottomNav from '@/components/mobile-bottom-nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-[#fafcf8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-150">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <div className="md:pl-64 flex flex-col min-h-screen pb-16 md:pb-0">
                <DemoPersonaBanner />
                <MandiTicker />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <MobileBottomNav />
              <AiChatModal />
              <PwaInstaller />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
