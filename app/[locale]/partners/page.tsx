'use client';

import { partnersTranslations } from '@/lib/translations/partners';
import { PartnerCard } from '@/components/partners/PartnerCard';
import type { Locale } from '@/lib/constants/locales';

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