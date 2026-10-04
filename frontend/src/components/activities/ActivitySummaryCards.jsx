import { CalendarCheck2, Clock, CheckCircle2, ListTodo } from 'lucide-react';

/**
 * ActivitySummaryCards Component
 * Displays 4 responsive KPI cards for activity metrics:
 * Total, Planned, In Progress, and Completed.
 */
export default function ActivitySummaryCards({ summary, activeStatusFilter, onStatusFilterChange }) {
  const cards = [
    {
      id: 'ALL',
      label: 'Total Activities',
      value: summary.total,
      sub: 'All recorded activities',
      icon: ListTodo,
      iconVariant: 'total',
    },
    {
      id: 'Planned',
      label: 'Planned',
      value: summary.planned,
      sub: 'Scheduled & upcoming',
      icon: Clock,
      iconVariant: 'planned',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: summary.inProgress,
      sub: 'Currently underway',
      icon: CalendarCheck2,
      iconVariant: 'inprogress',
    },
    {
      id: 'Completed',
      label: 'Completed',
      value: summary.completed,
      sub: 'Successfully finished',
      icon: CheckCircle2,
      iconVariant: 'completed',
    },
  ];

  return (
    <div className="agri-activity-summary-grid" role="region" aria-label="Activity Metrics">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeStatusFilter === card.id || (card.id === 'ALL' && !activeStatusFilter);

        return (
          <button
            key={card.id}
            type="button"
            className={`agri-activity-summary-card ${isActive ? 'agri-activity-summary-card--active' : ''}`}
            onClick={() => onStatusFilterChange?.(card.id === 'ALL' ? '' : card.id)}
            aria-pressed={isActive}
          >
            <div className="agri-activity-summary-info">
              <span className="agri-activity-summary-label">{card.label}</span>
              <span className="agri-activity-summary-value">{card.value}</span>
              <span className="agri-activity-summary-sub">{card.sub}</span>
            </div>
            <div className={`agri-activity-summary-icon agri-activity-summary-icon--${card.iconVariant}`}>
              <IconComponent size={22} aria-hidden="true" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
