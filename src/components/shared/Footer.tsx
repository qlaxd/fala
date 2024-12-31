import { Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { contactTranslations } from '@/config/i18n/contact';
import type { Locale } from '@/config/constants/locales';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = contactTranslations[locale];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t.contact.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>{t.contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <span>{t.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span>{t.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t.businessHours.title}</h3>
            <div className="space-y-2">
              <p>{t.businessHours.weekdays}</p>
              <p>{t.businessHours.saturday}</p>
              <p>{t.businessHours.sunday}</p>
              <p className="text-sm mt-4">{t.businessHours.note}</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label={t.contact.social.facebook}
                title={t.contact.social.facebook}
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label={t.contact.social.linkedin}
                title={t.contact.social.linkedin}
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Fala Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}