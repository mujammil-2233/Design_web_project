'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Star, Zap, Palette, Headphones } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Locale } from '@/i18n';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default function HomePage({ params }: HomePageProps) {
  const t = useTranslations();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);

  const features = [
    {
      icon: Star,
      title: t('home.whyUs.quality'),
      description: t('home.whyUs.qualityDesc'),
    },
    {
      icon: Zap,
      title: t('home.whyUs.fastDelivery'),
      description: t('home.whyUs.fastDeliveryDesc'),
    },
    {
      icon: Palette,
      title: t('home.whyUs.customDesign'),
      description: t('home.whyUs.customDesignDesc'),
    },
    {
      icon: Headphones,
      title: t('home.whyUs.support'),
      description: t('home.whyUs.supportDesc'),
    },
  ];

  const services = [
    {
      title: 'Personal Designs',
      description: 'Custom designs for personal use',
      icon: '🎨',
      href: '/services?category=personal',
    },
    {
      title: 'Acrylic Name Plates',
      description: 'Premium acrylic name plates',
      icon: '🏷️',
      href: '/services?category=acrylic',
    },
    {
      title: 'LED Signages',
      description: 'Eye-catching LED displays',
      icon: '💡',
      href: '/services?category=led',
    },
    {
      title: 'Standees',
      description: 'Portable display standees',
      icon: '📊',
      href: '/services?category=standees',
    },
    {
      title: 'All Types of Stickers',
      description: 'Custom stickers of all kinds',
      icon: '🏷️',
      href: '/services?category=stickers',
    },
    {
      title: 'Large Hoardings',
      description: 'Big format outdoor hoardings',
      icon: '📢',
      href: '/services?category=hoardings',
    },
    {
      title: 'Banners (Branchers)',
      description: 'Promotional banners and branchers',
      icon: '🚩',
      href: '/services?category=banners',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href={`/${currentLocale}/services`}
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              {t('home.hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.featured.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/${currentLocale}${service.href}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-blue-600 font-medium">
                  {t('product.viewDetails')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today for a custom quote on your printing and design needs.
          </p>
          <Link
            href={`/${currentLocale}/enquiry`}
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('common.enquiry')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
