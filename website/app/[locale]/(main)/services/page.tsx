'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { Locale } from '@/i18n';

interface Product {
  _id: string;
  name: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  featured: boolean;
  active: boolean;
}

interface ServicesPageProps {
  params: Promise<{ locale: Locale }>;
}

const categoryIcons: Record<string, string> = {
  personal: '🎨',
  acrylic: '🏷️',
  led: '💡',
  standees: '📊',
  stickers: '🏷️',
  hoardings: '📢',
  banners: '🚩',
};

function ServicesContent({ params }: ServicesPageProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);

  const categories = [
    { id: 'all', label: t('services.categories.all') },
    { id: 'personal', label: t('services.categories.personal') },
    { id: 'acrylic', label: t('services.categories.acrylic') },
    { id: 'led', label: t('services.categories.led') },
    { id: 'standees', label: t('services.categories.standees') },
    { id: 'stickers', label: t('services.categories.stickers') },
    { id: 'hoardings', label: t('services.categories.hoardings') },
    { id: 'banners', label: t('services.categories.banners') },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const getName = (nameObj: { en: string; hi: string; mr: string }) => {
    return nameObj[currentLocale] || nameObj.en;
  };

  const getDescription = (descObj: { en: string; hi: string; mr: string }) => {
    return descObj[currentLocale] || descObj.en;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('services.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-200 sticky top-16 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryIcons[category.id]} {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Check back later for new products in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/${currentLocale}/products/${product._id}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={getName(product.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {categoryIcons[product.category] || '📦'}
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {getName(product.name)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {getDescription(product.description)}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      {t('product.viewDetails')}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ServicesPage({ params }: ServicesPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ServicesContent params={params} />
    </Suspense>
  );
}
