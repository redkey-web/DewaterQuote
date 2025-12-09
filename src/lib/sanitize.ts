/**
 * HTML sanitization utilities for preventing XSS attacks
 */

/**
 * Escapes HTML special characters to prevent XSS in email templates
 * and other HTML contexts where user input is interpolated.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes a URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '';
  }
  return url;
}

/**
 * Escapes content for use in email href attributes
 */
export function escapeEmailHref(email: string): string {
  if (!email) return '';
  // Only allow valid email characters
  return email.replace(/[^a-zA-Z0-9._%+-@]/g, '');
}

/**
 * Escapes content for use in tel: href attributes
 */
export function escapeTelHref(phone: string): string {
  if (!phone) return '';
  // Only allow digits, +, -, (), and spaces
  return phone.replace(/[^0-9+\-() ]/g, '');
}
