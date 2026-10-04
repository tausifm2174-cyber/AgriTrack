import { BellOff, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

/**
 * NotificationEmptyState Component
 * @param {Object} props
 * @param {boolean} props.isFiltered
 * @param {Function} props.onReset
 */
export default function NotificationEmptyState({ isFiltered, onReset }) {
  return (
    <div className="agri-notif-empty">
      <div className="agri-notif-empty__icon" aria-hidden="true">
        <BellOff size={28} />
      </div>
      <h3 className="agri-notif-empty__title">
        {isFiltered ? 'No matching notifications found' : 'All caught up!'}
      </h3>
      <p className="agri-notif-empty__desc">
        {isFiltered
          ? 'Try adjusting your search keywords, notification type, or severity filters.'
          : 'There are no active notifications or farm alerts at this time. You can restore the demo dataset whenever needed.'}
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<RotateCcw size={15} />}
        onClick={onReset}
      >
        {isFiltered ? 'Clear active filters' : 'Restore Demo Notifications'}
      </Button>
    </div>
  );
}
