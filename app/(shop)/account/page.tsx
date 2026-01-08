'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import AccountTabs from '@/components/account/account-tabs';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check authentication - redirect if not logged in
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Show loading while checking auth
  if (!token || !user) {
    return (
      <div className="container-wide py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Account</h1>
      <AccountTabs />
    </div>
  );
}

