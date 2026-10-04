import { Calendar, Clock, Droplets, MapPin, Eye } from 'lucide-react';
import IrrigationStatusBadge from './IrrigationStatusBadge';
import IrrigationMethodPill from './IrrigationMethodPill';

/**
 * UpcomingIrrigation Component
 * Highlights irrigation runs scheduled for Today or the upcoming 2–3 days.
 * 
 * @param {Object} props
 * @param {Array} props.schedules
 * @param {Function} props.onViewSchedule
 * @param {Object} [props.fieldsMap]
 */
export default function UpcomingIrrigation({
  schedules = [],
  onViewSchedule,
  fieldsMap = {},
}) {
  // Filter schedules that are Scheduled or In Progress, and date is Today (2026-10-03) or upcoming (>= 2026-10-03)
  const todayDateStr = '2026-10-03';
  const upcomingItems = schedules.filter((s) => {
    return (s.status === 'Scheduled' || s.status === 'In Progress') && s.scheduledDate >= todayDateStr;
  }).slice(0, 4); // Display up to 4 imminent runs

  if (upcomingItems.length === 0) {
    return (
      <div className="agri-upcoming-irrigation-section">
        <div className="agri-upcoming-header">
          <span className="agri-upcoming-title">
            <Droplets size={18} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
            Today & Upcoming Irrigation
          </span>
        </div>
        <div
          style={{
            background: '#ffffff',
            border: '1px dashed var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'center',
            color: 'var(--slate-500)',
            fontSize: '0.85rem',
          }}
        >
          No irrigation runs currently scheduled for today or upcoming days.
        </div>
      </div>
    );
  }

  return (
    <div className="agri-upcoming-irrigation-section" role="region" aria-label="Upcoming Irrigation Runs">
      <div className="agri-upcoming-header">
        <span className="agri-upcoming-title">
          <Droplets size={18} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
          Today & Upcoming Irrigation Schedule
        </span>
        <span style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 500 }}>
          {upcomingItems.length} imminent delivery cycle{upcomingItems.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="agri-upcoming-grid">
        {upcomingItems.map((item) => {
          const isToday = item.scheduledDate === todayDateStr;
          const fieldName = fieldsMap[item.fieldId]?.name || item.fieldId;

          return (
            <div
              key={item.id}
              className={`agri-upcoming-card ${isToday ? 'agri-upcoming-card--today' : ''}`}
            >
              {/* Top row: Field & Status */}
              <div className="agri-upcoming-card__top">
                <div>
                  <div className="agri-upcoming-card__field" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                    <span>{fieldName}</span>
                  </div>
                  <span className="agri-upcoming-card__crop">{item.cropName}</span>
                </div>
                <IrrigationStatusBadge status={item.status} />
              </div>

              {/* Timing */}
              <div className="agri-upcoming-card__time">
                <Calendar size={13} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                <span>{isToday ? 'Today' : item.scheduledDate}</span>
                <span>•</span>
                <Clock size={13} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                <span>{item.scheduledTime}</span>
              </div>

              {/* Method & Volume */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.2rem 0' }}>
                <IrrigationMethodPill method={item.irrigationMethod} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {(item.waterVolumeLitres / 1000).toFixed(1)}k L
                </span>
              </div>

              {/* Meta & View Action */}
              <div className="agri-upcoming-card__meta">
                <span>Duration: <strong>{item.durationMinutes} min</strong></span>
                <button
                  type="button"
                  onClick={() => onViewSchedule(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-600)',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                  aria-label={`View details for ${item.title}`}
                >
                  <Eye size={12} aria-hidden="true" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
