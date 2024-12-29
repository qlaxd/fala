import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hu'];
const defaultLocale = 'en';

function isPublicFile(pathname: string) {
  return (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  );
}

function getLocaleFromHeader(request: NextRequest): string | undefined {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return undefined;
  
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
  const locale = languages.find(lang => 
    locales.includes(lang) || locales.includes(lang.split('-')[0])
  );
  
  return locale ? locale.split('-')[0] : undefined;
}

async function getLocaleFromIP(request: NextRequest): Promise<string | undefined> {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for');
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return data.country_code === 'HU' ? 'hu' : 'en';
  } catch {
    return undefined;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const browserLocale = getLocaleFromHeader(request);
    const geoLocale = await getLocaleFromIP(request);
    const locale = browserLocale || geoLocale || defaultLocale;

    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
};