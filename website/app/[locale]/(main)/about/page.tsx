'use client';

import { useTranslations } from 'next-intl';
import { Target, Eye, Award, Users, Zap, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Locale } from '@/i18n';

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AboutPage({ params }: AboutPageProps) {
  const t = useTranslations();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);

  const values = [
    {
      icon: Award,
      title: t('about.values.quality'),
      description: t('about.values.qualityDesc'),
      color: 'blue',
    },
    {
      icon: Zap,
      title: t('about.values.innovation'),
      description: t('about.values.innovationDesc'),
      color: 'purple',
    },
    {
      icon: Heart,
      title: t('about.values.customerFirst'),
      description: t('about.values.customerFirstDesc'),
      color: 'pink',
    },
  ];

  const stats = [
    { value: '5000+', label: 'Projects Completed' },
    { value: '2000+', label: 'Happy Clients' },
    { value: '10+', label: 'Years Experience' },
    { value: '50+', label: 'Team Members' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('about.intro')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.mission')}
              </h2>
              <p className="text-gray-600">{t('about.missionDesc')}</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.vision')}
              </h2>
              <p className="text-gray-600">{t('about.visionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 bg-${value.color}-100 rounded-xl flex items-center justify-center mb-4`}
                >
                  <value.icon className={`w-6 h-6 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our talented team of designers and printing experts work together
              to deliver exceptional results for every project.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Design Team', role: 'Creative Experts' },
              { name: 'Production', role: 'Printing Specialists' },
              { name: 'Quality', role: 'QC Team' },
              { name: 'Support', role: 'Customer Care' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
