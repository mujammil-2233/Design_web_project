'use client';

import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="bg-white min-h-screen">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{t('about.title')}</h1>
          <p className="hero-subtitle">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">{t('about.intro')}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold mb-3">{t('about.mission')}</h2>
                <p className="text-gray-600">{t('about.missionDesc')}</p>
              </div>
              <div className="card">
                <h2 className="text-xl font-bold mb-3">{t('about.vision')}</h2>
                <p className="text-gray-600">{t('about.visionDesc')}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">{t('about.values.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="font-bold mb-2">{t('about.values.quality')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.qualityDesc')}</p>
              </div>
              <div className="card">
                <h3 className="font-bold mb-2">{t('about.values.innovation')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.innovationDesc')}</p>
              </div>
              <div className="card">
                <h3 className="font-bold mb-2">{t('about.values.customerFirst')}</h3>
                <p className="text-gray-600 text-sm">{t('about.values.customerFirstDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
