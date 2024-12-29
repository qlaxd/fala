'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types/navigation';
import { type Locale } from '@/lib/constants/locales';
import { getAlternateLocale } from '@/lib/utils/locale';
import { GB, HU } from 'country-flag-icons/react/3x2'
import Image from 'next/image';

interface NavigationProps {
  locale: Locale;
  translations: {
    home: string;
    about: string;
    contact: string;
    partners: string;
    forSale: string;
    breedingStock: string;
    commercialStock: string;
  };
}

export function Navigation({ locale, translations: t }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const alternateLocale = getAlternateLocale(locale);

  const navigation: NavigationItem[] = [
    { name: t.home, href: `/${locale}` },
    { name: t.about, href: `/${locale}/about` },
    { name: t.contact, href: `/${locale}/contact` },
    { name: t.partners, href: `/${locale}/partners` },
    {
      name: t.forSale,
      href: `/${locale}/for-sale`,
      children: [
        { name: t.breedingStock, href: `/${locale}/for-sale/breeding` },
        { name: t.commercialStock, href: `/${locale}/for-sale/commercial` },
      ],
    },
  ];

  function getLocalizedPath(currentPath: string, targetLocale: string) {
    if (currentPath === `/${locale}`) {
      return `/${targetLocale}`;
    }
    
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '');
    
    if (!pathWithoutLocale || pathWithoutLocale === '/') {
      return `/${targetLocale}`;
    }
    
    return `/${targetLocale}${pathWithoutLocale}`;
  }

  return (
    <nav className="container mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Image
            src="/images/logo/falafarmlogo.png"
            alt="Fala Farm Logo"
            width={65}
            height={65}
            className="rounded-full"
          />
          <span className="text-xl font-semibold">Fala Farm</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className={`relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 hover:text-primary transition-colors ${
                  pathname === item.href ? 'text-primary after:w-full' : ''
                }`}
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block px-4 py-2 text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 hover:text-primary"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href={getLocalizedPath(pathname, alternateLocale)}
            className="px-3 py-1 border rounded hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            {locale === 'en' ? (
              <HU className="w-6 h-4" title="Magyar" />
            ) : (
              <GB className="w-6 h-4" title="English" />
            )}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className="block py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block py-2 text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href={getLocalizedPath(pathname, alternateLocale)}
            className="block py-2 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {locale === 'en' ? (
              <HU className="w-6 h-4" title="Magyar" />
            ) : (
              <GB className="w-6 h-4" title="English" />
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}