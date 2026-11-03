import { useTranslation } from 'react-i18next';
import { FlaskConical, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * SoilSummaryCards component
 * Displays high-level summary KPIs for soil test records and agronomic health.
 */
export default function SoilSummaryCards({ summary }) {
  const { t } = useTranslation();
  const {
    fieldsTested = 8,
    goodSoil = 5,
    needsAttention = 1,
    averagePh = 6.9,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-tested',
      label: t('fields.title', 'Fields Tested'),
      value: `${fieldsTested}`,
      sub: t('soil.title', 'Laboratory coverage'),
      icon: <FlaskConical size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--green',
    },
    {
      id: 'kpi-good',
      label: t('status.good', 'Good Soil Profile'),
      value: `${goodSoil}`,
      sub: t('status.optimal', 'Optimal NPK & pH balance'),
      icon: <CheckCircle2 size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--blue',
    },
    {
      id: 'kpi-attention',
      label: t('status.needsAttention', 'Needs Attention'),
      value: `${needsAttention}`,
      sub: t('status.warning', 'Corrective action recommended'),
      icon: <AlertTriangle size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--red',
    },
    {
      id: 'kpi-ph',
      label: t('soil.ph', 'Average Soil pH'),
      value: `${averagePh} pH`,
      sub: t('soil.optimalRange', 'Neutral & fertile range'),
      icon: <Sparkles size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--amber',
    },
  ];

  return (
    <section className="agri-soil-summary-grid" aria-label={t('soil.title', 'Soil Health Metrics')}>
      {cards.map((card) => (
        <div key={card.id} className="agri-soil-summary-card">
          <div className={`agri-soil-summary-icon ${card.colorClass}`}>
            {card.icon}
          </div>
          <div className="agri-soil-summary-info">
            <span className="agri-soil-summary-label">{card.label}</span>
            <span className="agri-soil-summary-value">{card.value}</span>
            <span className="agri-soil-summary-sub">{card.sub}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
