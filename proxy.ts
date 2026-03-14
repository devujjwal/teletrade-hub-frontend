import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const VALID_LANGUAGES = new Set(['en', 'de', 'fr', 'es', 'it', 'sk']);
const LANGUAGE_COOKIE = 'teletrade_language';
const LANGUAGE_HEADER = 'x-teletrade-lang';

export function proxy(request: NextRequest) {
  const queryLang = request.nextUrl.searchParams.get('lang');
  const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value;

  const activeLang = VALID_LANGUAGES.has(queryLang || '')
    ? queryLang!
    : VALID_LANGUAGES.has(cookieLang || '')
      ? cookieLang!
      : 'en';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LANGUAGE_HEADER, activeLang);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (cookieLang !== activeLang) {
    response.cookies.set(LANGUAGE_COOKIE, activeLang, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
    });
    response.cookies.set('language', activeLang, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
