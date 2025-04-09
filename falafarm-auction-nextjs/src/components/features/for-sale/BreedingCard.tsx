'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BreedingCardProps {
  earTag: string;
  images: string[];
  growthRate: number;
  yearlyWeight: number;
  birthType: string;
  onRegister: () => void;
  translations: {
    earTag: string;
    registerButton: string;
    metrics: {
      growthRate: string;
      yearlyWeight: string;
      birthType: string;
      unit: {
        gPerDay: string;
        kg: string;
      }
    };
    birthTypes: {
      single: string;
      twin: string;
      triplet: string;
    };
  };
}

export function BreedingCard({
  earTag,
  images,
  growthRate,
  yearlyWeight,
  birthType,
  onRegister,
  translations: t,
}: BreedingCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="h-full shadow hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold">{t.earTag}: {earTag}</h3>
      </CardHeader>
      <div className="relative h-64">
        <Image
          src={images[currentImage]}
          alt={`Sheep ${earTag}`}
          fill
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2 mb-4">
          <p>{t.metrics.growthRate}: {growthRate}{t.metrics.unit.gPerDay}</p>
          <p>{t.metrics.yearlyWeight}: {yearlyWeight}{t.metrics.unit.kg}</p>
          <p>{t.metrics.birthType}: {t.birthTypes[birthType as keyof typeof t.birthTypes]}</p>
        </div>
        <Button onClick={onRegister} className="w-full">
          {t.registerButton}
        </Button>
      </CardContent>
    </Card>
  );
}