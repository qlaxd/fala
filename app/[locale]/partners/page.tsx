'use client';

import dynamic from 'next/dynamic';
import type { Locale } from '@/config/constants/locales';
import { partnersTranslations } from '@/config/i18n/partners';
import type { PartnerCardProps } from '@/components/features/partners/PartnerCard';

// Dinamikus import a PartnerCard komponenshez
const PartnerCard = dynamic<PartnerCardProps>(() => 
  import('@/components/features/partners/PartnerCard').then(mod => mod.PartnerCard), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-lg" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
});

export default function PartnersPage({ params }: { params: { locale: Locale } }) {
  const t = partnersTranslations[params.locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{t.title}</h1>
        <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          {t.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.partners.map((partner) => (
            <PartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </div>
    </div>
  );
}