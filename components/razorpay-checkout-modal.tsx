'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, CreditCard, QrCode, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
}

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  onPaymentSuccess,
}: RazorpayCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSimulatedPayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Create order on backend
      const createRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok) throw new Error(orderData.error || 'Failed to create payment order');

      // 2. Generate simulated test payment payload
      const mockPaymentId = `pay_test_${Math.random().toString(36).substring(2, 11)}`;
      const mockSignature = `sig_verified_${Math.random().toString(36).substring(2, 11)}`;

      // 3. Perform SERVER-SIDE VERIFICATION!
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature,
          paymentMethod: selectedMethod === 'UPI' ? 'UPI / BHIM (Instant)' : selectedMethod === 'CARD' ? 'Test Debit Card' : 'State Bank NetBanking',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Server signature verification failed');

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onPaymentSuccess(verifyData);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        {/* Header - Styled like Razorpay Test Checkout */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Razorpay Checkout</h3>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-blue-200">KisanDirect Agro-Escrow Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order details strip */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Order Reference</span>
            <span className="font-bold text-slate-800">#{orderNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Total Amount Payable</span>
            <span className="text-base font-black text-emerald-700">{formatINR(amount)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-5 space-y-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Payment Method (Test Environment)
          </label>

          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => setSelectedMethod('UPI')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                selectedMethod === 'UPI'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('CARD')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                selectedMethod === 'CARD'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Debit / Card</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('NETBANKING')}
              className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                selectedMethod === 'NETBANKING'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Lock className="w-5 h-5 text-purple-600" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Test Method Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
            {selectedMethod === 'UPI' && (
              <div className="space-y-1.5 text-center">
                <div className="w-24 h-24 mx-auto bg-white border border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                  <QrCode className="w-16 h-16 text-slate-700" />
                </div>
                <p className="font-semibold text-slate-800">Simulated UPI Intent: rahul@okhdfcbank</p>
                <p className="text-[11px] text-slate-500">Supports PhonePe, Google Pay, BHIM & Paytm simulation</p>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Test Corporate Agri-Card (VISA 4111)</p>
                <p className="text-[11px] text-slate-500">Card credentials are never saved; processed through server tokenization.</p>
              </div>
            )}

            {selectedMethod === 'NETBANKING' && (
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">State Bank of India / HDFC Agro NetBanking</p>
                <p className="text-[11px] text-slate-500">Direct instant clearing test mode.</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSimulatedPayment}
            disabled={processing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying Server Signature...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Pay {formatINR(amount)}</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit Encrypted • Server-Side Signature Verification Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
