import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRedirect } from '@/lib/redirects';

// SEO redirects from old Neto site URLs to new Next.js URLs
// All redirects are 301 (permanent) for SEO value transfer
const STATIC_REDIRECTS: Record<string, string> = {
  // === E-commerce pages (Neto had cart/checkout) ===
  '/cart': '/request-quote',
  '/checkout': '/request-quote',
  '/basket': '/request-quote',
  '/_mycart': '/request-quote',
  '/quote': '/request-quote',
  '/shop': '/',
  '/catalogue': '/products',
  '/catalog': '/products',

  // === Account pages (no longer applicable) ===
  '/account': '/',
  '/my-account': '/',
  '/login': '/',
  '/register': '/',
  '/_myacct': '/',

  // === Info pages ===
  '/about-us': '/about',
  '/contact-us': '/contact',
  '/form/contact-us': '/contact',
  '/shipping': '/delivery',
  '/shipping-policy': '/delivery',
  '/delivery-policy': '/delivery',
  '/return-policy': '/returns',
  '/returns-policy': '/returns',
  '/privacy-policy': '/privacy',
  '/terms-and-conditions': '/terms',
  '/faq': '/',
  '/index.html': '/',
  '/home': '/',

  // === Category variations ===
  '/pipe-fittings': '/pipe-couplings',
  '/couplings': '/pipe-couplings',
  '/repair-clamps': '/pipe-repair-clamps',
  '/clamps': '/pipe-repair-clamps',
  '/pipe-repair': '/pipe-repair-clamps',
  '/rubber-expansion-joints': '/expansion-joints',
  '/flexible-joints': '/expansion-joints',
  '/flanges': '/flange-adaptors',
  '/flange-adapters': '/flange-adaptors',
  '/valves': '/industrial-valves',

  // === Brand variations ===
  '/straub': '/straub-couplings',
  '/orbit': '/orbit-couplings',
  '/brands/straub': '/straub-couplings',
  '/brands/orbit': '/orbit-couplings',
  '/brands/teekay': '/teekay',
  '/teekay-couplings': '/teekay',
  '/defender': '/defender-valves',
  '/boreflex': '/bore-flex',
  '/bore-flex-rubber': '/bore-flex',

  // === Search ===
  '/search': '/products',
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

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Remove trailing slash (except for root) - SEO best practice
  if (pathname !== '/' && pathname.endsWith('/')) {
    const newPath = pathname.slice(0, -1);
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // Check static redirects first (fastest, no DB)
  const redirectTo = STATIC_REDIRECTS[pathname];
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 301);
  }

  // Wildcard redirects for old Neto patterns
  if (pathname.startsWith('/_myacct')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  if (pathname.startsWith('/buying')) {
    return NextResponse.redirect(new URL('/products', request.url), 301);
  }

  // Check database redirects (cached with 60s TTL)
  // Skip for admin routes, API routes, and static files
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    try {
      const dbRedirect = await getRedirect(pathname);
      if (dbRedirect) {
        const redirectUrl = dbRedirect.toPath.startsWith('http')
          ? dbRedirect.toPath
          : new URL(dbRedirect.toPath, request.url).toString();
        return NextResponse.redirect(redirectUrl, dbRedirect.statusCode);
      }
    } catch (error) {
      // Log error but don't block the request
      console.error('Redirect lookup failed:', error);
    }
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
