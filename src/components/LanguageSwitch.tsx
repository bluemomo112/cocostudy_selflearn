'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    console.log('[LanguageSwitch] Current language:', language);
    const newLang = language === 'zh-CN' ? 'zh-TW' : 'zh-CN';
    console.log('[LanguageSwitch] Switching to:', newLang);
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer relative z-10"
      title={t('切换语言')}
      type="button"
    >
      <Globe size={15} className="text-gray-600" />
      <span className="text-sm text-gray-700">
        {language === 'zh-CN' ? '简体' : '繁體'}
      </span>
    </button>
  );
}
