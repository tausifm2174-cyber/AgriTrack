import { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Sprout,
  Wheat,
  ShoppingCart,
  IndianRupee,
  CheckCircle,
} from 'lucide-react';
import Card from '../common/Card';

const INITIAL_PREFERENCES = [
  {
    id: 'weather',
    label: 'Weather Alerts',
    description: 'Forecast warnings for heavy rain, high winds, and heat stress.',
    icon: CloudRain,
    enabled: true,
  },
  {
    id: 'irrigation',
    label: 'Irrigation Reminders',
    description: 'Automated schedules and threshold triggers for drip lines.',
    icon: Droplets,
    enabled: true,
  },
  {
    id: 'advisory',
    label: 'Crop Advisories',
    description: 'Agronomy guidance, pest warnings, and disease risk alerts.',
    icon: Sprout,
    enabled: true,
  },
  {
    id: 'harvest',
    label: 'Harvest Reminders',
    description: 'Readiness inspections, moisture thresholds, and storage notifications.',
    icon: Wheat,
    enabled: true,
  },
  {
    id: 'sales',
    label: 'Sales Notifications',
    description: 'APMC mandi market price movements and transaction execution.',
    icon: ShoppingCart,
    enabled: false,
  },
  {
    id: 'payment',
    label: 'Payment Notifications',
    description: 'Pending receivables, invoice milestones, and payment receipts.',
    icon: IndianRupee,
    enabled: true,
  },
];

/**
 * NotificationPreferences Component
 * Allows user to toggle notification alert categories locally in session.
 */
export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleToggle = (id) => {
    setPreferences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2500);
  };

  return (
    <Card
      title="Notification Preferences"
      subtitle="Configure real-time event triggers and operational reminders"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
            Changes apply to current session (Demo)
          </span>
          {saveStatus && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--success-text)',
                fontWeight: 600,
              }}
            >
              <CheckCircle size={13} />
              <span>Preferences updated</span>
            </span>
          )}
        </div>
      }
    >
      <div className="agri-pref-list">
        {preferences.map((pref) => {
          const IconComponent = pref.icon;
          return (
            <div key={pref.id} className="agri-pref-item">
              <div className="agri-pref-content">
                <div className="agri-pref-title">
                  <IconComponent size={16} className="text-primary" aria-hidden="true" />
                  <span>{pref.label}</span>
                </div>
                <p className="agri-pref-desc">{pref.description}</p>
              </div>

              <label className="agri-toggle-switch">
                <input
                  type="checkbox"
                  checked={pref.enabled}
                  onChange={() => handleToggle(pref.id)}
                  aria-label={`Toggle ${pref.label}`}
                />
                <span className="agri-toggle-slider" />
              </label>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
