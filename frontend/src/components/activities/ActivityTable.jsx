import { useTranslation } from 'react-i18next';
import { Eye, Edit3, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../common';
import ActivityStatusBadge from './ActivityStatusBadge';
import ActivityTypePill from './ActivityTypePill';
import { translateCrop, formatFieldName } from '../../utils/displayLabels';

/**
 * ActivityTable Component
 * Responsive desktop/tablet table for displaying agricultural activities.
 */
export default function ActivityTable({
  activities,
  onViewActivity,
  onEditActivity,
  onDeleteActivity,
  farmsMap = {},
  fieldsMap = {},
}) {
  const { t } = useTranslation();

  return (
    <div className="agri-activity-table-container">
      <div className="agri-activity-table-scroll">
        <table className="agri-activity-table" aria-label={t('navigation.activities')}>
          <thead>
            <tr>
              <th>{t('navigation.activities')}</th>
              <th>{t('activities.activityType')}</th>
              <th>{t('navigation.farms')} & {t('navigation.fields')}</th>
              <th>{t('navigation.crops')}</th>
              <th>{t('common.date')} & {t('common.time')}</th>
              <th>{t('irrigation.duration')}</th>
              <th>{t('common.status')}</th>
              <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => {
              const rawFarmName = farmsMap[activity.farmId]?.name || activity.farmId;
              const farmName = t(`farms.demoNames.${activity.farmId}`, rawFarmName);
              const rawFieldName = fieldsMap[activity.fieldId]?.name || activity.fieldId;
              const fieldName = formatFieldName(rawFieldName, t);

              return (
                <tr key={activity.id}>
                  {/* Activity Title & ID */}
                  <td>
                    <div className="agri-activity-title-cell">
                      <span className="agri-activity-title-main">{activity.title}</span>
                      <span className="agri-activity-title-sub">{activity.id}</span>
                    </div>
                  </td>

                  {/* Activity Type */}
                  <td>
                    <ActivityTypePill type={activity.activityType} />
                  </td>

                  {/* Farm & Field */}
                  <td>
                    <div className="agri-activity-meta-cell">
                      <span className="agri-activity-meta-main" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} style={{ color: 'var(--slate-400)', flexShrink: 0 }} aria-hidden="true" />
                        {fieldName}
                      </span>
                      <span className="agri-activity-meta-sub" style={{ paddingLeft: '1rem' }}>
                        {farmName}
                      </span>
                    </div>
                  </td>

                  {/* Crop */}
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                      {activity.cropName ? translateCrop(activity.cropName, t) : '—'}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div className="agri-activity-meta-cell">
                      <span className="agri-activity-meta-main" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                        {activity.date}
                      </span>
                      {activity.time && (
                        <span className="agri-activity-meta-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={11} style={{ color: 'var(--slate-400)' }} aria-hidden="true" />
                          {activity.time}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td>
                    <span style={{ color: 'var(--slate-700)', fontSize: '0.8125rem' }}>
                      {activity.duration ? `${activity.duration} ${t('units.hours')}` : '—'}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <ActivityStatusBadge status={activity.status} />
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewActivity(activity)}
                        aria-label={`${t('common.viewDetails')}: ${activity.title}`}
                        title={t('common.viewDetails')}
                      >
                        <Eye size={13} aria-hidden="true" />
                        <span>{t('common.viewDetails')}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditActivity(activity)}
                        aria-label={`${t('common.edit')}: ${activity.title}`}
                        title={t('common.edit')}
                      >
                        <Edit3 size={13} aria-hidden="true" />
                        <span>{t('common.edit')}</span>
                      </Button>
                      {onDeleteActivity && (
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
                          onClick={() => onDeleteActivity(activity)}
                          aria-label={`${t('common.delete')}: ${activity.title}`}
                          title={t('common.delete')}
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
