'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { forSaleTranslations } from '@/config/i18n/for-sale';
import type { Locale } from '@/config/constants/locales';

export default function ForSalePage({ params }: { params: { locale: Locale } }) {
  const [translations, setTranslations] = useState(forSaleTranslations[params.locale]);

  useEffect(() => {
    setTranslations(forSaleTranslations[params.locale]);
  }, [params.locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href={`/${params.locale}/for-sale/breeding`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <h2 className="text-2xl font-bold">{translations.breeding.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{translations.breeding.description}</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${params.locale}/for-sale/commercial`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <h2 className="text-2xl font-bold">{translations.commercial.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{translations.commercial.description}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}