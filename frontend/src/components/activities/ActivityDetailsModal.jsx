import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sprout,
  User,
  Layers,
  FileText,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Button } from '../common';
import ActivityStatusBadge from './ActivityStatusBadge';
import ActivityTypePill from './ActivityTypePill';
import { translateCrop, formatFieldName, translateStatus } from '../../utils/displayLabels';

/**
 * ActivityDetailsModal Component
 * Full screen / desktop dialog presenting all details of an activity,
 * with navigation links to associated farm, field, and crop modules.
 */
export default function ActivityDetailsModal({
  activity,
  onClose,
  onEdit,
  onDelete,
  farmsMap = {},
  fieldsMap = {},
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

  if (!activity) return null;

  const farm = farmsMap[activity.farmId];
  const field = fieldsMap[activity.fieldId];
  const farmName = farm?.name ? t(`farms.demoNames.${activity.farmId}`, farm.name) : activity.farmId;
  const fieldName = field?.name ? formatFieldName(field.name, t) : activity.fieldId;

  const handleNavigateToField = () => {
    onClose();
    navigate(`/fields?fieldId=${activity.fieldId}`);
  };

  const handleNavigateToCrop = () => {
    onClose();
    navigate(`/crops?fieldId=${activity.fieldId}`);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-details-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="agri-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ActivityTypePill type={activity.activityType} />
              <ActivityStatusBadge status={activity.status} />
              {activity.priority && (
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor:
                      activity.priority === 'High'
                        ? 'var(--danger-bg)'
                        : activity.priority === 'Medium'
                        ? 'var(--warning-bg)'
                        : 'var(--slate-100)',
                    color:
                      activity.priority === 'High'
                        ? 'var(--danger-text)'
                        : activity.priority === 'Medium'
                        ? 'var(--warning-text)'
                        : 'var(--slate-700)',
                  }}
                >
                  {translateStatus(activity.priority, t)}
                </span>
              )}
            </div>
            <h3 id="activity-details-title" className="agri-modal-title" style={{ marginTop: '0.25rem' }}>
              {activity.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
              ID: {activity.id}
            </span>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="agri-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Description */}
          {activity.description && (
            <div
              style={{
                backgroundColor: 'var(--slate-50)',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-100)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <Info size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', textTransform: 'uppercase' }}>
                  {t('common.description')}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.5, margin: 0 }}>
                {activity.description}
              </p>
            </div>
          )}

          {/* Key Attributes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              background: '#ffffff',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
            }}
          >
            {/* Farm */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('navigation.farms')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                <MapPin size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                <span>{farmName}</span>
              </div>
            </div>

            {/* Field with deep link */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('navigation.fields')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{fieldName}</span>
                <button
                  type="button"
                  onClick={handleNavigateToField}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-600)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: 0,
                  }}
                  title={t('common.viewDetails')}
                >
                  <span>{t('common.viewDetails')}</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Crop with deep link */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('navigation.crops')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Sprout size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                  <span>{activity.cropName ? translateCrop(activity.cropName, t) : '—'}</span>
                </div>
                {activity.fieldId && (
                  <button
                    type="button"
                    onClick={handleNavigateToCrop}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      padding: 0,
                    }}
                    title={t('common.viewDetails')}
                  >
                    <span>{t('common.viewDetails')}</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Operator */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('activities.operator')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                <User size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{activity.operator || '—'}</span>
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('activities.activityDate')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                <Calendar size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{activity.date}</span>
              </div>
            </div>

            {/* Time & Duration */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('common.time')} & {t('irrigation.duration')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                <Clock size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>
                  {activity.time || '—'} {activity.duration ? `(${activity.duration} ${t('units.hours')})` : ''}
                </span>
              </div>
            </div>

            {/* Quantity if specified */}
            {activity.quantity && (
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('irrigation.waterQuantity')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Layers size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                  <span>{activity.quantity} {activity.quantityUnit || ''}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          {activity.notes && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <FileText size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', textTransform: 'uppercase' }}>
                  {t('activities.notes')}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--slate-600)',
                  backgroundColor: 'var(--slate-50)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--slate-200)',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {activity.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDelete(activity);
                }}
                style={{ color: 'var(--danger-text, #dc2626)', borderColor: 'var(--danger-border, #fca5a5)' }}
                aria-label={t('activities.deleteActivity', 'Delete Activity')}
              >
                <Trash2 size={14} aria-hidden="true" />
                <span>{t('common.delete')}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              aria-label={t('activities.editActivity')}
            >
              <Edit3 size={14} aria-hidden="true" />
              <span>{t('activities.editActivity')}</span>
            </Button>
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
