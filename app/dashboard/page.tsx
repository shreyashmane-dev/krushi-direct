'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { getRoleDashboardUrl } from '@/lib/auth/demo-users';
import { Sprout } from 'lucide-react';

export default function UniversalDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const dest = getRoleDashboardUrl(user.role);
        router.push(dest);
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 animate-pulse">
        <Sprout className="w-8 h-8 animate-spin" />
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900">Loading Your Working Panel...</h2>
        <p className="text-xs text-slate-500 mt-1">
          {user ? `Configuring ${user.role} workspace for ${user.name}` : 'Authenticating platform persona...'}
        </p>
      </div>
    </div>
  );
}
