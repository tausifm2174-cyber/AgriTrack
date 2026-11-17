import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Edit3,
  Trash2,
  Ban,
  Calendar,
  Clock,
  MapPin,
  Sprout,
  Droplets,
  ExternalLink,
  CloudRain,
  Gauge,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { Button } from '../common';
import IrrigationStatusBadge from './IrrigationStatusBadge';
import IrrigationMethodPill from './IrrigationMethodPill';

/**
 * IrrigationDetailsModal Component
 * Accessible dialog inspecting full irrigation schedule specs, water telemetry,
 * weather parameters, and cross-module deep navigation links.
 * 
 * @param {Object} props
 * @param {Object} props.schedule
 * @param {Function} props.onClose
 * @param {Function} props.onEdit
 * @param {Object} [props.farmsMap]
 * @param {Object} [props.fieldsMap]
 */
export default function IrrigationDetailsModal({
  schedule,
  onClose,
  onEdit,
  onDelete,
  onCancel,
  farmsMap = {},
  fieldsMap = {},
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!schedule) return null;

  const farm = farmsMap[schedule.farmId];
  const field = fieldsMap[schedule.fieldId];
  const farmName = farm?.name || schedule.farmId;
  const fieldName = field?.name || schedule.fieldId;

  const handleNavigateToField = () => {
    onClose();
    navigate(`/fields?fieldId=${schedule.fieldId}`);
  };

  const handleNavigateToCrop = () => {
    onClose();
    navigate(`/crops?fieldId=${schedule.fieldId}`);
  };

  const handleNavigateToWeather = () => {
    onClose();
    navigate('/weather');
  };

  const handleNavigateToRecommendations = () => {
    onClose();
    navigate(`/recommendations?fieldId=${schedule.fieldId}`);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="irrigation-details-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="agri-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <IrrigationMethodPill method={schedule.irrigationMethod} />
              <IrrigationStatusBadge status={schedule.status} />
              {schedule.priority && (
                <span
                  className={`agri-priority-pill agri-priority-pill--${schedule.priority.toLowerCase()}`}
                >
                  {schedule.priority}
                </span>
              )}
            </div>
            <h3 id="irrigation-details-title" className="agri-modal-title" style={{ marginTop: '0.25rem' }}>
              {schedule.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
              ID: {schedule.id}
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

        {/* Body */}
        <div className="agri-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

            {/* Associated Crop with deep link */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('crops.cropName')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Sprout size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                  <span>{schedule.cropName || '—'}</span>
                </div>
                {schedule.fieldId && (
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

            {/* Timing */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('common.date')} & {t('common.time')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                <Calendar size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{schedule.scheduledDate} {schedule.scheduledTime ? `(${schedule.scheduledTime})` : ''}</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('irrigation.duration')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                <Clock size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{schedule.durationMinutes} min</span>
              </div>
            </div>

            {/* Water Volume */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('irrigation.waterQuantity')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                <Droplets size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                <span>
                  {schedule.waterVolumeLitres ? `${schedule.waterVolumeLitres.toLocaleString()} ${t('units.liters')}` : '—'}
                </span>
                {schedule.waterVolumeLitres && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--slate-500)' }}>
                    ({(schedule.waterVolumeLitres / 1000).toFixed(1)} m³)
                  </span>
                )}
              </div>
            </div>

            {/* Soil Moisture */}
            {schedule.soilMoisture !== undefined && schedule.soilMoisture !== null && (
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('soil.title')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Gauge size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                  <span>{schedule.soilMoisture}%</span>
                </div>
              </div>
            )}

            {/* Weather & Rainfall Expected */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('weather.forecast')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                  <CloudRain size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                  <span>{schedule.weatherCondition || 'Normal'} ({schedule.rainfallExpected || 0} mm)</span>
                </div>
                <button
                  type="button"
                  onClick={handleNavigateToWeather}
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
                  title={t('weather.forecast')}
                >
                  <span>{t('navigation.weather')}</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {schedule.notes && (
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
                  lineHeight: 1.5,
                }}
              >
                {schedule.notes}
              </p>
            </div>
          )}

          {/* Advisory Shortcut link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.875rem',
              backgroundColor: '#f7fdf9',
              border: '1px solid var(--primary-100)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-800)' }}>
              <Lightbulb size={15} aria-hidden="true" />
              <span>{t('irrigation.advisory')}</span>
            </div>
            <button
              type="button"
              onClick={handleNavigateToRecommendations}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-700)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.8rem',
              }}
            >
              <span>{t('recommendations.title')}</span>
              <ExternalLink size={12} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDelete(schedule);
                }}
                style={{ color: 'var(--danger-text, #dc2626)', borderColor: 'var(--danger-border, #fca5a5)' }}
                aria-label={t('irrigation.deleteSchedule', 'Delete Irrigation Schedule')}
              >
                <Trash2 size={14} aria-hidden="true" />
                <span>{t('common.delete')}</span>
              </Button>
            )}

            {schedule.status === 'Scheduled' && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCancel(schedule);
                }}
                style={{ color: 'var(--warning-text, #d97706)', borderColor: 'var(--warning-border, #fcd34d)' }}
                aria-label={t('irrigation.cancelSchedule', 'Cancel Irrigation')}
              >
                <Ban size={14} aria-hidden="true" />
                <span>{t('common.cancel')}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(schedule);
              }}
              aria-label={t('common.edit')}
            >
              <Edit3 size={14} aria-hidden="true" />
              <span>{t('common.edit')}</span>
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
