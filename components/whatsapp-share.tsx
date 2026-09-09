'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface WhatsAppShareProps {
  cropName: string;
  variety?: string;
  pricePerKg: number;
  farmerName: string;
  location: string;
  productId: string;
  unit?: string;
}

export default function WhatsAppShare({
  cropName,
  variety,
  pricePerKg,
  farmerName,
  location,
  productId,
  unit = 'kg',
}: WhatsAppShareProps) {
  const handleShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kisandirect.in';
    const productUrl = `${origin}/products/${productId}`;

    const message = `🌾 *Fresh Farmgate Harvest Alert!*\n\n` +
      `🌱 *Crop:* ${cropName} ${variety ? `(${variety})` : ''}\n` +
      `💰 *Direct Price:* ₹${pricePerKg}/${unit} (Zero Middlemen)\n` +
      `🧑‍🌾 *Farmer:* ${farmerName}\n` +
      `📍 *Location:* ${location}\n` +
      `🛡️ *Quality:* Verified Maharashtra Producer (Escrow Protected)\n\n` +
      `👉 *Order & Bid directly on KisanDirect:* ${productUrl}`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-xs"
      title="Share harvest lot on WhatsApp"
    >
      <Share2 className="w-3.5 h-3.5" />
      <span>Share on WhatsApp</span>
    </button>
  );
}
