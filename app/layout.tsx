import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { AuthProvider } from '@/lib/auth/context';

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
  icons: {
    icon: '/icon',
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
