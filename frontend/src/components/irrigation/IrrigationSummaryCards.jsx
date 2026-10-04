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
  const cards = [
    {
      id: 'ALL',
      label: 'Total Schedules',
      value: summary.total,
      sub: 'All registered schedules',
      icon: ListTodo,
      iconVariant: 'total',
    },
    {
      id: 'Scheduled',
      label: 'Scheduled',
      value: summary.scheduled,
      sub: 'Upcoming runs',
      icon: Clock,
      iconVariant: 'scheduled',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: summary.inProgress,
      sub: 'Actively pumping',
      icon: PlayCircle,
      iconVariant: 'inprogress',
    },
    {
      id: 'Completed',
      label: 'Completed',
      value: summary.completed,
      sub: 'Executed cycles',
      icon: CheckCircle2,
      iconVariant: 'completed',
    },
    {
      id: 'VOLUME',
      label: 'Total Water Volume',
      value: `${summary.totalWaterVolumeM3} m³`,
      sub: `${(summary.totalWaterVolumeLitres / 1000).toFixed(0)}k Litres total`,
      icon: Droplets,
      iconVariant: 'water',
    },
  ];

  return (
    <div className="agri-irrigation-summary-grid" role="region" aria-label="Irrigation Metrics">
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
