import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CookieConsentBanner from '@/components/layout/cookie-consent-banner';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import { LanguageProvider, type Language } from '@/contexts/language-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { headers } from 'next/headers';

const VALID_LANGUAGES: Language[] = ['en', 'de', 'fr', 'es', 'it', 'sk'];

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const headerLanguage = requestHeaders.get('x-teletrade-lang');
  const initialLanguage = VALID_LANGUAGES.includes(headerLanguage as Language)
    ? (headerLanguage as Language)
    : 'en';

  return (
    <SettingsProvider>
      <LanguageProvider key={initialLanguage} initialLanguage={initialLanguage}>
        <Header />
        <main className="min-h-screen pb-mobile-nav">{children}</main>
        <Footer />
        <CookieConsentBanner />
        <MobileBottomNav />
      </LanguageProvider>
    </SettingsProvider>
  );
}
