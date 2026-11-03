import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  ExternalLink,
  Check,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import NotificationTypeIcon from './NotificationTypeIcon';
import {
  translateCrop,
  formatFieldName,
  translateTime,
  translateStatus,
} from '../../utils/displayLabels';

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
  const { t } = useTranslation();
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

  const localizedTitle = t(`notifications.items.${item.id}.title`, item.title);
  const localizedMessage = t(`notifications.items.${item.id}.message`, item.message);
  const localizedActionLabel = item.actionLabel
    ? t(`notifications.items.${item.id}.actionLabel`, item.actionLabel)
    : t('notifications.viewInModule', 'View in Module');

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
                <span className="agri-notif-type-tag">
                  {t(`notifications.type.${typeClass}`, item.type)}
                </span>
                <StatusBadge variant={badgeVariant}>
                  {translateStatus(item.severity, t)}
                </StatusBadge>
                <StatusBadge variant={item.isRead ? 'neutral' : 'info'}>
                  {item.isRead ? t('notifications.read', 'Read') : t('notifications.unread', 'Unread')}
                </StatusBadge>
              </div>
              <h3 id="notif-modal-title" className="agri-modal-title">
                {localizedTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          <p style={{ fontSize: '0.925rem', color: 'var(--slate-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
            {localizedMessage}
          </p>

          <div className="agri-notif-modal-grid">
            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('common.time', 'Timestamp')}</span>
              <span className="agri-notif-modal-value">{translateTime(item.timestamp, t)}</span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('common.status', 'Read Status')}</span>
              <span className="agri-notif-modal-value">
                {item.isRead ? t('notifications.markedRead', 'Marked as Read') : t('notifications.requiresAttention', 'Unread / Requires Attention')}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('farms.farm', 'Associated Farm')}</span>
              <span className="agri-notif-modal-value">
                {item.farmName
                  ? `${t(`farms.demoNames.${item.farmId}`, item.farmName)}${item.farmId ? ` (${item.farmId})` : ''}`
                  : t('notifications.systemWide', 'System-wide / Not Applicable')}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('fields.field', 'Field / Zone')}</span>
              <span className="agri-notif-modal-value">
                {item.fieldName
                  ? `${formatFieldName(item.fieldName, t)}${item.fieldId ? ` (${item.fieldId})` : ''}`
                  : t('notifications.allFieldsGeneral', 'All Fields / General')}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('crops.crop', 'Crop Cycle')}</span>
              <span className="agri-notif-modal-value">
                {item.cropName ? translateCrop(item.cropName, t) : t('common.na', 'N/A')}
              </span>
            </div>

            <div className="agri-notif-modal-row">
              <span className="agri-notif-modal-label">{t('notifications.targetRoute', 'Target Route')}</span>
              <span className="agri-notif-modal-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {item.relatedRoute || t('common.none', 'None')}
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
            {item.isRead ? t('notifications.markAsUnread', 'Mark as Unread') : t('notifications.markAsRead', 'Mark as Read')}
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t('common.close', 'Close')}
            </Button>
            {item.relatedRoute && (
              <Button
                variant="primary"
                size="sm"
                icon={<ExternalLink size={14} />}
                onClick={handleNavigateToRoute}
              >
                {localizedActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

