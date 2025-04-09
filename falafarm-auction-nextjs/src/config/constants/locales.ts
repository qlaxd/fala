export const LOCALES = ['en', 'hu'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'hu';