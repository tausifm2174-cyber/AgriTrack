import { useTranslation } from 'react-i18next';
import { ListTodo, Clock, PlayCircle, CheckCircle2, Droplets } from 'lucide-react';

/**
 * IrrigationSummaryCards Component
 * Renders 5 dynamic KPI summary cards for irrigation management:
 * Total, Scheduled, In Progress, Completed, and Total Water Volume.
 * 
 * @param {Object} props
 * @param {Object} props.summary
 * @param {string} [props.activeStatusFilter]
 * @param {Function} [props.onStatusFilterChange]
 */
export default function IrrigationSummaryCards({
  summary,
  activeStatusFilter,
  onStatusFilterChange,
}) {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'ALL',
      label: t('common.all') + ' ' + t('navigation.irrigation'),
      value: summary.total,
      sub: t('navigation.irrigation'),
      icon: ListTodo,
      iconVariant: 'total',
    },
    {
      id: 'Scheduled',
      label: t('status.scheduled'),
      value: summary.scheduled,
      sub: t('status.scheduled'),
      icon: Clock,
      iconVariant: 'scheduled',
    },
    {
      id: 'In Progress',
      label: t('status.inProgress'),
      value: summary.inProgress,
      sub: t('status.inProgress'),
      icon: PlayCircle,
      iconVariant: 'inprogress',
    },
    {
      id: 'Completed',
      label: t('status.completed'),
      value: summary.completed,
      sub: t('status.completed'),
      icon: CheckCircle2,
      iconVariant: 'completed',
    },
    {
      id: 'VOLUME',
      label: t('irrigation.waterQuantity'),
      value: `${summary.totalWaterVolumeM3} m³`,
      sub: `${(summary.totalWaterVolumeLitres / 1000).toFixed(0)}k ${t('units.liters')}`,
      icon: Droplets,
      iconVariant: 'water',
    },
  ];

  return (
    <div className="agri-irrigation-summary-grid" role="region" aria-label={t('navigation.irrigation')}>
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isClickable = card.id !== 'VOLUME';
        const isActive =
          isClickable &&
          (activeStatusFilter === card.id || (card.id === 'ALL' && !activeStatusFilter));

        return (
          <button
            key={card.id}
            type="button"
            className={`agri-irrigation-summary-card ${
              isActive ? 'agri-irrigation-summary-card--active' : ''
            }`}
            onClick={() => {
              if (isClickable) {
                onStatusFilterChange?.(card.id === 'ALL' ? '' : card.id);
              }
            }}
            aria-pressed={isClickable ? isActive : undefined}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
          >
            <div className="agri-irrigation-summary-info">
              <span className="agri-irrigation-summary-label">{card.label}</span>
              <span className="agri-irrigation-summary-value">{card.value}</span>
              <span className="agri-irrigation-summary-sub">{card.sub}</span>
            </div>
            <div
              className={`agri-irrigation-summary-icon agri-irrigation-summary-icon--${card.iconVariant}`}
            >
              <IconComponent size={22} aria-hidden="true" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
