import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Locale } from '@/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();

  const quickLinks = [
    { href: '/home', label: t('common.home') },
    { href: '/services', label: t('common.services') },
    { href: '/about', label: t('common.about') },
    { href: '/contact', label: t('common.contact') },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-vp-blue to-vp-blue-light rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold">Design Concept</span>
              </div>
            </div>
            <p className="footer-text">
              Professional printing and design solutions for businesses and individuals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link href={`/${locale}/services?category=personal`}>Personal Designs</Link></li>
              <li><Link href={`/${locale}/services?category=acrylic`}>Acrylic Name Plates</Link></li>
              <li><Link href={`/${locale}/services?category=led`}>LED Signages</Link></li>
              <li><Link href={`/${locale}/services?category=stickers`}>Stickers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">{t('footer.contact')}</h4>
            <ul className="footer-links space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-vp-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-vp-orange flex-shrink-0" />
                <span className="text-sm">+91 77098 31071</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-vp-orange flex-shrink-0" />
                <span className="text-sm">info@designconcept.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Design Concept. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
