import { LOCALES, type Locale } from '@/config/constants/locales';

// Konstans idejű ellenőrzéshez Set használata
const VALID_LOCALES = new Set(LOCALES);

// Biztonságos típus őrző
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Sanitizáló függvény
function sanitizeLocale(input: unknown): string {
  if (!isString(input)) return '';
  // Csak betűket engedünk meg, maximum 2 karakter hosszúságban
  return input.toLowerCase().replace(/[^a-z]/g, '').slice(0, 2);
}

// Kombinált validáció
export function isValidLocale(locale: unknown): locale is Locale {
  if (!isString(locale)) return false;
  
  const sanitized = sanitizeLocale(locale);
  // Konstans idejű ellenőrzés Set-tel
  return VALID_LOCALES.has(sanitized as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'hu' : 'en';
}