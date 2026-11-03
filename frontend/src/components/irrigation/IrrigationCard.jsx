import { useTranslation } from 'react-i18next';
import { Eye, Edit3, Trash2, Calendar, Clock, MapPin, Sprout, Ban } from 'lucide-react';
import { Button } from '../common';
import IrrigationStatusBadge from './IrrigationStatusBadge';
import IrrigationMethodPill from './IrrigationMethodPill';
import { translateCrop, formatFieldName, translateStatus } from '../../utils/displayLabels';

/**
 * IrrigationCard Component
 * Responsive mobile card representing a single irrigation schedule.
 * 
 * @param {Object} props
 * @param {Object} props.schedule
 * @param {Function} props.onViewSchedule
 * @param {Function} props.onEditSchedule
 * @param {Function} [props.onDeleteSchedule]
 * @param {Function} [props.onCancelSchedule]
 * @param {Object} [props.farmsMap]
 * @param {Object} [props.fieldsMap]
 */
export default function IrrigationCard({
  schedule,
  onViewSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onCancelSchedule,
  farmsMap = {},
  fieldsMap = {},
}) {
  const { t } = useTranslation();
  const farmName = farmsMap[schedule.farmId]?.name
    ? t(`farms.demoNames.${schedule.farmId}`, farmsMap[schedule.farmId].name)
    : schedule.farmId;
  const fieldName = fieldsMap[schedule.fieldId]?.name
    ? formatFieldName(fieldsMap[schedule.fieldId].name, t)
    : schedule.fieldId;
  const isScheduled = schedule.status === 'Scheduled';

  return (
    <div className="agri-irrigation-card" role="article" aria-label={schedule.title}>
      {/* Header: Method Pill, Priority, Status */}
      <div className="agri-irrigation-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <IrrigationMethodPill method={schedule.irrigationMethod} />
          {schedule.priority && (
            <span
              className={`agri-priority-pill agri-priority-pill--${schedule.priority.toLowerCase()}`}
            >
              {translateStatus(schedule.priority, t)}
            </span>
          )}
          <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
            {schedule.id}
          </span>
        </div>
        <IrrigationStatusBadge status={schedule.status} />
      </div>

      {/* Title */}
      <div>
        <h3 className="agri-irrigation-card__title">{schedule.title}</h3>
        {schedule.notes && (
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            {schedule.notes}
          </p>
        )}
      </div>

      {/* Body Metadata */}
      <div className="agri-irrigation-card__body">
        {/* Location */}
        <div className="agri-irrigation-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <MapPin size={13} aria-hidden="true" />
            {t('navigation.fields')} / {t('navigation.farms')}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--slate-800)', textAlign: 'right' }}>
            {fieldName} • <span style={{ fontWeight: 400, color: 'var(--slate-500)' }}>{farmName}</span>
          </span>
        </div>

        {/* Crop */}
        <div className="agri-irrigation-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <Sprout size={13} aria-hidden="true" />
            {t('crops.cropName')}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
            {schedule.cropName ? translateCrop(schedule.cropName, t) : '—'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="agri-irrigation-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <Calendar size={13} aria-hidden="true" />
            {t('common.date')}
          </span>
          <span style={{ color: 'var(--slate-700)', fontWeight: 500 }}>
            {schedule.scheduledDate} {schedule.scheduledTime ? `• ${schedule.scheduledTime}` : ''}
          </span>
        </div>

        {/* Duration & Water Volume */}
        <div className="agri-irrigation-card__row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-500)' }}>
            <Clock size={13} aria-hidden="true" />
            {t('irrigation.duration')} & {t('irrigation.waterQuantity')}
          </span>
          <span style={{ color: 'var(--slate-900)', fontWeight: 700 }}>
            {schedule.durationMinutes} min • {schedule.waterVolumeLitres ? `${schedule.waterVolumeLitres.toLocaleString()} L` : '—'}
          </span>
        </div>

        {/* Soil Moisture if present */}
        {schedule.soilMoisture !== undefined && schedule.soilMoisture !== null && (
          <div className="agri-irrigation-card__row">
            <span style={{ color: 'var(--slate-500)' }}>{t('soil.title')}</span>
            <span style={{ fontWeight: 600, color: schedule.soilMoisture < 40 ? 'var(--warning-text)' : 'var(--primary-700)' }}>
              {schedule.soilMoisture}%
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="agri-irrigation-card__footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'flex-end' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewSchedule(schedule)}
            aria-label={`${t('common.viewDetails')}: ${schedule.title}`}
          >
            <Eye size={13} aria-hidden="true" />
            <span>{t('common.viewDetails')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSchedule(schedule)}
            aria-label={`${t('common.edit')}: ${schedule.title}`}
          >
            <Edit3 size={13} aria-hidden="true" />
            <span>{t('common.edit')}</span>
          </Button>

          {isScheduled && onCancelSchedule && (
            <button
              type="button"
              className="agri-btn-icon"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--slate-200)',
                background: '#ffffff',
                color: 'var(--warning-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => onCancelSchedule(schedule)}
              aria-label={`${t('common.cancel')}: ${schedule.title}`}
              title={t('common.cancel')}
            >
              <Ban size={14} aria-hidden="true" />
            </button>
          )}

          {onDeleteSchedule && (
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
              onClick={() => onDeleteSchedule(schedule)}
              aria-label={`${t('common.delete')}: ${schedule.title}`}
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

