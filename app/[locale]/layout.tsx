import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { isValidLocale } from '@/lib/utils/locale';
import '../globals.css';
import { Footer } from '@/components/layout/Footer';

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
  params: { locale: string };
}) {
  if (params.locale === 'favicon.ico') {
    return null;
  }

  if (!isValidLocale(params.locale)) {
    throw new Error(`Invalid locale: ${params.locale}`);
  }
  const locale = params.locale as keyof typeof translations;
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