import { Inter } from 'next/font/google';
import { Navigation } from '@/components/shared/Navigation';
import { isValidLocale } from '@/utils/locale';
import '../globals.css';
import { Footer } from '@/components/shared/Footer';
import { redirect } from 'next/navigation';
import { type Locale } from '@/config/constants/locales';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    contact: 'Contact',
    partners: 'Partners',
    forSale: 'For Sale',
    breedingStock: 'Breeding Stock',
    commercialStock: 'Commercial Stock'
  },
  hu: {
    home: 'Főoldal',
    about: 'Rólunk',
    contact: 'Kapcsolat',
    partners: 'Partnerek',
    forSale: 'Eladó',
    breedingStock: 'Tenyészállatok',
    commercialStock: 'Vágóállatok'
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: unknown };
}) {
  if (params.locale === 'favicon.ico') return null;

  if (!isValidLocale(params.locale)) {
    console.error(`Invalid locale attempted: ${String(params.locale)}`);
    return redirect('/hu');
  }

  const locale = params.locale as Locale;
  const t = translations[locale];

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <header className="fixed w-full bg-white shadow-md z-50">
          <Navigation locale={locale} translations={t} />
        </header>
        <main className="pt-16">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}