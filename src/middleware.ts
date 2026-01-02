import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Geo middleware to set region cookie
function geoMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get Vercel geo headers (available on Vercel deployment)
  const country = request.headers.get('x-vercel-ip-country') || '';
  const region = request.headers.get('x-vercel-ip-region') || '';

  // Only set cookie for Australian visitors
  if (country === 'AU' && region) {
    // Set cookie with region code (WA, SA, NT, NSW, VIC, QLD, TAS, ACT)
    response.cookies.set('geo-region', region, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
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
