import { CheckCheck, RotateCcw, Trash2, Info } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Button from '../common/Button';

/**
 * NotificationHeader Component
 * @param {Object} props
 * @param {number} props.unreadCount
 * @param {number} props.totalCount
 * @param {Function} props.onMarkAllAsRead
 * @param {Function} props.onClearAll
 * @param {Function} props.onReset
 */
export default function NotificationHeader({
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll,
  onReset,
}) {
  return (
    <div className="agri-notif-header-wrapper">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with farm activities, weather alerts, crop advisories and financial events."
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCheck size={16} />}
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              title={unreadCount === 0 ? 'All notifications are already read' : 'Mark all notifications as read'}
            >
              Mark all read
            </Button>

            {totalCount < 15 && (
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw size={15} />}
                onClick={onReset}
                title="Restore default demo notification dataset"
              >
                Reset Demo
              </Button>
            )}

            {totalCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 size={15} />}
                onClick={onClearAll}
                title="Clear all notifications"
                style={{ color: 'var(--danger-text)' }}
              >
                Clear all
              </Button>
            )}
          </div>
        }
      />

      <div className="agri-demo-banner" role="status" style={{ marginTop: '0.75rem' }}>
        <Info size={16} className="agri-demo-banner__icon" aria-hidden="true" />
        <span className="agri-demo-banner__text">
          <strong>Demo Mode</strong> — Data shown in this application is sample data for demonstration purposes. Alerts are simulated across Green Valley Farm, Sunrise Holding, and Riverbank Farm.
        </span>
        <span className="agri-demo-banner__badge">Frontend Demo</span>
      </div>
    </div>
  );
}
