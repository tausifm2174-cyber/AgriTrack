import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Droplets,
  Sprout,
  CreditCard,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Card from '../common/Card';

/**
 * RecentActivities Component
 * Renders the compact chronological farm timeline.
 * @param {Object} props
 * @param {Array} props.activities
 */
export default function RecentActivities({ activities = [] }) {
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
      title="Recent Farm Activities"
      subtitle="Latest log entries across your holdings"
      action={
        <Link to="/activities" className="agri-card-action-link">
          <span>Full activity log</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-recent-timeline">
        {activities.map((item, idx) => (
          <div key={item.id || idx} className="agri-timeline-node">
            <div
              className={`agri-timeline-bullet ${
                idx === 0 ? 'agri-timeline-bullet--primary' : ''
              }`}
            >
              {getTimelineIcon(item.type)}
            </div>

            <div className="agri-timeline-body">
              <span className="agri-timeline-title">{item.title}</span>
              <div className="agri-timeline-meta">
                <strong>{item.field}</strong>
                <span> • </span>
                <span>{item.timestamp || item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
