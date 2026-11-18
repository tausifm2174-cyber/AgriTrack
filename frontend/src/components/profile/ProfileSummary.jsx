import { useTranslation } from 'react-i18next';
import { Warehouse, Grid3X3, Sprout, Compass } from 'lucide-react';
import { formatAcres } from '../../utils/formatters';

/**
 * ProfileSummary Component
 * 4 KPI metrics summarizing farmer portfolio
 * @param {Object} props
 * @param {number} props.totalHoldings
 * @param {number} props.totalFields
 * @param {number} props.totalArea
 * @param {number} props.activeCropsCount
 */
export default function ProfileSummary({
  totalHoldings = 0,
  totalFields = 0,
  totalArea = 0,
  activeCropsCount = 0,
}) {
  const { t } = useTranslation();

  const kpis = [
    {
      id: 'holdings',
      label: t('profile.totalHoldings', 'Total Holdings'),
      value: totalHoldings,
      subtext: t('profile.operationalFarms', 'Operational Farms'),
      icon: Warehouse,
      colorClass: 'total',
    },
    {
      id: 'fields',
      label: t('profile.activeParcels', 'Total Fields'),
      value: totalFields,
      subtext: t('profile.plottedParcels', 'Plotted parcels'),
      icon: Grid3X3,
      colorClass: 'unread',
    },
    {
      id: 'area',
      label: t('common.area', 'Total Area'),
      value: formatAcres(totalArea),
      subtext: t('profile.cultivableAcreage', 'Cultivable acreage'),
      icon: Compass,
      colorClass: 'warning',
    },
    {
      id: 'crops',
      label: t('dashboard.activeCrops', 'Active Crops'),
      value: activeCropsCount,
      subtext: t('profile.growingCycles', 'Growing cycles'),
      icon: Sprout,
      colorClass: 'unread',
    },
  ];

  return (
    <div className="agri-notif-summary-grid">
      {kpis.map((kpi) => {
        const IconComponent = kpi.icon;
        return (
          <div key={kpi.id} className="agri-notif-summary-card" style={{ cursor: 'default' }}>
            <div className="agri-notif-summary-info">
              <span className="agri-notif-summary-label">{kpi.label}</span>
              <span className="agri-notif-summary-value">{kpi.value}</span>
              <span className="agri-notif-summary-sub">{kpi.subtext}</span>
            </div>
            <div className={`agri-notif-summary-icon agri-notif-summary-icon--${kpi.colorClass}`}>
              <IconComponent size={22} aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
