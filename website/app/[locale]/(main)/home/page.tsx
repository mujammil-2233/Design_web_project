'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Star, Truck, Palette, Headphones, Search } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'personal', label: 'Personal Designs' },
    { id: 'acrylic', label: 'Acrylic Name Plates' },
    { id: 'led', label: 'LED Signages' },
    { id: 'standees', label: 'Standees' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'hoardings', label: 'Hoardings' },
    { id: 'banners', label: 'Banners' },
  ];

  const services = [
    { id: 1, category: 'personal', title: 'Personal Designs', description: 'Custom designs for personal occasions', href: '/en/services?category=personal' },
    { id: 2, category: 'acrylic', title: 'Acrylic Name Plates', description: 'Premium quality name plates', href: '/en/services?category=acrylic' },
    { id: 3, category: 'led', title: 'LED Signages', description: 'Eye-catching LED displays', href: '/en/services?category=led' },
    { id: 4, category: 'standees', title: 'Standees', description: 'Portable display solutions', href: '/en/services?category=standees' },
    { id: 5, category: 'stickers', title: 'Stickers', description: 'Custom stickers of all types', href: '/en/services?category=stickers' },
    { id: 6, category: 'hoardings', title: 'Hoardings', description: 'Large format outdoor advertising', href: '/en/services?category=hoardings' },
    { id: 7, category: 'banners', title: 'Banners', description: 'Promotional banners and branchers', href: '/en/services?category=banners' },
  ];

  // Filter services based on category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            {t('home.hero.title')}
          </h1>
          <p className="hero-subtitle">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero-buttons">
            <Link href="/en/services" className="btn btn-primary">
              {t('home.hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/en/enquiry" className="btn btn-secondary">
              {t('common.enquiry')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('home.featured.title')}</h2>
          <p className="section-subtitle">{t('home.featured.description')}</p>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vp-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-12 w-full"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar mb-8" style={{ position: 'relative', top: 'auto', boxShadow: 'none', background: 'transparent' }}>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-3">
              {filteredServices.map((service) => (
                <Link key={service.id} href={service.href} className="card">
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-description">{service.description}</p>
                  <span className="card-link">{t('product.viewDetails')} <ArrowRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-vp-gray-500 text-lg">No services found matching your criteria</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 text-vp-blue font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">{t('home.whyUs.title')}</h2>
          <p className="section-subtitle">We provide the best service for your business</p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.quality')}</h3>
              <p className="feature-description">{t('home.whyUs.qualityDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.fastDelivery')}</h3>
              <p className="feature-description">{t('home.whyUs.fastDeliveryDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.customDesign')}</h3>
              <p className="feature-description">{t('home.whyUs.customDesignDesc')}</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="feature-title">{t('home.whyUs.support')}</h3>
              <p className="feature-description">{t('home.whyUs.supportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero">
        <div className="container hero-content">
          <h2 className="hero-title">Ready to Get Started?</h2>
          <p className="hero-subtitle">
            Contact us today for a custom quote on your printing and design needs.
          </p>
          <Link href="/en/enquiry" className="btn btn-secondary">
            {t('common.enquiry')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
