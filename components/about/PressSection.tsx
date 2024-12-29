'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PressItem {
  date: string;
  title: string;
  excerpt: string;
  source: string;
  url: string;
}

interface PressSectionProps {
  translations: {
    title: string;
    readMore: string;
  };
  items: PressItem[];
}

export function PressSection({ translations: t, items }: PressSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t.title}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {items.map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString('hu-HU')}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {item.source}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="mt-2"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    {t.readMore}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
