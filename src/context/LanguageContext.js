import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const SUPPORTED = ['it', 'en', 'es', 'fr', 'de', 'ru', 'zh', 'ja', 'hi', 'ar'];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('rubino_lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = navigator.language?.slice(0, 2) || 'it';
    return SUPPORTED.includes(browser) ? browser : 'it';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('rubino_lang', lang);
  }, [lang]);

  const t = (key, fallback) =>
    translations[lang]?.[key] ?? translations['en']?.[key] ?? fallback ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, SUPPORTED }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
