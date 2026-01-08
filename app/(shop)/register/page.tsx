'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/register-form';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';

export default function RegisterPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const { t } = useLanguage();

  useEffect(() => {
    // Only redirect if hydrated and user is logged in
    if (_hasHydrated && token && user) {
      router.push('/account');
    }
  }, [_hasHydrated, token, user, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Don't show register form if user is already logged in (will redirect)
  if (token && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">{t('auth.createAccount') || 'Create Account'}</h1>
          <p className="text-muted-foreground">{t('auth.registerSubtitle') || 'Join TeleTrade Hub and start shopping'}</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
