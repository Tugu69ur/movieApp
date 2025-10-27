import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'mn';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'mn',
  changeLanguage: async () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>('mn');

  useEffect(() => {
    // Language persists in session only now
    const savedLanguage = 'mn'; // default to Mongolian
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const changeLanguage = async (lang: Language) => {
    try {
      setLanguage(lang);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key: string) => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
