import { getRequestConfig } from 'next-intl/server';
import en from './messages/en.json';
import hi from './messages/hi.json';
import mr from './messages/mr.json';

export const locales = ['en', 'hi', 'mr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};

const messages = { en, hi, mr };

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid
  const validLocale = (locale && locales.includes(locale as Locale)) 
    ? (locale as Locale) 
    : 'en';
    
  return {
    locale: validLocale,
    messages: messages[validLocale],
  };
});
