import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ExternalLink,
  Check,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import NotificationTypeIcon from './NotificationTypeIcon';

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
 * NotificationDetailsModal Component
 * @param {Object} props
 * @param {Object} props.item
 * @param {Function} props.onClose
 * @param {Function} props.onToggleRead
 */
export default function NotificationDetailsModal({
  item,
  onClose,
  onToggleRead,
}) {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const typeClass = item.type ? item.type.toLowerCase() : 'system';
  const badgeVariant = getSeverityVariant(item.severity);

  const handleNavigateToRoute = () => {
    if (item.relatedRoute) {
      onClose();
      navigate(item.relatedRoute);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        {/* Header */}
        <div className="agri-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              className={`agri-notif-type-icon agri-notif-type-icon--${typeClass}`}
              aria-hidden="true"
            >
              <NotificationTypeIcon type={item.type} size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="agri-notif-type-tag">{item.type}</span>
                <StatusBadge variant={badgeVariant}>{item.severity}</StatusBadge>
                <StatusBadge variant={item.isRead ? 'neutral' : 'info'}>
                  {item.isRead ? 'Read' : 'Unread'}
                </StatusBadge>
              </div>
              <h3 id="notif-modal-title" className="agri-modal-title">
                {item.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          <p style={{ fontSize: '0.925rem', color: 'var(--slate-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
            {item.message}
          </p>

          <div className="agri-notif-modal-grid">
            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Timestamp</span>
              <span className="agri-notif-modal-value">{item.timestamp}</span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Read Status</span>
              <span className="agri-notif-modal-value">
                {item.isRead ? 'Marked as Read' : 'Unread / Requires Attention'}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Associated Farm</span>
              <span className="agri-notif-modal-value">
                {item.farmName ? `${item.farmName} (${item.farmId})` : 'System-wide / Not Applicable'}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Field / Zone</span>
              <span className="agri-notif-modal-value">
                {item.fieldName ? `${item.fieldName} (${item.fieldId})` : 'All Fields / General'}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Crop Cycle</span>
              <span className="agri-notif-modal-value">
                {item.cropName ? item.cropName : 'N/A'}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">Target Route</span>
              <span className="agri-notif-modal-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {item.relatedRoute || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Button
            variant="outline"
            size="sm"
            icon={item.isRead ? <RotateCcw size={14} /> : <Check size={14} />}
            onClick={() => onToggleRead(item.id)}
          >
            {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            {item.relatedRoute && (
              <Button
                variant="primary"
                size="sm"
                icon={<ExternalLink size={14} />}
                onClick={handleNavigateToRoute}
              >
                {item.actionLabel || 'View in Module'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
