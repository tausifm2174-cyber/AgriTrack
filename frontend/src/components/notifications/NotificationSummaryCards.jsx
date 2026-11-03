import { useTranslation } from 'react-i18next';
import { Bell, Inbox, AlertTriangle, AlertOctagon } from 'lucide-react';

/**
 * NotificationSummaryCards Component
 * Renders 4 KPI summary cards for notification metrics.
 * @param {Object} props
 * @param {Object} props.summary
 * @param {string} props.activeStatusFilter
 * @param {string} props.activeSeverityFilter
 * @param {Function} props.onSelectFilter
 */
export default function NotificationSummaryCards({
  summary,
  activeStatusFilter,
  activeSeverityFilter,
  onSelectFilter,
}) {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'total',
      label: t('notifications.totalNotifications', 'Total Notifications'),
      value: summary.total,
      subtext: t('notifications.acrossAllModules', 'Across all modules'),
      icon: Bell,
      type: 'total',
      isActive: activeStatusFilter === 'all' && activeSeverityFilter === 'all',
      onClick: () => onSelectFilter({ status: 'all', severity: 'all' }),
    },
    {
      id: 'unread',
      label: t('notifications.unreadAlerts', 'Unread Alerts'),
      value: summary.unread,
      subtext: t('notifications.actionRequiredCount', '{{count}} action required', { count: summary.unread }),
      icon: Inbox,
      type: 'unread',
      isActive: activeStatusFilter === 'unread',
      onClick: () => onSelectFilter({ status: 'unread', severity: 'all' }),
    },
    {
      id: 'warnings',
      label: t('notifications.warnings', 'Warnings'),
      value: summary.warnings,
      subtext: t('notifications.cautionaryNotices', 'Cautionary operational notices'),
      icon: AlertTriangle,
      type: 'warning',
      isActive: activeSeverityFilter === 'WARNING',
      onClick: () => onSelectFilter({ severity: 'WARNING', status: 'all' }),
    },
    {
      id: 'critical',
      label: t('notifications.criticalAlerts', 'Critical Alerts'),
      value: summary.critical,
      subtext: t('notifications.highPriorityHazards', 'High-priority farm hazards'),
      icon: AlertOctagon,
      type: 'critical',
      isActive: activeSeverityFilter === 'CRITICAL',
      onClick: () => onSelectFilter({ severity: 'CRITICAL', status: 'all' }),
    },
  ];

  return (
    <div className="agri-notif-summary-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`agri-notif-summary-card ${card.isActive ? 'agri-notif-summary-card--active' : ''}`}
            onClick={card.onClick}
            role="button"
            tabIndex={0}
            aria-label={`${card.label}: ${card.value}. Click to filter.`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.onClick();
              }
            }}
          >
            <div className="agri-notif-summary-info">
              <span className="agri-notif-summary-label">{card.label}</span>
              <span className="agri-notif-summary-value">{card.value}</span>
              <span className="agri-notif-summary-sub">{card.subtext}</span>
            </div>
            <div className={`agri-notif-summary-icon agri-notif-summary-icon--${card.type}`}>
              <IconComponent size={22} aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

