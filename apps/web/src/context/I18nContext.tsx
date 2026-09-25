import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageLocale, TRANSLATIONS, I18nDictionary } from '@floodroute/shared';

interface I18nContextType {
  locale: LanguageLocale;
  setLocale: (locale: LanguageLocale) => void;
  t: I18nDictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LanguageLocale>(() => {
    const saved = localStorage.getItem('floodroute_locale');
    if (saved && ['en', 'ta', 'te', 'hi', 'kn'].includes(saved)) {
      return saved as LanguageLocale;
    }
    return 'en';
  });

  const setLocale = (newLocale: LanguageLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('floodroute_locale', newLocale);
  };

  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
