import { Grid3X3, MapPin, Droplets, Sprout } from 'lucide-react';
import { formatAcres } from '../../utils/formatters';

/**
 * FieldSummaryCards component
 * Displays high-level summary KPIs for mapped fields.
 */
export default function FieldSummaryCards({ summary }) {
  const {
    totalFields = 8,
    totalAreaAcres = 42.5,
    irrigatedFields = 6,
    activeCropFields = 7,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-total-fields',
      label: 'Total Fields',
      value: `${totalFields} Plots`,
      sub: 'Mapped farm boundaries',
      icon: <Grid3X3 size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--green',
    },
    {
      id: 'kpi-total-area',
      label: 'Total Field Area',
      value: formatAcres(totalAreaAcres),
      sub: 'Cumulative acreage',
      icon: <MapPin size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--amber',
    },
    {
      id: 'kpi-irrigated',
      label: 'Irrigated Fields',
      value: `${irrigatedFields} Zones`,
      sub: 'Drip & Sprinkler equipped',
      icon: <Droplets size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--cyan',
    },
    {
      id: 'kpi-active-crops',
      label: 'Active Crop Fields',
      value: `${activeCropFields} of ${totalFields}`,
      sub: 'Under standing cultivation',
      icon: <Sprout size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--blue',
    },
  ];

  return (
    <section className="agri-field-summary-grid" aria-label="Field Summary Metrics">
      {cards.map((card) => (
        <div key={card.id} className="agri-field-summary-card">
          <div className={`agri-field-summary-icon ${card.colorClass}`}>
            {card.icon}
          </div>
          <div className="agri-field-summary-info">
            <span className="agri-field-summary-label">{card.label}</span>
            <span className="agri-field-summary-value">{card.value}</span>
            <span className="agri-field-summary-sub">{card.sub}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
