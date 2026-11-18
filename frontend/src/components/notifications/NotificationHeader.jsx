import { useTranslation } from 'react-i18next';
import { CheckCheck, RotateCcw, Trash2 } from 'lucide-react';
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

            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={15} />}
              onClick={onReset}
              title={t('common.refresh', 'Refresh notifications')}
            >
              {t('common.refresh', 'Refresh')}
            </Button>

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
    </div>
  );
}

