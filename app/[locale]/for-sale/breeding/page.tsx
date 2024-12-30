'use client';

import { useState } from 'react';
import { BreedingCard } from '@/components/features/for-sale/BreedingCard';
import { forSaleTranslations } from '@/config/i18n/for-sale';
import type { Locale } from '@/config/constants/locales';

// Mock data - replace with actual data from your backend
const mockSheep = [
  {
    earTag: 'WS2024001',
    images: [
      '/images/hero/hero-1.jpg',
      '/images/hero/hero-2.jpg',
      '/images/hero/hero-3.jpg',
    ],
    growthRate: 450,
    yearlyWeight: 120,
    birthType: 'twin',
  },
  // Add more mock data as needed
];

export default function BreedingPage({ params }: { params: { locale: Locale } }) {
  const t = forSaleTranslations[params.locale];
  const [selectedType, setSelectedType] = useState('all');

  const handleRegister = () => {
    // Add registration logic
    console.log('Register for auction');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{t.breeding.title}</h1>
        <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          {t.breeding.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockSheep.map((sheep) => (
            <BreedingCard
              key={sheep.earTag}
              {...sheep}
              onRegister={handleRegister}
              translations={{
                ...t.breeding,
                metrics: t.breeding.metrics,
                birthTypes: t.breeding.birthTypes
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}