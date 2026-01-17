import { db } from '@/db';
import { redirects } from '@/db/schema';
import { eq, and, or, isNull, gt } from 'drizzle-orm';

// In-memory cache for redirect lookups
// Edge-compatible (no Redis needed)
interface RedirectEntry {
  toPath: string;
  statusCode: number;
}

interface CacheEntry {
  data: RedirectEntry | null;
  expires: number;
}

const redirectCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Get a redirect from the cache or database
 * Returns null if no redirect found or redirect is expired/inactive
 */
export async function getRedirect(fromPath: string): Promise<RedirectEntry | null> {
  // Normalize path: lowercase, ensure leading slash
  const normalizedPath = normalizePath(fromPath);

  // Check cache first
  const cached = redirectCache.get(normalizedPath);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  // Fetch from database
  try {
    const now = new Date();
    const redirect = await db
      .select({
        toPath: redirects.toPath,
        statusCode: redirects.statusCode,
      })
      .from(redirects)
      .where(
        and(
          eq(redirects.fromPath, normalizedPath),
          eq(redirects.isActive, true),
          or(
            isNull(redirects.expiresAt),
            gt(redirects.expiresAt, now)
          )
        )
      )
      .limit(1);

    const result = redirect[0] ? {
      toPath: redirect[0].toPath,
      statusCode: redirect[0].statusCode ?? 301,
    } : null;

    // Cache the result (including null for misses)
    redirectCache.set(normalizedPath, {
      data: result,
      expires: Date.now() + CACHE_TTL,
    });

    return result;
  } catch (error) {
    console.error('Failed to fetch redirect:', error);
    return null;
  }
}

/**
 * Invalidate the entire redirect cache
 * Called after admin actions (create, update, delete)
 */
export function invalidateRedirectCache(): void {
  redirectCache.clear();
}

/**
 * Invalidate a specific path from the cache
 */
export function invalidateRedirectCachePath(fromPath: string): void {
  const normalizedPath = normalizePath(fromPath);
  redirectCache.delete(normalizedPath);
}

/**
 * Normalize a URL path for consistent lookup
 */
export function normalizePath(path: string): string {
  // Ensure leading slash
  let normalized = path.startsWith('/') ? path : '/' + path;
  // Remove trailing slash (except for root)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Lowercase
  normalized = normalized.toLowerCase();
  return normalized;
}

/**
 * Validate redirect paths
 * Returns an error message if invalid, null if valid
 */
export function validateRedirectPaths(fromPath: string, toPath: string): string | null {
  // Check required fields
  if (!fromPath || !toPath) {
    return 'Both fromPath and toPath are required';
  }

  // Normalize paths
  const normalizedFrom = normalizePath(fromPath);
  const normalizedTo = toPath.startsWith('http') ? toPath : normalizePath(toPath);

  // Check for circular redirect
  if (normalizedFrom === normalizedTo) {
    return 'Cannot redirect a path to itself';
  }

  // fromPath must be a local path
  if (fromPath.startsWith('http')) {
    return 'fromPath must be a local path (starting with /)';
  }

  return null;
}
