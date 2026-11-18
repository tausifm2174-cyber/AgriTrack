import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Droplets, Sprout, Calendar, Clock, ArrowRight, BellRing } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { translateStatus, translateTime, formatFieldName } from '../../utils/displayLabels';

/**
 * ActivityList Component
 * Renders upcoming farm activities and the dedicated irrigation alert.
 * @param {Object} props
 * @param {Array} props.activities
 * @param {Array} props.irrigationAlerts
 */
export default function ActivityList({ activities = [], irrigationAlerts = [] }) {
  const { t } = useTranslation();

  const getIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return <Droplets size={18} aria-hidden="true" />;
      case 'fertilizer':
      default:
        return <Sprout size={18} aria-hidden="true" />;
    }
  };

  const primaryIrrigationAlert = irrigationAlerts[0];

  return (
    <Card
      title={t('dashboard.upcomingActivities', 'Upcoming Field Activities')}
      subtitle={t('cropCalendar.timeline', 'Operational schedule for fields and zones')}
      action={
        <Link to="/activities" className="agri-card-action-link">
          <span>{t('dashboard.viewAllActivities', 'View All Activities')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      {/* Section 9: Dedicated Irrigation Alert Callout */}
      {primaryIrrigationAlert && (
        <div className="agri-irrigation-alert-box" role="alert">
          <BellRing size={20} className="agri-irrigation-alert-box__icon" aria-hidden="true" />
          <div className="agri-irrigation-alert-box__content">
            <div className="agri-irrigation-alert-box__heading">
              <span>{t('irrigation.advisory', 'Irrigation Alert')} — {formatFieldName(primaryIrrigationAlert.field, t)}</span>
              <StatusBadge variant="info">
                {translateStatus(primaryIrrigationAlert.status, t)}
              </StatusBadge>
            </div>
            <p className="agri-irrigation-alert-box__text">
              {t('dashboard.irrigationAlertMsg', primaryIrrigationAlert.message)}
            </p>
            <div className="agri-irrigation-alert-box__sub">
              <span>{t('status.scheduled', 'Scheduled')}</span>
              {primaryIrrigationAlert.soilMoisture && (
                <span> • {t('soil.title', 'Soil')}: {primaryIrrigationAlert.soilMoisture}</span>
              )}
              <span> • </span>
              <Link to={primaryIrrigationAlert.fieldId ? `/irrigation?fieldId=${primaryIrrigationAlert.fieldId}` : '/irrigation'} className="agri-card-action-link" style={{ fontSize: '0.725rem' }}>
                {t('irrigation.title', 'Irrigation Management')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="agri-activity-list">
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <Calendar size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('dashboard.noActivities', 'No upcoming activities scheduled.')}</p>
          </div>
        ) : (
          activities.map((act) => (
          <div key={act.id} className="agri-activity-item">
            <div
              className={`agri-activity-icon ${
                act.type === 'irrigation' ? 'agri-activity-icon--irrigation' : ''
              }`}
            >
              {getIcon(act.type)}
            </div>

            <div className="agri-activity-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="agri-activity-title">
                  {formatFieldName(act.field, t)} – {t(`dashboard.activityItems.${act.id}.name`, act.activity)}
                </span>
                <StatusBadge variant={act.statusVariant || 'neutral'}>
                  {translateStatus(act.status, t)}
                </StatusBadge>
              </div>

              <div className="agri-activity-meta">
                <span>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
                  {translateTime(act.date, t)}
                </span>
                <span>•</span>
                <span>
                  <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
                  {act.time}
                </span>
                <span>•</span>
                <span className="agri-badge agri-badge--neutral" style={{ fontSize: '0.7rem' }}>
                  {act.type === 'irrigation' ? t('irrigation.automated', 'Automated') : t('activities.manualTask', 'Manual Task')}
                </span>
              </div>

              {act.notes && (
                <div className="agri-activity-notes">
                  {t(`dashboard.activityItems.${act.id}.notes`, act.notes)}
                </div>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </Card>
  );
}
