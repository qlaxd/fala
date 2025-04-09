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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Completely skip API routes and non-page routes
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    request.method !== 'GET'
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has locale, just add security headers
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Otherwise, redirect to locale prefixed path
  const locale = await getGeoData(request.headers.get('x-forwarded-for') || 'unknown');
  
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Explicitly exclude API routes from the matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/.*)
     * - Static files/assets (images, js, css, etc.)
     * - Favicon, robots.txt, etc.
     */
    '/((?!api|_next|.*\\..*|favicon.ico).*)'
  ]
};
console.log(`Middleware config: ${config}`);
