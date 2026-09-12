'use client';

/**
 * PWA & Browser Push Notification Engine with Web Audio Synthesizer
 */

// Web Audio synthesizer chime for native sound feedback
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Friendly two-tone chime (880Hz A5 -> 1320Hz E6)
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    // AudioContext blocked by browser autoplay policy until user gesture
  }
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  url?: string;
}

export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function sendPwaNotification(payload: NotificationPayload) {
  playNotificationChime();

  if (typeof window === 'undefined') return;

  // Try Native OS / ServiceWorker Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192.png',
        tag: payload.tag || 'kisandirect-alert',
        badge: '/icons/icon-192.png',
      });

      notif.onclick = () => {
        window.focus();
        if (payload.url) {
          window.location.href = payload.url;
        }
      };
    } catch (e) {
      console.warn('Native notification blocked:', e);
    }
  }

  // Dispatch custom window event so in-app floating banner appears
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kisandirect-pwa-notification', {
        detail: payload,
      })
    );
  }
}

export const DEMO_NOTIFICATIONS: NotificationPayload[] = [
  {
    title: '🌾 Live Mandi Price Jump: Lasalgaon Onion',
    body: 'Lasalgaon APMC auction rate jumped +5.2% to ₹24.00/kg. 3 commercial buyers requesting bulk bids!',
    url: '/marketplace?category=vegetables',
  },
  {
    title: '💰 Digital Escrow Released: ₹18,400 Credited',
    body: 'Order #KD-9824 delivered to Dadar Marts. 4-digit e-POD PIN 8421 confirmed. Bank payout completed in 42 mins.',
    url: '/farmer/payments',
  },
  {
    title: '🚀 Outbid Alert on Grade-A Tomato Lot #412',
    body: 'Hotel GreenBite raised bid to ₹19.50/kg (+₹1.50 over your offer). Tap to counter-bid!',
    url: '/buyer/bids',
  },
  {
    title: '🚛 Cold-Chain Reefer Departing in 25 mins',
    body: 'Truck MH-12-Q-4482 has pooled 4,200 kg along NH60 (Manchar ➔ Vashi APMC). Temperature: 4°C verified.',
    url: '/logistics',
  },
];
