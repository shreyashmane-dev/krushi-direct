import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { AuthProvider } from '@/lib/auth/context';

import MandiTicker from '@/components/mandi-ticker';
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-[#fbfdf9] text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <MandiTicker />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AiChatModal />
          <PwaInstaller />
        </AuthProvider>
      </body>
    </html>
  );
}
