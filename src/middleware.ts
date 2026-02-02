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

  // === Flat → Nested URL restructure (2025) ===
  // Valves
  '/butterfly-valves': '/industrial-valves/butterfly-valves',
  '/check-valves': '/industrial-valves/check-valves',
  '/ball-valves': '/industrial-valves/ball-valves',
  '/gate-valves': '/industrial-valves/gate-valves',
  '/foot-valves': '/industrial-valves/foot-valves',
  '/float-valves': '/industrial-valves/float-valves',
  '/duckbill-check-valves': '/industrial-valves/duckbill-valves',
  // Strainers
  '/y-strainers': '/strainers/y-strainers',
  '/basket-strainers': '/strainers/basket-strainers',
  '/duplex-basket-strainers': '/strainers/duplex-strainers',
  '/flanged-suction-strainers': '/strainers/suction-strainers',
  // Couplings (brand pages)
  '/straub-couplings': '/pipe-couplings/straub',
  '/orbit-couplings': '/pipe-couplings/orbit',
  '/teekay': '/pipe-couplings/teekay',
  '/muff-couplings': '/pipe-couplings/muff-couplings',
  // Expansion joints flat→nested
  '/single-sphere-expansion-joints': '/expansion-joints/single-sphere',
  '/twin-sphere-expansion-joints': '/expansion-joints/twin-sphere',
  '/single-arch-expansion-joints': '/expansion-joints/single-arch',
  '/double-arch-expansion-joints': '/expansion-joints/double-arch',
  '/triple-arch-expansion-joints': '/expansion-joints/triple-arch',
  '/quadruple-arch-expansion-joints': '/expansion-joints/quadruple-arch',
  '/reducing-expansion-joints': '/expansion-joints/reducing',
  '/ptfe-lined-expansion-joints': '/expansion-joints/ptfe-lined',

  // === Brand variations ===
  '/straub': '/pipe-couplings/straub',
  '/orbit': '/pipe-couplings/orbit',
  '/brands/straub': '/pipe-couplings/straub',
  '/brands/orbit': '/pipe-couplings/orbit',
  '/brands/teekay': '/pipe-couplings/teekay',
  '/teekay-couplings': '/pipe-couplings/teekay',
  '/defender': '/defender-valves',
  '/boreflex': '/bore-flex',
  '/bore-flex-rubber': '/bore-flex',
  '/brand': '/brands',

  // === Old /brand/ structure (Neto) ===
  '/brand/straub-couplings': '/pipe-couplings/straub',
  '/brand/teekay-couplings': '/pipe-couplings/teekay',
  '/brand/lever-operated-knife-gate-valve': '/industrial-valves',
  '/brand/flanged-suction-strainer': '/strainers/suction-strainers',
  '/brand/y-strainer': '/strainers/y-strainers',
  '/brand/ball-check-valve-cast-iron-fbe-coated-flanged': '/industrial-valves/check-valves',
  '/brand/db-2-flanged-duckbill-check-valve-as2129-table-e-n': '/industrial-valves/duckbill-valves',
  '/brand/defender-valves-inline-duckbill-check-valve-epdm': '/defender-valves',
  '/brand/orbit-pipe-repair-clamp-400mm-wide': '/pipe-repair-clamps',
  '/brand/cf8m': '/industrial-valves',

  // === Old /valves/ structure (Neto) ===
  '/valves/duckbill-check-valve': '/industrial-valves/duckbill-valves',
  '/valves/dual-plate-check-valve': '/industrial-valves/check-valves',
  '/valves/foot-valve': '/industrial-valves/foot-valves',
  '/valves/float-valve': '/industrial-valves/float-valves',
  '/valves/butterfly-valve': '/industrial-valves/butterfly-valves',
  '/valves/ball-check-valve': '/industrial-valves/check-valves',
  '/valves/swing-check-valve': '/industrial-valves/check-valves',
  '/valves/knife-gate-valves': '/industrial-valves/gate-valves',

  // === Old /strainers/ structure (Neto) ===
  '/strainers/y-strainer': '/strainers/y-strainers',
  '/strainers/simplex-basket-strainer': '/strainers/basket-strainers',
  '/strainers/flanged-suction-strainer': '/strainers/suction-strainers',
  '/strainers/duplex-basket-strainer': '/strainers/duplex-strainers',
  '/strainers/fabricated-basket-strainer-with-davit-arm-and-cabl': '/strainers/basket-strainers',
  '/strainers/heavy-duty-y-strainer-filter-screen': '/strainers/y-strainers',

  // === Old /rubber-expansion-joints/ structure (Neto) ===
  '/rubber-expansion-joints/fsf-single-sphere': '/expansion-joints/single-sphere',
  '/rubber-expansion-joints/double-arch-rubber-expansion-joint': '/expansion-joints/double-arch',
  '/rubber-expansion-joints/twin-sphere-rubber-expansion-joint-ftf': '/expansion-joints/twin-sphere',
  '/rubber-expansion-joints/reducing-rubber-expansion-joint': '/expansion-joints/reducing',
  '/rubber-expansion-joints/ptfe-lined-rubber-expansion-joint-fsf': '/expansion-joints/ptfe-lined',
  '/rubber-expansion-joints/control-rod-set-rubber-expansion-joint-accessory': '/expansion-joints',

  // === Old /muff-couplings/ structure (Neto) ===
  '/muff-couplings/muff-couplings': '/pipe-couplings/muff-couplings',

  // === Old /flange-adapters/ structure (Neto) ===
  '/flange-adapters/stainless-steel-flange-adapter-od-range-30.0mm-to': '/flange-adaptors',

  // === Old /clamps-couplings/straub/ structure (Neto) ===
  '/clamps-couplings/straub/flex-2': '/pipe-couplings/straub',
  '/clamps-couplings/straub/flex-3': '/pipe-couplings/straub',
  '/clamps-couplings/straub/metal-grip': '/pipe-couplings/straub',

  // === Old /industrial-valves-full-range... structure (Neto) ===
  '/industrial-valves-full-range-for-flow-control-back/gate-valves': '/industrial-valves/gate-valves',
  '/industrial-valves-full-range-for-flow-control-back/flanged-ball-valves': '/industrial-valves/ball-valves',
  '/industrial-valves-full-range-for-flow-control-back/pinch-valves': '/industrial-valves',

  // === Old flat product URLs (Neto) ===
  // NOTE: Many Neto product URLs are now actual product slugs - don't add redirects for products that exist!
  // Use 'SELECT slug FROM products WHERE slug = ...' to verify before adding redirects here.
  '/orbit-pipe-repair-clamp-series-1-and-200mm-long': '/pipe-repair-clamps',
  '/orbit-pipe-repair-clamp-series-1-and-100mm-long': '/pipe-repair-clamps',
  // '/elbow-repair-clamp': '/pipe-repair-clamps', // REMOVED: actual product exists at this slug
  // '/flex-grip-open-l': '/pipe-couplings', // REMOVED: actual product exists at this slug
  '/plast-coupling': '/pipe-couplings',
  '/muff-couplings-aluminium-table-d-e': '/pipe-couplings/muff-couplings',
  '/straub-grip': '/pipe-couplings/straub',
  '/metal-lock-s': '/pipe-couplings/straub',
  '/resilient-seated-swing-check-valve-flanged-table-e': '/industrial-valves/check-valves',
  '/ball-check-valve-stainless-steel-316-flanged-table': '/industrial-valves/check-valves',
  // '/control-rod-rubber-expansion-joint-accessory': '/expansion-joints', // REMOVED: actual product exists at this slug
  '/lever-operated-knife-gate-valve-316ss-metal-seated': '/industrial-valves/gate-valves',
  '/ball-valve-flanged-ansi-150lb': '/industrial-valves/ball-valves',
  '/gate-valve-cf8m-316ss-table-e': '/industrial-valves/gate-valves',
  // '/ptfe-lined-butterfly-valve-universal-wafer': '/industrial-valves/butterfly-valves', // REMOVED: actual product exists at this slug
  '/swing-check-valve-wcb-flanged-ansi-150lb': '/industrial-valves/check-valves',
  '/foot-valve-galvanised-flanged-table-d': '/industrial-valves/foot-valves',
  // '/foot-valve-hdpe-flanged-table-e': '/industrial-valves/foot-valves', // REMOVED: actual product exists at this slug
  '/eccentric-reducing-rubber-expansion-joint-with-tab': '/expansion-joints/reducing',
  '/concentric-reducing-rubber-expansion-joint-with-ta': '/expansion-joints/reducing',
  // '/butterfly-valve-316-stainless-steel-cf8m-body-ptfe': '/industrial-valves/butterfly-valves', // REMOVED: actual product exists at this slug
  // '/stainless-steel-y-strainer-cf8m-flanged-ansi-150lb': '/strainers/y-strainers', // REMOVED: actual product exists at this slug
  '/db-3-inline-duckbill-check-valve-epdm-flanged-tabl': '/industrial-valves/duckbill-valves',

  // === Old blog (no longer exists) ===
  '/blog/the-applications-of-pipe-couplings-in-the-mining': '/pipe-couplings',

  // === Search ===
  '/search': '/products',
  '/products': '/products',
};

// Geo middleware to set country/region cookies for pricing visibility
function geoMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Block search engine indexing on non-production domains (vercel.app previews)
  const host = request.headers.get('host') || '';
  const isProduction = host === 'dewaterproducts.com.au' || host === 'www.dewaterproducts.com.au';
  if (!isProduction) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

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

  // Redirect www to non-www for canonical URLs (SEO)
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = new URL(request.url);
    url.host = host.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }

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
  // Old Neto product ID patterns (e.g., /brand/~-203, /brand/~-210)
  if (pathname.match(/^\/brand\/~-\d+$/)) {
    return NextResponse.redirect(new URL('/products', request.url), 301);
  }
  // Old Neto truncated URLs with ~XXX suffix (e.g., /ball-valve-3-way-t-or-l-port-316-stainless-steel-f~1079)
  if (pathname.match(/~\d+$/)) {
    // Try to redirect based on product type in URL
    if (pathname.includes('valve')) {
      return NextResponse.redirect(new URL('/industrial-valves', request.url), 301);
    }
    if (pathname.includes('strainer')) {
      return NextResponse.redirect(new URL('/strainers', request.url), 301);
    }
    if (pathname.includes('coupling')) {
      return NextResponse.redirect(new URL('/pipe-couplings', request.url), 301);
    }
    if (pathname.includes('expansion-joint')) {
      return NextResponse.redirect(new URL('/expansion-joints', request.url), 301);
    }
    return NextResponse.redirect(new URL('/products', request.url), 301);
  }
  // Old /rubber-expansion-joints/ prefix (catch any not in static list)
  if (pathname.startsWith('/rubber-expansion-joints/')) {
    return NextResponse.redirect(new URL('/expansion-joints', request.url), 301);
  }
  // Old /clamps-couplings/ prefix
  if (pathname.startsWith('/clamps-couplings/')) {
    return NextResponse.redirect(new URL('/pipe-couplings', request.url), 301);
  }
  // Old /industrial-valves-full-range... prefix
  if (pathname.startsWith('/industrial-valves-full-range')) {
    return NextResponse.redirect(new URL('/industrial-valves', request.url), 301);
  }
  // Old blog posts
  if (pathname.startsWith('/blog/')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  // Old PDF brochures (these may not exist anymore)
  if (pathname.startsWith('/assets/brochures/')) {
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
