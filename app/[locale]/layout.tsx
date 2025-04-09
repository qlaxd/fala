import { Inter } from 'next/font/google';
import { Navigation } from '@/components/shared/Navigation';
import { isValidLocale } from '@/utils/locale';
import '../globals.css';
import { Footer } from '@/components/shared/Footer';
import { redirect } from 'next/navigation';
import { type Locale } from '@/config/constants/locales';
import { navigationTranslations } from '@/config/i18n/navigation';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: unknown };
}) {
  const { locale } = await params;
  
  if (locale === 'favicon.ico' || locale === 'api') return null;

  if (!isValidLocale(locale)) {
    console.error(`Invalid locale attempted: ${String(locale)}`);
    return redirect('/hu');
  }

  const localeValue = locale as Locale;
  const t = navigationTranslations[localeValue];

  return (
    <html lang={localeValue} suppressHydrationWarning>
      <body className={inter.className}>
        <header className="fixed w-full bg-white shadow-md z-50">
          <Navigation locale={localeValue} translations={t} />
        </header>
        <main className="pt-16">{children}</main>
        <Footer locale={localeValue} />
      </body>
    </html>
  );
}