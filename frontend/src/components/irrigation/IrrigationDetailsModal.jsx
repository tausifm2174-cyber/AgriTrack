import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Edit3,
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
  farmsMap = {},
  fieldsMap = {},
}) {
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
                  {schedule.priority} Priority
                </span>
              )}
            </div>
            <h3 id="irrigation-details-title" className="agri-modal-title" style={{ marginTop: '0.25rem' }}>
              {schedule.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
              Schedule ID: {schedule.id}
            </span>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close irrigation details modal"
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
                Farm Holding
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                <MapPin size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                <span>{farmName}</span>
              </div>
            </div>

            {/* Field with deep link */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Field / Parcel
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
                  title="Navigate to Field page"
                >
                  <span>View</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Associated Crop with deep link */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Target Crop
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Sprout size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                  <span>{schedule.cropName || 'N/A'}</span>
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
                    title="Navigate to Crop page"
                  >
                    <span>View</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Timing */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Schedule Window
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                <Calendar size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{schedule.scheduledDate} {schedule.scheduledTime ? `(${schedule.scheduledTime})` : ''}</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Cycle Duration
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                <Clock size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                <span>{schedule.durationMinutes} minutes</span>
              </div>
            </div>

            {/* Water Volume */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Planned Water Volume
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                <Droplets size={14} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
                <span>
                  {schedule.waterVolumeLitres ? `${schedule.waterVolumeLitres.toLocaleString()} Litres` : '—'}
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
                  Soil Moisture Level
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  <Gauge size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                  <span>{schedule.soilMoisture}%</span>
                  <span style={{ fontSize: '0.725rem', fontWeight: 500, color: schedule.soilMoisture < 40 ? 'var(--warning-text)' : 'var(--success-text)' }}>
                    ({schedule.soilMoisture < 40 ? 'Below 40% Target' : 'Adequate'})
                  </span>
                </div>
              </div>
            )}

            {/* Weather & Rainfall Expected */}
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                Forecast Weather
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500, color: 'var(--slate-800)' }}>
                  <CloudRain size={14} style={{ color: 'var(--slate-500)' }} aria-hidden="true" />
                  <span>{schedule.weatherCondition || 'Normal'} ({schedule.rainfallExpected || 0} mm rain)</span>
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
                  title="View weather forecast"
                >
                  <span>Radar</span>
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
                  Agronomic Delivery Notes
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
              <span>Need irrigation crop advisory recommendations for this parcel?</span>
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
              <span>View Advisory</span>
              <ExternalLink size={12} aria-hidden="true" />
            </button>
          </div>

          {/* Timestamps */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--slate-400)' }}>
            <span>Created: {schedule.createdAt ? new Date(schedule.createdAt).toLocaleDateString() : 'N/A'}</span>
            {schedule.completedAt && (
              <span>Completed: {new Date(schedule.completedAt).toLocaleDateString()} {new Date(schedule.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(schedule);
            }}
            aria-label="Edit this schedule"
          >
            <Edit3 size={14} aria-hidden="true" />
            <span>Edit Schedule</span>
          </Button>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
