import { LOCALES, type Locale } from '@/lib/constants/locales';

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'hu' : 'en';
}