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

  // Old e-commerce patterns
  '/shop': '/',
  '/catalogue': '/products',
  '/catalog': '/products',
  '/cart': '/request-quote',
  '/checkout': '/request-quote',
  '/basket': '/request-quote',
  '/account': '/',
  '/my-account': '/',
  '/search': '/products',

  // Category variations
  '/pipe-fittings': '/pipe-couplings',
  '/couplings': '/pipe-couplings',
  '/repair-clamps': '/pipe-repair',
  '/clamps': '/pipe-repair',
  '/rubber-expansion-joints': '/expansion-joints',
  '/flexible-joints': '/expansion-joints',
  '/flanges': '/flange-adaptors',
  '/flange-adapters': '/flange-adaptors',
  '/boreflex': '/expansion-joints',

  // Brand shortcuts
  '/straub-couplings': '/brands/straub',
  '/orbit-couplings': '/brands/orbit',
  '/teekay-couplings': '/brands/teekay',
  '/defender': '/brands/defender-valves',

  // Valve variations
  '/butterfly-valves': '/valves/butterfly-valve',
  '/check-valves': '/valves/check-valves',
  '/gate-valves': '/valves/gate-valve',
  '/ball-valves': '/valves/ball-valve',
  '/foot-valves': '/valves/foot-valve',
  '/float-valves': '/valves/float-valve',

  // Strainer variations
  '/y-strainers': '/strainers/y-strainer',
  '/basket-strainers': '/strainers/simplex-basket-strainer',

  // Info pages
  '/about-us': '/about',
  '/contact-us': '/contact',
  '/shipping': '/delivery',
  '/shipping-policy': '/delivery',
  '/return-policy': '/returns',
  '/privacy-policy': '/privacy',
  '/terms': '/privacy',
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
