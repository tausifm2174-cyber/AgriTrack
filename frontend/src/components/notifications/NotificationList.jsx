import NotificationItem from './NotificationItem';

/**
 * NotificationList Component
 * @param {Object} props
 * @param {Array} props.notifications
 * @param {Function} props.onSelect
 * @param {Function} props.onToggleRead
 * @param {Function} props.onDismiss
 */
export default function NotificationList({
  notifications = [],
  onSelect,
  onToggleRead,
  onDismiss,
}) {
  return (
    <div className="agri-notif-list">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onSelect={onSelect}
          onToggleRead={onToggleRead}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
