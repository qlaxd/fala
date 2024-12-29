import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n.config';
import { rateLimit } from './lib/utils/rateLimit';
import { getFromCache, setToCache } from './lib/utils/geoCache';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 perc
  uniqueTokenPerInterval: 500,
});

async function getGeoData(ip: string) {
  try {
    // Először ellenőrizzük a cache-t
    const cachedLocale = getFromCache(ip);
    if (cachedLocale) return cachedLocale;

    // Rate limit ellenőrzés
    await limiter.check(10, ip); // 10 kérés/perc/IP

    const response = await fetch('https://ipapi.co/json/', {
      headers: { 'User-Agent': 'Fala Farm Website' },
      next: { revalidate: 86400 } // 24 óra cache
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status);
      return defaultLocale;
    }
    
    const data = await response.json();
    const locale = data.country_code?.toLowerCase() === 'hu' ? 'hu' : 'en';
    
    // Cache-eljük az eredményt
    setToCache(ip, locale);
    
    return locale;
  } catch (error) {
    if (error.message === 'Rate limit exceeded') {
      console.warn('Rate limit exceeded for IP:', ip);
    } else {
      console.error('Geolocation error:', error);
    }
    return defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ha már van nyelvi prefix, nem csinálunk semmit
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;

  // IP cím megszerzése
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  
  // Geolokáció lekérdezése
  const locale = await getGeoData(ip);

  // URL módosítása a megfelelő nyelvi prefixszel
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|images|.*\\..*).*)']
};