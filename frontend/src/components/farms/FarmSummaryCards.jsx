import { Warehouse, Grid3X3, MapPin, CheckCircle2 } from 'lucide-react';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmSummaryCards component
 * Displays high-level summary KPIs for farm holdings.
 */
export default function FarmSummaryCards({ summary }) {
  const {
    totalHoldings = 3,
    totalFields = 8,
    totalAreaAcres = 42.5,
    activeHoldings = 3,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-holdings',
      label: 'Total Holdings',
      value: `${totalHoldings} Holdings`,
      sub: 'Registered properties',
      icon: <Warehouse size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--green',
    },
    {
      id: 'kpi-fields',
      label: 'Total Fields',
      value: `${totalFields} Fields`,
      sub: 'Mapped operational plots',
      icon: <Grid3X3 size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--blue',
    },
    {
      id: 'kpi-area',
      label: 'Total Area',
      value: formatAcres(totalAreaAcres),
      sub: 'Cumulative acreage',
      icon: <MapPin size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--amber',
    },
    {
      id: 'kpi-active',
      label: 'Active Holdings',
      value: `${activeHoldings} of ${totalHoldings}`,
      sub: '100% Operational status',
      icon: <CheckCircle2 size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--emerald',
    },
  ];

  return (
    <section className="agri-farm-summary-grid" aria-label="Farm Overview Metrics">
      {cards.map((card) => (
        <div key={card.id} className="agri-farm-summary-card">
          <div className={`agri-farm-summary-icon ${card.colorClass}`}>
            {card.icon}
          </div>
          <div className="agri-farm-summary-info">
            <span className="agri-farm-summary-label">{card.label}</span>
            <span className="agri-farm-summary-value">{card.value}</span>
            <span className="agri-farm-summary-sub">{card.sub}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
