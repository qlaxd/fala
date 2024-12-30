'use client';

import { MapPin, Clock, Phone, Mail, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { contactTranslations } from '@/config/i18n/contact';
import type { Locale } from '@/config/constants/locales';
import Image from 'next/image';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const t = contactTranslations[params.locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Image
          src="/images/hero/hero-6.jpg"
          alt="Contact background"
          width={1920}
          height={400}
          className="w-full h-[400px] object-cover"
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h1 className="text-4xl font-bold text-center mb-8">{t.title}</h1>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full bg-white/10 hover:bg-white/30"
                >
                  <a
                    href="https://www.facebook.com/fala.farm/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full bg-white/10 hover:bg-white/30"
                >
                  <a
                    href="https://www.linkedin.com/in/levente-lajk%C3%B3-818805139/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{t.contact.title}</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{t.contact.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <a 
                          href={`tel:${t.contact.phone}`}
                          className="text-primary hover:text-primary/80 transition-colors shadow-[0_1px_0_0] shadow-primary/40 hover:shadow-primary/20"
                        >
                          {t.contact.phone}
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto p-2">
                        <p className="text-sm">Kattintson a hívás kezdeményezéséhez</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <a 
                          href={`mailto:${t.contact.email}`}
                          className="text-primary hover:text-primary/80 transition-colors shadow-[0_1px_0_0] shadow-primary/40 hover:shadow-primary/20"
                        >
                          {t.contact.email}
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto p-2">
                        <p className="text-sm">Kattintson az email küldéshez</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">{t.businessHours.title}</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{t.businessHours.weekdays}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{t.businessHours.saturday}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{t.businessHours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11013.680521393786!2d19.7699092!3d46.3610519!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47438295920c9705%3A0x220d4c6fbffd8f1f!2zw5xsbMOpcywgUGV0xZFmaSBkxbFsxZEgMTE3LCA2Nzk0!5e0!3m2!1shu!2shu!4v1735429203226!5m2!1shu!2shu"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ContactForm translations={t.form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}