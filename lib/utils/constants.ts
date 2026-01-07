export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ro', name: 'Română' },
  { code: 'pl', name: 'Polski' },
] as const;

export const DEFAULT_LANGUAGE = 'en';

export const PRODUCTS_PER_PAGE = 20;

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
] as const;

