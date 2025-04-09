'use client';

import { motion } from 'framer-motion';
import { aboutTranslations } from '@/config/i18n/about';
import { HeroCarousel } from '@/components/features/home/HeroCarousel';
import { PressSection } from '@/components/features/about/PressSection';
import { pressTranslations, pressItems } from '@/config/i18n/press';
import { type Locale } from '@/config/constants/locales';

const aboutHeroImages = [
  '/images/about/about-1.jpg',
  '/images/about/about-2.jpg',
  '/images/about/about-3.jpg',
  '/images/about/about-4.jpg'
];
export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = await params;
  const t = aboutTranslations[locale as keyof typeof aboutTranslations];

  return (
    <div className="min-h-screen">
      <HeroCarousel
        images={aboutHeroImages}
        title={t.title}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">{t.location.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{t.location.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{t.location.conditions.title}</h3>
                <ul className="space-y-3">
                  {t.location.conditions.items.map((condition, index) => (
                    <li key={index} className="text-gray-600">{condition}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="text-gray-600 italic">
                  "{t.location.quote.text}"
                  <footer className="mt-4 font-semibold">— {t.location.quote.author}</footer>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">{t.whiteSuffolk.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{t.whiteSuffolk.description}</p>
            <p className="text-lg text-gray-600 mb-8">{t.whiteSuffolk.journey}</p>
            <p className="text-lg text-gray-600">{t.whiteSuffolk.achievement}</p>
          </motion.div>
        </div>
      </section>
      <PressSection 
        translations={pressTranslations[locale]} 
        items={pressItems[locale]} 
      />
    </div>
  );
}