import { Link } from 'react-router-dom';
import { Droplets, CloudRain, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

/**
 * FarmAlerts Component
 * Renders operational alerts, advisories, and system notifications.
 * @param {Object} props
 * @param {Array} props.alerts
 */
export default function FarmAlerts({ alerts = [] }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return <Droplets size={16} className="text-info" aria-hidden="true" />;
      case 'weather':
        return <CloudRain size={16} className="text-warning" aria-hidden="true" />;
      case 'market':
        return <TrendingUp size={16} className="text-success" aria-hidden="true" />;
      default:
        return <Bell size={16} className="text-primary" aria-hidden="true" />;
    }
  };

  return (
    <Card
      title="Farm Alerts & Advisories"
      subtitle="Critical operational signals & weather advisories"
      action={
        <Link to="/recommendations" className="agri-card-action-link">
          <span>View advisories</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
      footer={
        <Link
          to="/notifications"
          className="agri-card-action-link"
          style={{ justifyContent: 'center', width: '100%', padding: '0.25rem 0', fontWeight: 600 }}
        >
          <span>Open Notification Center</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="agri-alert-item">
            <div className="agri-alert-item__icon">
              {getAlertIcon(alert.type)}
            </div>

            <div className="agri-alert-item__content">
              <div className="agri-alert-item__header">
                <span className="agri-alert-item__title">{alert.title}</span>
                <StatusBadge variant={alert.badgeVariant || 'neutral'}>
                  {alert.time}
                </StatusBadge>
              </div>
              <p className="agri-alert-item__msg">{alert.message}</p>
              <p className="agri-alert-item__meta">
                {alert.type === 'irrigation' ? (
                  <Link
                    to="/irrigation?fieldId=field-2b"
                    style={{ color: 'var(--primary-700)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {alert.field} • Open Schedule →
                  </Link>
                ) : (
                  alert.field
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
