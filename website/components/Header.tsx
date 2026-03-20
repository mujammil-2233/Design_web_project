'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { locales, localeNames, Locale } from '@/i18n';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const currentLocale = pathname.split('/')[1] as Locale || 'en';

  const navItems = [
    { href: `/home`, label: t('common.home') },
    { href: `/services`, label: t('common.services') },
    { href: `/about`, label: t('common.about') },
    { href: `/contact`, label: t('common.contact') },
  ];

  const changeLanguage = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${currentLocale}/home`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Design Concept</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${currentLocale}${item.href}`}
                className={`text-sm font-medium transition-colors ${
                  pathname.includes(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Enquiry CTA */}
            <Link
              href={`/${currentLocale}/enquiry`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t('common.enquiry')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{localeNames[currentLocale]}</span>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        changeLanguage(locale);
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        locale === currentLocale ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium ${
                    pathname.includes(item.href)
                      ? 'text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`/${currentLocale}/enquiry`}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
              >
                {t('common.enquiry')}
              </Link>
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Select Language</p>
                <div className="flex space-x-2">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        changeLanguage(locale);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        locale === currentLocale
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
