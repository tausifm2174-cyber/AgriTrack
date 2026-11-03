import { useTranslation } from 'react-i18next';
import { CalendarCheck2, Clock, CheckCircle2, ListTodo } from 'lucide-react';

/**
 * ActivitySummaryCards Component
 * Displays 4 responsive KPI cards for activity metrics:
 * Total, Planned, In Progress, and Completed.
 */
export default function ActivitySummaryCards({ summary, activeStatusFilter, onStatusFilterChange }) {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'ALL',
      label: t('common.all') + ' ' + t('navigation.activities'),
      value: summary.total,
      sub: t('dashboard.recentActivities'),
      icon: ListTodo,
      iconVariant: 'total',
    },
    {
      id: 'Planned',
      label: t('status.planned'),
      value: summary.planned,
      sub: t('status.scheduled'),
      icon: Clock,
      iconVariant: 'planned',
    },
    {
      id: 'In Progress',
      label: t('status.inProgress'),
      value: summary.inProgress,
      sub: t('status.inProgress'),
      icon: CalendarCheck2,
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
  ];

  return (
    <div className="agri-activity-summary-grid" role="region" aria-label={t('navigation.activities')}>
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
