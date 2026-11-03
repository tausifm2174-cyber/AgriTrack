import { useTranslation } from 'react-i18next';
import { Warehouse, Grid3X3, MapPin, CheckCircle2 } from 'lucide-react';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmSummaryCards component
 * Displays high-level summary KPIs for farm holdings.
 */
export default function FarmSummaryCards({ summary }) {
  const { t } = useTranslation();
  const {
    totalHoldings = 3,
    totalFields = 8,
    totalAreaAcres = 42.5,
    activeHoldings = 3,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-holdings',
      label: t('farms.fieldsCount', 'Total Farms'),
      value: `${totalHoldings} ${t('farms.title', 'Farms')}`,
      sub: t('farms.subtitle', 'Registered properties'),
      icon: <Warehouse size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--green',
    },
    {
      id: 'kpi-fields',
      label: t('fields.totalFields', 'Total Fields'),
      value: `${totalFields} ${t('navigation.fields', 'Fields')}`,
      sub: t('fields.subtitle', 'Mapped operational plots'),
      icon: <Grid3X3 size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--blue',
    },
    {
      id: 'kpi-area',
      label: t('farms.totalArea', 'Total Area'),
      value: formatAcres(totalAreaAcres, t),
      sub: t('profile.totalHoldings', 'Cumulative acreage'),
      icon: <MapPin size={22} aria-hidden="true" />,
      colorClass: 'agri-farm-summary-icon--amber',
    },
    {
      id: 'kpi-active',
      label: t('common.active', 'Active Holdings'),
      value: `${activeHoldings} ${t('common.of', 'of')} ${totalHoldings}`,
      sub: t('status.active', '100% Operational status'),
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
