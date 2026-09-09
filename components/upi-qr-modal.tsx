'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, ArrowRight, X, Smartphone, Lock, Copy } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productName: string;
  orderId?: string;
  farmerName?: string;
  onSuccess?: () => void;
}

export default function UpiQrModal({
  isOpen,
  onClose,
  amount,
  productName,
  orderId = `ORD-${Date.now().toString().slice(-6)}`,
  farmerName = 'Ramesh Patil',
  onSuccess,
}: UpiQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedApp, setSelectedApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM'>('GPAY');

  if (!isOpen) return null;

  const upiId = 'kisandirect.escrow@icici';
  const upiUri = `upi://pay?pa=${upiId}&pn=KisanDirect%20Escrow&am=${amount}&cu=INR&tn=Escrow%20Deposit%20${orderId}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Digital Escrow Deposit
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Protected by ICICI Escrow</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              ₹{amount.toLocaleString('en-IN')} Escrow Locked!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Your funds are held safely in escrow. They will be released to {farmerName} only after quality inspection upon delivery.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
            >
              Done / Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Amount & Order Details */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Harvest Lot</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[180px]">
                  {productName}
                </h4>
                <span className="text-[10px] text-emerald-600 font-medium block">
                  Farmer: {farmerName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payable</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Simulated UPI QR Code SVG */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-500/40 shadow-inner">
                {/* Clean SVG Vector QR code */}
                <svg
                  className="w-48 h-48"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Position detection squares */}
                  <rect x="5" y="5" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" fill="none" />
                  <rect x="11" y="11" width="14" height="14" rx="2" fill="#059669" />

                  <rect x="69" y="5" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" fill="none" />
                  <rect x="75" y="11" width="14" height="14" rx="2" fill="#059669" />

                  <rect x="5" y="69" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" fill="none" />
                  <rect x="11" y="75" width="14" height="14" rx="2" fill="#059669" />

                  {/* Decorative QR Pattern Blocks */}
                  <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="8" width="8" height="6" fill="#0f172a" />
                  <rect x="58" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="18" width="12" height="6" fill="#0f172a" />
                  <rect x="52" y="18" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="36" width="6" height="12" fill="#0f172a" />
                  <rect x="18" y="36" width="8" height="6" fill="#0f172a" />
                  <rect x="18" y="46" width="6" height="8" fill="#0f172a" />

                  <rect x="36" y="36" width="28" height="28" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                  <path d="M50 42v16M42 50h16" stroke="#059669" strokeWidth="3" strokeLinecap="round" />

                  <rect x="68" y="36" width="8" height="8" fill="#0f172a" />
                  <rect x="80" y="36" width="12" height="6" fill="#0f172a" />
                  <rect x="72" y="48" width="6" height="8" fill="#0f172a" />
                  <rect x="84" y="46" width="8" height="14" fill="#0f172a" />

                  <rect x="36" y="68" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="68" width="14" height="6" fill="#0f172a" />
                  <rect x="36" y="80" width="14" height="12" fill="#0f172a" />
                  <rect x="54" y="78" width="8" height="8" fill="#0f172a" />

                  <rect x="68" y="68" width="12" height="8" fill="#0f172a" />
                  <rect x="84" y="68" width="8" height="16" fill="#0f172a" />
                  <rect x="68" y="80" width="8" height="12" fill="#0f172a" />
                  <rect x="80" y="88" width="12" height="6" fill="#0f172a" />
                </svg>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="font-mono">{upiId}</span>
                <button
                  onClick={copyUpiId}
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Instant Simulation Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <span>Verifying Escrow Lock with Bank...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simulate Instant UPI Payment (Test Mode)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Escrow Guarantee &bull; Released only upon harvest delivery</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
