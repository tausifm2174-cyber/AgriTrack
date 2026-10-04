import { FlaskConical, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * SoilSummaryCards component
 * Displays high-level summary KPIs for soil test records and agronomic health.
 */
export default function SoilSummaryCards({ summary }) {
  const {
    fieldsTested = 8,
    goodSoil = 5,
    needsAttention = 1,
    averagePh = 6.9,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-tested',
      label: 'Fields Tested',
      value: `${fieldsTested} of 8`,
      sub: '100% Laboratory coverage',
      icon: <FlaskConical size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--green',
    },
    {
      id: 'kpi-good',
      label: 'Good Soil Profile',
      value: `${goodSoil} Plots`,
      sub: 'Optimal NPK & pH balance',
      icon: <CheckCircle2 size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--blue',
    },
    {
      id: 'kpi-attention',
      label: 'Needs Attention',
      value: `${needsAttention} Plot`,
      sub: 'Corrective action recommended',
      icon: <AlertTriangle size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--red',
    },
    {
      id: 'kpi-ph',
      label: 'Average Soil pH',
      value: `${averagePh} pH`,
      sub: 'Neutral & fertile range',
      icon: <Sparkles size={22} aria-hidden="true" />,
      colorClass: 'agri-soil-summary-icon--amber',
    },
  ];

  return (
    <section className="agri-soil-summary-grid" aria-label="Soil Health Metrics">
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
