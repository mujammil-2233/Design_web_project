'use client';

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function ServicesPage() {
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
    { id: 1, category: 'personal', title: 'Personal Designs', description: 'Custom designs for personal occasions' },
    { id: 2, category: 'acrylic', title: 'Acrylic Name Plates', description: 'Premium quality name plates for homes and offices' },
    { id: 3, category: 'led', title: 'LED Signages', description: 'Eye-catching LED displays for businesses' },
    { id: 4, category: 'standees', title: 'Standees', description: 'Portable display solutions for events' },
    { id: 5, category: 'stickers', title: 'Custom Stickers', description: 'High-quality stickers for branding' },
    { id: 6, category: 'hoardings', title: 'Large Hoardings', description: 'Big format outdoor advertising' },
    { id: 7, category: 'banners', title: 'Banners', description: 'Promotional banners and branchers' },
  ];

  // Filter by both category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Our Services</h1>
          <p className="hero-subtitle">Professional printing solutions for every need</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="container">
          {/* Search Bar */}
          <div className="mb-4">
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

          {/* Category Filters */}
          <div className="filter-list">
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
      </div>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          {filteredServices.length > 0 ? (
            <div className="grid grid-3">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  href="/en/enquiry"
                  className="card"
                >
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-description">{service.description}</p>
                  <span className="card-link">
                    Request Quote <ArrowRight className="w-4 h-4" />
                  </span>
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
    </div>
  );
}
