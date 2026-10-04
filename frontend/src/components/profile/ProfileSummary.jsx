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
  totalHoldings = 3,
  totalFields = 8,
  totalArea = 42.5,
  activeCropsCount = 7,
}) {
  const kpis = [
    {
      id: 'holdings',
      label: 'Total Holdings',
      value: totalHoldings,
      subtext: 'Operational Farms',
      icon: Warehouse,
      colorClass: 'total',
    },
    {
      id: 'fields',
      label: 'Total Fields',
      value: totalFields,
      subtext: 'Plotted parcels',
      icon: Grid3X3,
      colorClass: 'unread',
    },
    {
      id: 'area',
      label: 'Total Area',
      value: formatAcres(totalArea),
      subtext: 'Cultivable acreage',
      icon: Compass,
      colorClass: 'warning',
    },
    {
      id: 'crops',
      label: 'Active Crops',
      value: activeCropsCount,
      subtext: 'Growing cycles',
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
