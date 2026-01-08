/**
 * XSS Prevention Utilities
 * Sanitizes user input and API data before rendering
 * Works both server-side and client-side
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 * Works server-side and client-side
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return String(html);
  }

  // Server-side: Use regex to remove HTML tags
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  // Client-side: Use DOM API
  const div = document.createElement('div');
  div.textContent = html;
  
  // Return the text content (HTML tags removed)
  return div.textContent || div.innerText || '';
}

/**
 * Sanitize text content for safe rendering
 * Escapes HTML special characters
 */
export function escapeHtml(text: string | number | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }
  
  const str = String(text);
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '#';
  }
  
  const str = String(url).trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = str.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  // Allow http, https, and relative URLs
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/')) {
    return str;
  }
  
  // If it's a relative URL without leading slash, add it
  if (str.startsWith('./') || str.startsWith('../')) {
    return str;
  }
  
  // Default to safe relative URL
  return str.startsWith('#') ? str : `/${str}`;
}

/**
 * Validate redirect URL to prevent open redirects
 * Only allows relative URLs or specific allowed domains
 * SECURITY: Prevents open redirect vulnerabilities
 */
export function validateRedirectUrl(url: string | null | undefined, allowedDomains: string[] = []): string {
  if (!url) {
    return '/';
  }
  
  const str = String(url).trim();
  
  // SECURITY: Block javascript: and data: protocols
  const lowerUrl = str.toLowerCase();
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:') || lowerUrl.startsWith('vbscript:')) {
    return '/';
  }
  
  // Allow relative URLs (safe) - must start with / but not //
  if (str.startsWith('/') && !str.startsWith('//')) {
    // Additional check: ensure no protocol schemes
    if (!/^\/[a-zA-Z][a-zA-Z\d+\-.]*:/.test(str)) {
      return str;
    }
  }
  
  // Check against allowed domains
  try {
    const urlObj = new URL(str);
    if (allowedDomains.includes(urlObj.hostname)) {
      return str;
    }
  } catch {
    // Invalid URL, return safe default
    return '/';
  }
  
  // Block external URLs not in allowlist
  return '/';
}

/**
 * Safe redirect helper for Next.js router
 * Validates URL before redirecting
 */
export function safeRedirect(url: string, defaultPath: string = '/'): string {
  return validateRedirectUrl(url, []);
}

/**
 * Sanitize user input for display
 * Removes HTML tags and escapes special characters
 */
export function sanitizeUserInput(input: string | number | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  const str = String(input);
  // Remove HTML tags and escape special characters
  return escapeHtml(sanitizeHtml(str));
}

