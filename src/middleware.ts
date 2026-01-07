import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No redirects - site uses flat URL architecture with direct links only
// All subcategory pages are at root level (e.g., /butterfly-valves, /y-strainers)
// All brands have dedicated pages: /straub-couplings, /orbit-couplings, /teekay, /bore-flex, /defender-valves, /defender-strainers
const STATIC_REDIRECTS: Record<string, string> = {};

// Geo middleware to set country/region cookies for pricing visibility
function geoMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get Vercel geo headers (available on Vercel deployment)
  const country = request.headers.get('x-vercel-ip-country') || '';
  const region = request.headers.get('x-vercel-ip-region') || '';

  // Set country cookie for all visitors (used for price visibility)
  // In development (no Vercel headers), default to AU for testing
  const effectiveCountry = country || (process.env.NODE_ENV === 'development' ? 'AU' : '');

  if (effectiveCountry) {
    response.cookies.set('geo-country', effectiveCountry, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  // Set region cookie for Australian visitors (for state-specific messaging)
  if (country === 'AU' && region) {
    response.cookies.set('geo-region', region, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

// Auth middleware for admin routes
const authMiddleware = withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check static redirects first (fastest, no DB)
  const redirectTo = STATIC_REDIRECTS[pathname];
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 301);
  }

  // Apply auth middleware only to admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    return authMiddleware(request as any, {} as any);
  }

  // Apply geo middleware to all other routes
  return geoMiddleware(request);
}

export const config = {
  // Match all routes except static files and api
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
