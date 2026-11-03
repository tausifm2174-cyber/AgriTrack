import { useTranslation } from 'react-i18next';
import { BellOff, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

/**
 * NotificationEmptyState Component
 * @param {Object} props
 * @param {boolean} props.isFiltered
 * @param {Function} props.onReset
 */
export default function NotificationEmptyState({ isFiltered, onReset }) {
  const { t } = useTranslation();

  return (
    <div className="agri-notif-empty">
      <div className="agri-notif-empty__icon" aria-hidden="true">
        <BellOff size={28} />
      </div>
      <h3 className="agri-notif-empty__title">
        {isFiltered ? t('notifications.noMatching', 'No matching notifications found') : t('notifications.allCaughtUp', 'All caught up!')}
      </h3>
      <p className="agri-notif-empty__desc">
        {isFiltered
          ? t('notifications.adjustFilters', 'Try adjusting your search keywords, notification type, or severity filters.')
          : t('notifications.noNotifications', 'There are no active notifications or farm alerts at this time. You can restore the demo dataset whenever needed.')}
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<RotateCcw size={15} />}
        onClick={onReset}
      >
        {isFiltered ? t('common.clearFilters', 'Clear active filters') : t('notifications.restoreDemo', 'Restore Demo Notifications')}
      </Button>
    </div>
  );
}

