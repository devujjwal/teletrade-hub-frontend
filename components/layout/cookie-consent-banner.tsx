'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'teletrade_cookie_consent';

type ConsentMode = 'essential' | 'all';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return !savedConsent;
  });

  const saveConsent = (mode: ConsentMode) => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, mode);
    document.cookie = `teletrade_cookie_consent=${mode}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
      <div className="container-wide flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-slate-900">Cookie notice</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            We use essential cookies to keep TeleTrade Hub secure and functional, and optional cookies to improve
            performance and user experience. You can review the details in our{' '}
            <Link href="/cookies" className="font-medium text-primary hover:underline">
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => saveConsent('essential')}>
            Essential only
          </Button>
          <Button onClick={() => saveConsent('all')}>Accept all cookies</Button>
        </div>
      </div>
    </div>
  );
}
