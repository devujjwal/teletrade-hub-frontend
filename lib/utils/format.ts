export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getProxiedImageUrl(originalUrl?: string): string {
  if (!originalUrl) return '/placeholder-image.jpg';
  
  // If it's a local upload (starts with /uploads/), serve directly from API
  if (originalUrl.startsWith('/uploads/')) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vs-mjrinfotech.com';
    return `${API_URL}${originalUrl}`;
  }
  
  // For external images (vendor images), use proxy
  const encoded = encodeURIComponent(originalUrl);
  return `/api/images/${encoded}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

