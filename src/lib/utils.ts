import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strip HTML tags and entities from a string
 * Used to clean legacy HTML-formatted content for plain text editing
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')      // Remove HTML tags
    .replace(/&nbsp;/g, ' ')       // Non-breaking space
    .replace(/&amp;/g, '&')        // Ampersand
    .replace(/&lt;/g, '<')         // Less than
    .replace(/&gt;/g, '>')         // Greater than
    .replace(/&quot;/g, '"')       // Quote
    .replace(/&#39;/g, "'")        // Apostrophe
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();
}
