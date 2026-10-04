import { Link } from 'react-router-dom';
import { Droplets, Sprout, Calendar, Clock, ArrowRight, BellRing } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

/**
 * ActivityList Component
 * Renders upcoming farm activities and the dedicated irrigation alert.
 * @param {Object} props
 * @param {Array} props.activities
 * @param {Array} props.irrigationAlerts
 */
export default function ActivityList({ activities = [], irrigationAlerts = [] }) {
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
      title="Upcoming Farm Activities & Irrigation Alerts"
      subtitle="Operational schedule for fields and zones"
      action={
        <Link to="/activities" className="agri-card-action-link">
          <span>View all activities</span>
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
              <span>Irrigation Alert — {primaryIrrigationAlert.field}</span>
              <StatusBadge variant="info">
                {primaryIrrigationAlert.status}
              </StatusBadge>
            </div>
            <p className="agri-irrigation-alert-box__text">
              {primaryIrrigationAlert.message}
            </p>
            <div className="agri-irrigation-alert-box__sub">
              <span>Trigger: Scheduled timer</span>
              {primaryIrrigationAlert.soilMoisture && (
                <span> • Soil moisture: {primaryIrrigationAlert.soilMoisture}</span>
              )}
              <span> • </span>
              <Link to="/irrigation?fieldId=field-2b" className="agri-card-action-link" style={{ fontSize: '0.725rem' }}>
                Open Irrigation Console
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="agri-activity-list">
        {activities.map((act) => (
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
                  {act.field} – {act.activity}
                </span>
                <StatusBadge variant={act.statusVariant || 'neutral'}>
                  {act.status}
                </StatusBadge>
              </div>

              <div className="agri-activity-meta">
                <span>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
                  {act.date}
                </span>
                <span>•</span>
                <span>
                  <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
                  {act.time}
                </span>
                <span>•</span>
                <span className="agri-badge agri-badge--neutral" style={{ fontSize: '0.7rem' }}>
                  {act.type === 'irrigation' ? 'Automated' : 'Manual Task'}
                </span>
              </div>

              {act.notes && (
                <div className="agri-activity-notes">{act.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
