import { headers } from 'next/headers';

export type SiteLanguage = 'en' | 'de' | 'fr' | 'es' | 'it' | 'sk';

const VALID_LANGUAGES: SiteLanguage[] = ['en', 'de', 'fr', 'es', 'it', 'sk'];

export async function getServerLanguage(): Promise<SiteLanguage> {
  const requestHeaders = await headers();
  const headerLanguage = requestHeaders.get('x-teletrade-lang');

  if (headerLanguage && VALID_LANGUAGES.includes(headerLanguage as SiteLanguage)) {
    return headerLanguage as SiteLanguage;
  }

  return 'en';
}

export function withLanguage(path: string, language: SiteLanguage): string {
  if (language === 'en') return path;

  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  params.set('lang', language);

  return `${pathname}?${params.toString()}`;
}
