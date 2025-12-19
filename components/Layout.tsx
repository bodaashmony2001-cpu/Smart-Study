
import React from 'react';
import { useLanguage } from './LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0720] flex flex-col">
      <nav className="bg-[#0f0720]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between h-20 items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-violet-900/40">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">{t('appName')}</span>
            </div>

            <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="text-xs font-black text-violet-100/70 hover:text-white transition-all px-4 py-2 rounded-full glass border-white/5"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              {user && (
                <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="hidden md:block text-xs font-bold text-violet-400 uppercase tracking-widest">{user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="text-xs font-black text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-widest"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
