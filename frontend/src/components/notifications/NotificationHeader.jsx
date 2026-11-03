import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="agri-notif-header-wrapper">
      <PageHeader
        title={t('notifications.title', 'Notifications')}
        subtitle={t('notifications.subtitle', 'Stay updated with farm activities, weather alerts, crop advisories and financial events.')}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCheck size={16} />}
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              title={unreadCount === 0 ? t('notifications.allRead', 'All notifications are already read') : t('notifications.markAllRead', 'Mark all notifications as read')}
            >
              {t('notifications.markAllRead', 'Mark all read')}
            </Button>

            {totalCount < 15 && (
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw size={15} />}
                onClick={onReset}
                title={t('notifications.restoreDefault', 'Restore default demo notification dataset')}
              >
                {t('common.reset', 'Reset Demo')}
              </Button>
            )}

            {totalCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 size={15} />}
                onClick={onClearAll}
                title={t('notifications.clearAll', 'Clear all notifications')}
                style={{ color: 'var(--danger-text)' }}
              >
                {t('notifications.clearAll', 'Clear all')}
              </Button>
            )}
          </div>
        }
      />

      <div className="agri-demo-banner" role="status" style={{ marginTop: '0.75rem' }}>
        <Info size={16} className="agri-demo-banner__icon" aria-hidden="true" />
        <span className="agri-demo-banner__text">
          <strong>{t('notifications.demoModeTitle', 'Demo Mode')}</strong> — {t('notifications.demoModeDesc', 'Data shown in this application is sample data for demonstration purposes. Alerts are simulated across Green Valley Farm, Sunrise Holding, and Riverbank Farm.')}
        </span>
        <span className="agri-demo-banner__badge">{t('notifications.frontendDemo', 'Frontend Demo')}</span>
      </div>
    </div>
  );
}

