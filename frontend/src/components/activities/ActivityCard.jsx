import { useTranslation } from 'react-i18next';
import { Eye, Edit3, Trash2, Calendar, Clock, MapPin, Sprout } from 'lucide-react';
import { Button } from '../common';
import ActivityStatusBadge from './ActivityStatusBadge';
import ActivityTypePill from './ActivityTypePill';
import { translateCrop, formatFieldName } from '../../utils/displayLabels';

/**
 * ActivityCard Component
 * Responsive mobile card view representing an individual agricultural activity.
 */
export default function ActivityCard({
  activity,
  onViewActivity,
  onEditActivity,
  onDeleteActivity,
  farmsMap = {},
  fieldsMap = {},
}) {
  const { t } = useTranslation();
  const rawFarmName = farmsMap[activity.farmId]?.name || activity.farmId;
  const farmName = t(`farms.demoNames.${activity.farmId}`, rawFarmName);
  const rawFieldName = fieldsMap[activity.fieldId]?.name || activity.fieldId;
  const fieldName = formatFieldName(rawFieldName, t);

  return (
    <div className="agri-activity-card" role="article" aria-label={activity.title}>
      {/* Card Header: Type Pill & Status Badge */}
      <div className="agri-activity-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ActivityTypePill type={activity.activityType} />
          <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
            {activity.id}
          </span>
        </div>
        <ActivityStatusBadge status={activity.status} />
      </div>

      {/* Card Title */}
      <div>
        <h3 className="agri-activity-card__title">{activity.title}</h3>
        {activity.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            {activity.description}
          </p>
        )}
      </div>

      {/* Card Body Metadata */}
      <div className="agri-activity-card__body">
        {/* Farm & Field */}
        <div className="agri-activity-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <MapPin size={13} aria-hidden="true" />
            {t('profile.location')}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--slate-800)', textAlign: 'right' }}>
            {fieldName} • <span style={{ fontWeight: 400, color: 'var(--slate-500)' }}>{farmName}</span>
          </span>
        </div>

        {/* Crop */}
        <div className="agri-activity-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <Sprout size={13} aria-hidden="true" />
            {t('navigation.crops')}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
            {activity.cropName ? translateCrop(activity.cropName, t) : '—'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="agri-activity-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <Calendar size={13} aria-hidden="true" />
            {t('common.date')} & {t('common.time')}
          </span>
          <span style={{ color: 'var(--slate-700)', fontWeight: 500 }}>
            {activity.date} {activity.time ? `• ${activity.time}` : ''}
          </span>
        </div>

        {/* Duration */}
        {activity.duration && (
          <div className="agri-activity-card__row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
              <Clock size={13} aria-hidden="true" />
              {t('irrigation.duration')}
            </span>
            <span style={{ color: 'var(--slate-700)' }}>
              {activity.duration} {t('units.hours')}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="agri-activity-card__footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewActivity(activity)}
            aria-label={`${t('common.viewDetails')}: ${activity.title}`}
          >
            <Eye size={13} aria-hidden="true" />
            <span>{t('common.viewDetails')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditActivity(activity)}
            aria-label={`${t('common.edit')}: ${activity.title}`}
          >
            <Edit3 size={13} aria-hidden="true" />
            <span>{t('common.edit')}</span>
          </Button>

          {onDeleteActivity && (
            <button
              type="button"
              className="agri-btn-icon agri-btn-icon--danger"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--slate-200)',
                background: '#ffffff',
                color: 'var(--danger-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => onDeleteActivity(activity)}
              aria-label={`${t('common.delete')}: ${activity.title}`}
              title={t('common.delete')}
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
