import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n.config';
import { rateLimit } from '@/utils/rateLimit';
import { getFromCache, setToCache } from '@/utils/geoCache';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 perc
  uniqueTokenPerInterval: 500,
  max: 5 // Engedélyezett kérés per IP percenként
});

async function getGeoData(ip: string) {
  try {
    // Cache ellenőrzés
    const cachedLocale = getFromCache(ip);
    if (cachedLocale) return cachedLocale;

    // Rate limit ellenőrzés
    await limiter.check(ip);

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

    // Hibás vagy fenntartott IP címek kezelése
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
  
  // API és statikus útvonalak teljes kihagyása
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/api'
  ) {
    console.log('Skipping middleware for API/static route:', pathname);
    return NextResponse.next();
  }

  console.log(`Middleware processing path: ${pathname}, method: ${request.method}, headers: ${request.headers}, body: ${request.body}, request: ${request}, url: ${request.url}`);

  // API útvonalak kihagyása előtt
  console.log(`Potential redirect path: ${request.nextUrl.pathname}`);

  // API útvonalak kihagyása
  console.log('Request method:', request.method);
  console.log('Request path:', request.url);
  console.log('Is API route:', pathname.startsWith('/api/'));
  console.log('Pathname starts with /api/:', pathname.startsWith('/api/'));
  console.log('Full condition:', pathname.startsWith('/api/') || request.method === 'POST');
  
  if (pathname.startsWith('/api/') || request.method === 'POST') {
    console.log(`API útvonalak kihagyása: ${pathname.startsWith("/api/") || request.method === "POST"}`);
    return NextResponse.next();
  }

  console.log(`API útvonalak kihagyása: ${pathname.startsWith("/api/") || request.method === "POST"}`);
  
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
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  // Geolokáció lekérdezése
  const locale = await getGeoData(ip);

  // URL módosítása a megfelelő nyelvi prefixszel
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);

  console.log(`Redirecting to: ${request.nextUrl.pathname}`);
  console.log(`Response: ${response}`);
  console.log(`Security headers: ${Object.entries(securityHeaders).map(([key, value]) => `${key}: ${value}`).join(', ')}`);
  console.log(`Locale: ${locale}`);
  console.log(`IP: ${ip}`);
  console.log(`Pathname: ${pathname}`);
  console.log(`Method: ${request.method}`);
  console.log(`Headers: ${request.headers}`);
  console.log(`Body: ${request.body}`);
  console.log(`Request: ${request}`);
  console.log(`URL: ${request.url}`);


  // Biztonsági headerek hozzáadása a redirect válaszhoz is
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|static|.*\\..*|favicon.ico).*)',
    // Optional: Add locale prefix to all pages
    '/'
  ]
};
console.log(`Middleware config: ${config}`);
