'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { homeTranslations } from '@/lib/translations/home';
import { HeroCarousel } from '@/components/hero/HeroCarousel';

const heroImages = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
  '/images/hero/hero-4.jpg',
  '/images/hero/hero-5.jpg',
  '/images/hero/hero-6.jpg',
  '/images/hero/hero-7.jpg'
];

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = homeTranslations[params.locale as keyof typeof homeTranslations];

  return (
    <div className="min-h-screen">
      <HeroCarousel
        images={heroImages}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        description={t.hero.description}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">{t.intro.title}</h2>
            <p className="text-lg text-gray-600 mb-12">{t.intro.content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.intro.stats.map((stat, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">{t.features.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.features.items.map((feature, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}