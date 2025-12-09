import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Create rate limiter instance - only if env vars are configured
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiter: 5 requests per minute per IP
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'dewater-ratelimit',
    })
  : null;

/**
 * Check rate limit for an IP address
 * Returns null if rate limiting is not configured or request is allowed
 * Returns a NextResponse with 429 status if rate limited
 */
export async function checkRateLimit(ip: string): Promise<NextResponse | null> {
  // If rate limiting is not configured, allow all requests
  if (!ratelimit) {
    console.warn('Rate limiting not configured - UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set');
    return null;
  }

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    // Log error but don't block requests if rate limiting fails
    console.error('Rate limit check failed:', error);
    return null;
  }
}

/**
 * Get client IP from request headers
 * Works with Vercel and Cloudflare
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  // Prefer Cloudflare IP, then forwarded-for, then real-ip
  if (cfConnectingIp) return cfConnectingIp;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp;

  return '127.0.0.1'; // Fallback for local development
}
