import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n.config';

async function getGeoData(ip: string) {
  // Ha localhost vagy fejlesztői környezet
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    return 'hu'; // Fejlesztés közben legyen magyar
  }

  try {
    // API kulcs nélküli hívás
    const response = await fetch(`https://ipapi.co/${ip}/country/`);
    const countryCode = await response.text();
    
    // Debug log
    console.log('IP:', ip);
    console.log('Detected country code:', countryCode.toLowerCase());
    
    return countryCode.toLowerCase();
  } catch (error) {
    console.error('Hiba a geolokáció lekérdezésekor:', error);
    return 'en'; // Hiba esetén angol
  }
}

const countryToLocale: { [key: string]: string } = {
  // Csak Magyarország esetén magyar nyelv
  hu: 'hu',
  
  // Minden más esetben angol
  default: 'en'
};

export async function middleware(request: NextRequest) {
  // Kihagyjuk az API útvonalakat és statikus fájlokat
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return;
  }

  const pathname = request.nextUrl.pathname;
  
  // Ha már van nyelvi prefix, nem csinálunk semmit
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;

  // IP cím lekérése
  const ip = request.ip ?? request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIP = ip || forwardedFor?.split(',')[0] || 'unknown';

  // Geolokáció lekérdezése
  const countryCode = await getGeoData(clientIP);
  // Csak akkor magyar, ha az IP magyar
  const locale = countryCode === 'hu' ? 'hu' : 'en';

  // URL módosítása a megfelelő nyelvi prefixszel
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|images|.*\\..*).*)']
};