'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { forSaleTranslations } from '@/config/i18n/for-sale';
import type { Locale } from '@/config/constants/locales';

const mockLambs = [
  {
    id: 1,
    image: '/images/about/about-4.jpg',
    lambingDate: '2024-02-15',
    weight: '35-40',
    price: '1200',
  },
];

export default function CommercialPage({ params }: { params: { locale: Locale } }) {
  const [translations, setTranslations] = useState(forSaleTranslations[params.locale]);

  useEffect(() => {
    setTranslations(forSaleTranslations[params.locale]);
  }, [params.locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{translations.commercial.title}</h1>
        <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          {translations.commercial.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockLambs.map((lamb) => (
            <Card key={lamb.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={lamb.image}
                  alt="Commercial lamb"
                  fill
                  className="object-cover object-center"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  loading="eager"
                />
              </div>
              <CardHeader>
                <h3 className="text-xl font-bold">{translations.commercial.info.lot}{lamb.id}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">{translations.commercial.info.lambingDate}:</span>{' '}
                    {lamb.lambingDate}
                  </p>
                  <p>
                    <span className="font-semibold">{translations.commercial.info.weight}:</span>{' '}
                    {lamb.weight} kg
                  </p>
                  <p>
                    <span className="font-semibold">{translations.commercial.info.price}:</span>{' '}
                    {lamb.price} HUF
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}