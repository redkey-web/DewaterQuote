import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Static redirects for common URL changes (loaded at startup, no DB query)
// These are checked before anything else for performance
const STATIC_REDIRECTS: Record<string, string> = {
  // Bore-Flex -> Expansion Joints consolidation
  '/bore-flex': '/expansion-joints',
  '/bore-flex/single-sphere': '/expansion-joints/single-sphere',
  '/bore-flex/twin-sphere': '/expansion-joints/twin-sphere',
  '/bore-flex/single-arch': '/expansion-joints/single-arch',
  '/bore-flex/double-arch': '/expansion-joints/double-arch',
  '/bore-flex/reducing': '/expansion-joints/reducing',
};

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
