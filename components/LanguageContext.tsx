
import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "Smart Study",
    logout: "Logout",
    tagline: "One Page. One Concept. One Mastery.",
    chat: "Academic Tutor",
    chatPlaceholder: "Ask your clever tutor anything...",
    quiz: "Complete Quiz",
    retake: "Retake Quiz",
    visualForge: "Visual Forge",
    explainBtn: "✨ AI Explain",
    forgeBtn: "Generate Neural Visuals",
    voiceActive: "Neural Link Listening...",
  },
  ar: {
    appName: "سمارت ستادي",
    logout: "تسجيل الخروج",
    tagline: "صفحة واحدة.. فكرة واحدة.. إتقان واحد.",
    chat: "المعلم الأكاديمي",
    chatPlaceholder: "اسأل معلمك الذكي أي شيء...",
    quiz: "إكمال الاختبار",
    retake: "إعادة الاختبار",
    visualForge: "المصهر المرئي",
    explainBtn: "✨ شرح ذكي",
    forgeBtn: "توليد ملخص مرئي",
    voiceActive: "الرابط العصبي يستمع...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: string) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
