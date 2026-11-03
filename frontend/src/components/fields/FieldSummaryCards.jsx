import { useTranslation } from 'react-i18next';
import { Grid3X3, MapPin, Droplets, Sprout } from 'lucide-react';
import { formatAcres } from '../../utils/formatters';

/**
 * FieldSummaryCards component
 * Displays high-level summary KPIs for mapped fields.
 */
export default function FieldSummaryCards({ summary }) {
  const { t } = useTranslation();
  const {
    totalFields = 8,
    totalAreaAcres = 42.5,
    irrigatedFields = 6,
    activeCropFields = 7,
  } = summary || {};

  const cards = [
    {
      id: 'kpi-total-fields',
      label: t('fields.title', 'Total Fields'),
      value: `${totalFields}`,
      sub: t('farms.fieldsCount', 'Mapped boundaries'),
      icon: <Grid3X3 size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--green',
    },
    {
      id: 'kpi-total-area',
      label: t('dashboard.totalArea', 'Total Field Area'),
      value: formatAcres(totalAreaAcres),
      sub: t('fields.area', 'Cumulative acreage'),
      icon: <MapPin size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--amber',
    },
    {
      id: 'kpi-irrigated',
      label: t('irrigation.title', 'Irrigated Fields'),
      value: `${irrigatedFields}`,
      sub: t('fields.irrigationSystem', 'Equipped plots'),
      icon: <Droplets size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--cyan',
    },
    {
      id: 'kpi-active-crops',
      label: t('dashboard.activeCrops', 'Active Crop Fields'),
      value: `${activeCropFields} / ${totalFields}`,
      sub: t('fields.currentCrop', 'Standing cultivation'),
      icon: <Sprout size={22} aria-hidden="true" />,
      colorClass: 'agri-field-summary-icon--blue',
    },
  ];

  return (
    <section className="agri-field-summary-grid" aria-label={t('fields.title', 'Field Summary Metrics')}>
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
