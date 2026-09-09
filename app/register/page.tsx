'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { signInWithGoogle } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, loginWithFirebase } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('kisan123');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('FARMER');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [farmSize, setFarmSize] = useState('5');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const fbUser = await signInWithGoogle();
      const success = await loginWithFirebase({
        email: fbUser.email,
        name: fbUser.displayName || 'Google User',
        avatar: fbUser.photoURL,
        phone: fbUser.phoneNumber,
        firebaseUid: fbUser.uid,
        role: role,
      });

      if (success) {
        if (role === 'FARMER') router.push('/farmer/dashboard');
        else router.push('/marketplace');
      } else {
        setError('Google authentication succeeded but failed to initialize customer profile.');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google registration failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          location,
          farmSize,
        }),
      });

      if (res.ok) {
        await refreshUser();
        if (role === 'FARMER') router.push('/farmer/dashboard');
        else router.push('/marketplace');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error registering account');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'FARMER', label: 'Farmer / Producer' },
    { value: 'CONSUMER', label: 'Individual Consumer' },
    { value: 'RESTAURANT', label: 'Restaurant / Hotel' },
    { value: 'RETAILER', label: 'Retail Shop / Mart' },
    { value: 'PROCESSOR', label: 'Food Processing Co.' },
    { value: 'DELIVERY_PARTNER', label: 'Logistics Partner' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Create KisanDirect Account</h1>
        <p className="text-xs text-slate-500">
          Join the direct agricultural marketplace as a verified farmer or procurement buyer.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* 1-Click Google Registration */}
        <div>
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleRegister}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl shadow-sm transition hover:shadow flex items-center justify-center gap-3 text-xs disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{googleLoading ? 'Connecting to Google...' : `Sign up with Google as ${roles.find(r => r.value === role)?.label || 'Customer'}`}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or register with details
          </span>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Customer Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patil or GreenBite Foods"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98220 12345"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Location (District / City)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Pune, Nashik, Satara"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {role === 'FARMER' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Farm Landholding Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Enter Platform'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-700 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
