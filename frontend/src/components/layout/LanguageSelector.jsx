import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n';

/**
 * LanguageSelector component for AgriTrack
 * Provides seamless 12-language switcher with persistence and accessibility
 */
export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize current language code (e.g., 'hi-IN' -> 'hi')
  const currentLangCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0].toLowerCase();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div
      className="agri-nav-dropdown-wrapper agri-language-selector-wrapper"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="agri-language-selector-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('topbar.selectLanguage', 'Select Language')}
        title={`${t('topbar.language', 'Language')}: ${currentLang.name} (${currentLang.nativeName})`}
      >
        <Globe size={17} className="agri-language-globe-icon" aria-hidden="true" />
        <span className="agri-language-label">{currentLang.nativeName}</span>
        <ChevronDown
          size={14}
          className={`agri-user-chevron ${isOpen ? 'agri-chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="agri-dropdown-menu agri-language-dropdown"
          role="listbox"
          aria-label={t('topbar.selectLanguage', 'Select Language')}
        >
          <div className="agri-dropdown-header agri-language-dropdown-header">
            <div className="agri-dropdown-title-group">
              <Globe size={16} className="text-primary" aria-hidden="true" />
              <span className="agri-dropdown-title">{t('topbar.selectLanguage', 'Select Language')}</span>
            </div>
            <span className="agri-badge agri-badge--info">12</span>
          </div>

          <div className="agri-language-dropdown-list" tabIndex={-1}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`agri-language-option-btn ${isSelected ? 'agri-language-option-btn--active' : ''}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                >
                  <div className="agri-language-option-info">
                    <span className="agri-language-native-name">{lang.nativeName}</span>
                    <span className="agri-language-en-name">{lang.name}</span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="agri-language-check-icon" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
