'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Locale } from '@/i18n';

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const t = useTranslations();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      content: '123 Business Street, Commercial Area\nMumbai, Maharashtra 400001',
      color: 'blue',
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      content: '+91 98765 43210',
      color: 'green',
      href: 'tel:+919876543210',
    },
    {
      icon: Mail,
      title: t('contact.email'),
      content: 'info@designconcept.com',
      color: 'purple',
      href: 'mailto:info@designconcept.com',
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      content: t('contact.hoursValue'),
      color: 'orange',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 text-sm">
                  123 Business Street, Commercial Area
                  <br />
                  Mumbai, Maharashtra 400001
                  <br />
                  India
                </p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-blue-100 mb-8">
                Get in touch with us for a custom quote. We&apos;ll respond within 24 hours
                with a detailed proposal for your requirements.
              </p>
              <div className="space-y-4">
                <Link
                  href={`/${currentLocale}/enquiry`}
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  {t('contact.sendEnquiry')}
                  <Send className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center w-full border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is the typical turnaround time?',
                a: 'Turnaround time varies by project. Simple projects can be completed in 2-3 days, while complex projects may take 1-2 weeks.',
              },
              {
                q: 'Do you provide design services?',
                a: 'Yes! We have an in-house design team that can help you create custom designs for all your printing needs.',
              },
              {
                q: 'Can I get a sample before bulk printing?',
                a: 'Absolutely! We recommend getting a sample first to ensure quality and satisfaction before proceeding with bulk orders.',
              },
              {
                q: 'What file formats do you accept?',
                a: 'We accept PDF, AI, PSD, and high-resolution PNG/JPG files. For best results, please provide print-ready PDF files.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
