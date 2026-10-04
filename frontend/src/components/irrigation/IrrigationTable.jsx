import { Eye, Edit3, Trash2, Calendar, Clock, MapPin, Ban } from 'lucide-react';
import { Button } from '../common';
import IrrigationStatusBadge from './IrrigationStatusBadge';
import IrrigationMethodPill from './IrrigationMethodPill';

/**
 * IrrigationTable Component
 * Responsive desktop/tablet table for displaying irrigation schedules.
 * 
 * @param {Object} props
 * @param {Array} props.schedules
 * @param {Function} props.onViewSchedule
 * @param {Function} props.onEditSchedule
 * @param {Function} [props.onDeleteSchedule]
 * @param {Function} [props.onCancelSchedule]
 * @param {Object} [props.farmsMap]
 * @param {Object} [props.fieldsMap]
 */
export default function IrrigationTable({
  schedules,
  onViewSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onCancelSchedule,
  farmsMap = {},
  fieldsMap = {},
}) {
  return (
    <div className="agri-irrigation-table-container">
      <div className="agri-irrigation-table-scroll">
        <table className="agri-irrigation-table" aria-label="Irrigation Schedules">
          <thead>
            <tr>
              <th>Schedule</th>
              <th>Farm / Field</th>
              <th>Crop</th>
              <th>Date & Time</th>
              <th>Method</th>
              <th>Duration</th>
              <th>Water Volume</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => {
              const farmName = farmsMap[schedule.farmId]?.name || schedule.farmId;
              const fieldName = fieldsMap[schedule.fieldId]?.name || schedule.fieldId;
              const isScheduled = schedule.status === 'Scheduled';

              return (
                <tr key={schedule.id}>
                  {/* Schedule Title & ID */}
                  <td>
                    <div className="agri-irrigation-title-cell">
                      <span className="agri-irrigation-title-main">{schedule.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <span className="agri-irrigation-title-sub">{schedule.id}</span>
                        {schedule.priority && (
                          <span
                            className={`agri-priority-pill agri-priority-pill--${schedule.priority.toLowerCase()}`}
                          >
                            {schedule.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Farm & Field */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: 'var(--slate-800)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <MapPin size={12} style={{ color: 'var(--slate-400)', flexShrink: 0 }} aria-hidden="true" />
                        {fieldName}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', paddingLeft: '1rem' }}>
                        {farmName}
                      </span>
                    </div>
                  </td>

                  {/* Crop */}
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                      {schedule.cropName || '—'}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontWeight: 500,
                          color: 'var(--slate-800)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Calendar size={13} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                        {schedule.scheduledDate}
                      </span>
                      {schedule.scheduledTime && (
                        <span
                          style={{
                            fontSize: '0.725rem',
                            color: 'var(--slate-500)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Clock size={11} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                          {schedule.scheduledTime}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Method */}
                  <td>
                    <IrrigationMethodPill method={schedule.irrigationMethod} />
                  </td>

                  {/* Duration */}
                  <td>
                    <span style={{ color: 'var(--slate-700)', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {schedule.durationMinutes ? `${schedule.durationMinutes} min` : '—'}
                    </span>
                  </td>

                  {/* Water Volume */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {schedule.waterVolumeLitres ? `${schedule.waterVolumeLitres.toLocaleString()} L` : '—'}
                      </span>
                      {schedule.waterVolumeLitres && (
                        <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
                          {(schedule.waterVolumeLitres / 1000).toFixed(1)} m³
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <IrrigationStatusBadge status={schedule.status} />
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSchedule(schedule)}
                        aria-label={`View details for ${schedule.title}`}
                        title="View details"
                      >
                        <Eye size={13} aria-hidden="true" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSchedule(schedule)}
                        aria-label={`Edit ${schedule.title}`}
                        title="Edit schedule"
                      >
                        <Edit3 size={13} aria-hidden="true" />
                        <span>Edit</span>
                      </Button>

                      {isScheduled && onCancelSchedule && (
                        <button
                          type="button"
                          className="agri-btn-icon"
                          style={{
                            width: '28px',
                            height: '28px',
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
                          aria-label={`Cancel schedule for ${schedule.title}`}
                          title="Cancel scheduled run"
                        >
                          <Ban size={13} aria-hidden="true" />
                        </button>
                      )}

                      {onDeleteSchedule && (
                        <button
                          type="button"
                          className="agri-btn-icon agri-btn-icon--danger"
                          style={{
                            width: '28px',
                            height: '28px',
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
                          aria-label={`Delete ${schedule.title}`}
                          title="Delete schedule"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
