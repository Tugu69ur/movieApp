import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import en from './locales/en.json';
import mn from './locales/mn.json';

// Simple language detector - no persistence needed
const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: false,
  detect: () => 'mn', // Default to Mongolian
  init: () => {},
  cacheUserLanguage: () => {}, // No-op
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      mn: {
        translation: mn,
      },
    },
    fallbackLng: 'mn',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
