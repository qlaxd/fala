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
    await limiter.check(10, ip);

    // Speciális IP címek kezelése
    if (ip === '::1' || ip === '127.0.0.1') {
      const publicIpResponse = await fetch('https://api.ipify.org?format=json');
      if (publicIpResponse.ok) {
        const { ip: publicIp } = await publicIpResponse.json();
        ip = publicIp;
      }
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 
        'User-Agent': 'Fala Farm Website',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status);
      return defaultLocale;
    }
    
    const data = await response.json();
    console.log('IP geolocation data:', data);
    
    // Ha error vagy reserved IP, akkor is próbáljuk meg meghatározni az országot
    if (data.error || data.reserved) {
      const backupResponse = await fetch('http://ip-api.com/json/' + ip);
      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        const locale = backupData.countryCode?.toLowerCase() === 'hu' ? 'hu' : 'en';
        setToCache(ip, locale);
        return locale;
      }
    }
    
    const locale = data.country_code?.toLowerCase() === 'hu' ? 'hu' : 'en';
    setToCache(ip, locale);
    
    return locale;
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      console.warn('Rate limit exceeded for IP:', ip);
    } else {
      console.error('Geolocation error:', error);
    }
    return defaultLocale;
  }
}

// Biztonsági headerek definiálása
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block'
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ha már van nyelvi prefix, csak a headereket állítjuk be
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    // Biztonsági headerek hozzáadása
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // IP cím megszerzése
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  
  // Geolokáció lekérdezése
  const locale = await getGeoData(ip);

  // URL módosítása a megfelelő nyelvi prefixszel
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  
  // Biztonsági headerek hozzáadása a redirect válaszhoz is
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|images|.*\\..*).*)']
};