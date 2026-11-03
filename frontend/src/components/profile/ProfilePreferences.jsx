import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import LanguageSelector from '../layout/LanguageSelector';

/**
 * ProfilePreferences Component
 * Regional and unit settings for the agricultural management system.
 */
export default function ProfilePreferences() {
  const { t } = useTranslation();

  const settings = [
    {
      label: t('profile.landUnit', 'Land Measurement Unit'),
      value: t('units.acres', 'Acres (ac)'),
      description: t('profile.landUnitDesc', 'Used across all holdings, field plots, and yield metrics'),
    },
    {
      label: t('profile.produceUnit', 'Produce Weight Standard'),
      value: `${t('units.quintal', 'Quintals (q)')} & ${t('units.kg', 'Kilograms (kg)')}`,
      description: t('profile.produceUnitDesc', 'Standard 100 kg/quintal agricultural trading conversion'),
    },
    {
      label: t('profile.currency', 'Financial Currency'),
      value: t('profile.currencyVal', 'Indian Rupee (INR ₹)'),
      description: t('profile.currencyDesc', 'Formatted in Indian Numbering System (Lakhs & Thousands)'),
    },
    {
      label: t('profile.apmcBenchmark', 'Primary APMC Benchmark'),
      value: 'APMC Nashik & Karnal Mandi',
      description: t('profile.apmcDesc', 'Reference mandi rates for Wheat, Maize, Soybean & Pulses'),
    },
    {
      label: t('profile.timezone', 'Timezone & Weather Grid'),
      value: 'IST (UTC+05:30) — Karnal, HR',
      description: 'Coordinates: 29.6857° N, 76.9905° E',
    },
    {
      label: t('profile.operatingMode', 'Operating Mode'),
      value: t('profile.operatingModeVal', 'Frontend Interactive Demo'),
      description: t('profile.operatingModeDesc', 'Simulated multi-farm dataset (Phases 1–12 active)'),
    },
  ];

  return (
    <Card
      title={t('profile.preferences', 'Regional & System Standards')}
      subtitle={t('profile.regionalSubtitle', 'Default agricultural measurement units and market terminals')}
    >
      {/* Interface Language Preference */}
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block' }}>
            {t('profile.preferredLanguage', 'Preferred Interface Language')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {t('profile.langChangeDesc', 'Select your regional language across all pages and reports')}
          </span>
        </div>
        <LanguageSelector />
      </div>

      <div className="agri-settings-grid">
        {settings.map((item, idx) => (
          <div key={idx} className="agri-settings-item">
            <span className="agri-settings-label">{item.label}</span>
            <p className="agri-settings-val">{item.value}</p>
            <p className="agri-settings-sub">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

