'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, _hasHydrated } = useAuthStore();
  const { t } = useLanguage();

  useEffect(() => {
    // Only redirect if hydrated and user is logged in
    if (_hasHydrated && token && user) {
      const redirect = searchParams.get('redirect');
      // Validate redirect URL to prevent open redirects
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        router.push(redirect);
      } else {
        router.push('/account');
      }
    }
  }, [_hasHydrated, token, user, router, searchParams]);

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

  // Don't show login form if user is already logged in (will redirect)
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
          <h1 className="font-display text-3xl font-bold mb-2">{t('auth.welcomeBack') || 'Welcome Back'}</h1>
          <p className="text-muted-foreground">{t('auth.loginSubtitle') || 'Login to your account to continue shopping'}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
