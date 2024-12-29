import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n.config';

async function getGeoData() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      console.error('API response not OK:', response.status);
      return 'en';
    }
    
    const data = await response.json();
    console.log('IP data:', data);
    
    return data.country_code?.toLowerCase() === 'hu' ? 'hu' : 'en';
  } catch (error) {
    console.error('Geolocation error:', error);
    return 'en';
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ha már van nyelvi prefix, nem csinálunk semmit
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;

  // Geolokáció lekérdezése
  const locale = await getGeoData();

  // URL módosítása a megfelelő nyelvi prefixszel
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|images|.*\\..*).*)']
};