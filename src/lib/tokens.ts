import { randomBytes } from 'crypto'

/**
 * Generate a secure random token for quote approval
 * Returns a URL-safe base64 string (32 bytes = 43 chars after encoding)
 */
export function generateApprovalToken(): string {
  return randomBytes(32).toString('base64url')
}

/**
 * Calculate expiration date for approval token
 * Default: 7 days from now
 */
export function getTokenExpiration(days: number = 7): Date {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + days)
  return expiration
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > new Date(expiresAt)
}
