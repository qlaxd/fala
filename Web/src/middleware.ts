// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { defaultLocale, locales } from './i18n.config';

// // Security headers
// const securityHeaders = {
//   'X-DNS-Prefetch-Control': 'on',
//   'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
//   'X-Frame-Options': 'SAMEORIGIN',
//   'X-Content-Type-Options': 'nosniff',
//   'Referrer-Policy': 'strict-origin-when-cross-origin',
//   'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
//   'X-XSS-Protection': '1; mode=block'
// };

// async function getGeoData(ip: string) {
//   try {
//     // Special-case local IPs
//     if (ip === '::1' || ip === '127.0.0.1') {
//       const publicIpResponse = await fetch('https://api.ipify.org?format=json');
//       if (publicIpResponse.ok) {
//         const { ip: publicIp } = await publicIpResponse.json();
//         ip = publicIp;
//       }
//     }

//     const response = await fetch(`https://ipapi.co/${ip}/json/`, {
//       headers: { 
//         'User-Agent': 'Fala Farm Website',
//         'Accept': 'application/json'
//       },
//       cache: 'no-store'
//     });

//     if (!response.ok) {
//       return defaultLocale;
//     }
    
//     const data = await response.json();

//     if (data.error || data.reserved) {
//       const backupResponse = await fetch('http://ip-api.com/json/' + ip);
//       if (backupResponse.ok) {
//         const backupData = await backupResponse.json();
//         return backupData.countryCode?.toLowerCase() === 'hu' ? 'hu' : 'en';
//       }
//     }

//     return data.country_code?.toLowerCase() === 'hu' ? 'hu' : 'en';
//   } catch (error: unknown) {
//     return defaultLocale;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Skip API and static routes
//   if (
//     pathname.startsWith('/api') || 
//     pathname.startsWith('/_next') || 
//     pathname.includes('.') ||
//     request.method !== 'GET'
//   ) {
//     return NextResponse.next();
//   }

//   // Check if the pathname already has a locale
//   const pathnameHasLocale = locales.some(
//     locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   // If pathname already has locale, just add security headers
//   if (pathnameHasLocale) {
//     const response = NextResponse.next();
//     Object.entries(securityHeaders).forEach(([key, value]) => {
//       response.headers.set(key, value);
//     });
//     return response;
//   }

//   // Otherwise, redirect to locale prefixed path
//   const locale = await getGeoData(request.headers.get('x-forwarded-for') || 'unknown');
  
//   request.nextUrl.pathname = `/${locale}${pathname}`;
//   const response = NextResponse.redirect(request.nextUrl);
  
//   // Add security headers
//   Object.entries(securityHeaders).forEach(([key, value]) => {
//     response.headers.set(key, value);
//   });
  
//   return response;
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next|.*\\..*|favicon.ico).*)'
//   ]
// };

import { NextResponse } from 'next/server';
export function middleware() {
  return NextResponse.next();
}