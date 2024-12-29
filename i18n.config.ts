export const defaultLocale = 'en';
export const locales = ['hu', 'en'] as const;
export type Locale = typeof locales[number]; 