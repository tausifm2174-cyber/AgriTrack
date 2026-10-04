import {
  Check,
  RotateCcw,
  X,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import NotificationTypeIcon from './NotificationTypeIcon';

/**
 * Maps severity to StatusBadge variant
 * @param {string} severity
 */
function getSeverityVariant(severity) {
  switch (severity) {
    case 'CRITICAL':
      return 'danger';
    case 'WARNING':
      return 'warning';
    case 'SUCCESS':
      return 'success';
    case 'INFO':
    default:
      return 'info';
  }
}

/**
 * NotificationItem Component
 * @param {Object} props
 * @param {Object} props.item
 * @param {Function} props.onSelect
 * @param {Function} props.onToggleRead
 * @param {Function} props.onDismiss
 */
export default function NotificationItem({
  item,
  onSelect,
  onToggleRead,
  onDismiss,
}) {
  const typeClass = item.type ? item.type.toLowerCase() : 'system';
  const badgeVariant = getSeverityVariant(item.severity);

  return (
    <div
      className={`agri-notif-card ${!item.isRead ? 'agri-notif-card--unread' : 'agri-notif-card--read'}`}
      role="article"
      aria-label={`${item.title} (${item.isRead ? 'Read' : 'Unread'})`}
    >
      {/* Type Icon */}
      <div
        className={`agri-notif-type-icon agri-notif-type-icon--${typeClass}`}
        aria-hidden="true"
      >
        <NotificationTypeIcon type={item.type} size={20} />
      </div>

      {/* Main Content (Click opens modal) */}
      <div
        className="agri-notif-main"
        onClick={() => onSelect(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
      >
        {/* Header line: Type tag, Severity Badge, Unread status */}
        <div className="agri-notif-header-line">
          {!item.isRead && (
            <span className="agri-notif-unread-indicator" aria-label="Unread alert" />
          )}
          <span className="agri-notif-type-tag">{item.type}</span>
          <StatusBadge variant={badgeVariant}>{item.severity}</StatusBadge>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginLeft: 'auto' }}>
            {item.timestamp}
          </span>
        </div>

        {/* Title */}
        <h4 className="agri-notif-title">{item.title}</h4>

        {/* Message */}
        <p className="agri-notif-message">{item.message}</p>

        {/* Metadata Pill Tags */}
        <div className="agri-notif-meta-row">
          {item.farmName && (
            <span className="agri-notif-meta-pill">
              <MapPin size={11} aria-hidden="true" />
              {item.farmName}
            </span>
          )}
          {item.fieldName && (
            <span className="agri-notif-meta-pill">
              {item.fieldName}
            </span>
          )}
          {item.cropName && (
            <span className="agri-notif-meta-pill">
              🌱 {item.cropName}
            </span>
          )}
          {item.relatedRoute && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--primary-700)',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              <span>{item.actionLabel || 'View details'}</span>
              <ExternalLink size={11} aria-hidden="true" />
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="agri-notif-actions">
        <button
          type="button"
          className={`agri-notif-btn-icon ${!item.isRead ? 'agri-notif-btn-icon--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead(item.id);
          }}
          aria-label={item.isRead ? 'Mark as unread' : 'Mark as read'}
          title={item.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          {item.isRead ? <RotateCcw size={14} /> : <Check size={15} />}
        </button>

        <button
          type="button"
          className="agri-notif-btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(item.id);
          }}
          aria-label="Dismiss notification"
          title="Dismiss this notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
