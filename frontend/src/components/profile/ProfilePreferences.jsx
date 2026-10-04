import Card from '../common/Card';

/**
 * ProfilePreferences Component
 * Regional and unit settings for the agricultural management system.
 */
export default function ProfilePreferences() {
  const settings = [
    {
      label: 'Land Measurement Unit',
      value: 'Acres (ac)',
      description: 'Used across all holdings, field plots, and yield metrics',
    },
    {
      label: 'Produce Weight Standard',
      value: 'Quintals (q) & Kilograms (kg)',
      description: 'Standard 100 kg/quintal agricultural trading conversion',
    },
    {
      label: 'Financial Currency',
      value: 'Indian Rupee (INR ₹)',
      description: 'Formatted in Indian Numbering System (Lakhs & Thousands)',
    },
    {
      label: 'Primary APMC Benchmark',
      value: 'APMC Nashik & Karnal Mandi',
      description: 'Reference mandi rates for Wheat, Maize, Soybean & Pulses',
    },
    {
      label: 'Timezone & Weather Grid',
      value: 'IST (UTC+05:30) — Karnal, HR',
      description: 'Coordinates: 29.6857° N, 76.9905° E',
    },
    {
      label: 'Operating Mode',
      value: 'Frontend Interactive Demo',
      description: 'Simulated multi-farm dataset (Phases 1–9 active)',
    },
  ];

  return (
    <Card
      title="Regional & System Standards"
      subtitle="Default agricultural measurement units and market terminals"
    >
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
