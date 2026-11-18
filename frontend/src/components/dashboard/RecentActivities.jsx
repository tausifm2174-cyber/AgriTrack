import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical,
  Droplets,
  Sprout,
  CreditCard,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Card from '../common/Card';
import { translateTime, formatFieldName } from '../../utils/displayLabels';

/**
 * RecentActivities Component
 * Renders the compact chronological farm timeline.
 * @param {Object} props
 * @param {Array} props.activities
 */
export default function RecentActivities({ activities = [] }) {
  const { t } = useTranslation();

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'soil':
        return <FlaskConical size={14} aria-hidden="true" />;
      case 'irrigation':
        return <Droplets size={14} aria-hidden="true" />;
      case 'crop':
        return <Sprout size={14} aria-hidden="true" />;
      case 'expense':
        return <CreditCard size={14} aria-hidden="true" />;
      default:
        return <Clock size={14} aria-hidden="true" />;
    }
  };

  return (
    <Card
      title={t('dashboard.recentActivities', 'Recent Farm Activities')}
      subtitle={t('activities.subtitle', 'Latest log entries across your holdings')}
      action={
        <Link to="/activities" className="agri-card-action-link">
          <span>{t('dashboard.viewAllActivities', 'Full activity log')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-recent-timeline">
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <Clock size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('dashboard.noActivities', 'No recent farm activity logs recorded.')}</p>
          </div>
        ) : (
          activities.map((item, idx) => (
          <div key={item.id || idx} className="agri-timeline-node">
            <div
              className={`agri-timeline-bullet ${
                idx === 0 ? 'agri-timeline-bullet--primary' : ''
              }`}
            >
              {getTimelineIcon(item.type)}
            </div>

            <div className="agri-timeline-body">
              <span className="agri-timeline-title">
                {t(`dashboard.recentActivitiesData.${item.id}.title`, item.title)}
              </span>
              <div className="agri-timeline-meta">
                <strong>{formatFieldName(item.field, t)}</strong>
                <span> • </span>
                <span>{translateTime(item.timestamp || item.time, t)}</span>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </Card>
  );
}
