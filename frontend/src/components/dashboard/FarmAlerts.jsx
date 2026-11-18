import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Droplets, CloudRain, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { translateTime, formatFieldName } from '../../utils/displayLabels';

/**
 * FarmAlerts Component
 * Renders operational alerts, advisories, and system notifications.
 * @param {Object} props
 * @param {Array} props.alerts
 */
export default function FarmAlerts({ alerts = [] }) {
  const { t } = useTranslation();

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
      title={t('dashboard.farmAlerts', 'Farm Alerts & Advisories')}
      subtitle={t('dashboard.activeAlerts', 'Active Alerts')}
      action={
        <Link to="/recommendations" className="agri-card-action-link">
          <span>{t('navigation.recommendations', 'Recommendations')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
      footer={
        <Link
          to="/notifications"
          className="agri-card-action-link"
          style={{ justifyContent: 'center', width: '100%', padding: '0.25rem 0', fontWeight: 600 }}
        >
          <span>{t('topbar.notificationCenter', 'Open Notification Center')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-alerts-list">
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <Bell size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('dashboard.noAlerts', 'No active alerts or advisories.')}</p>
          </div>
        ) : (
          alerts.map((alert) => (
          <div key={alert.id} className="agri-alert-item">
            <div className="agri-alert-item__icon">
              {getAlertIcon(alert.type)}
            </div>

            <div className="agri-alert-item__content">
              <div className="agri-alert-item__header">
                <span className="agri-alert-item__title">
                  {t(`dashboard.alertsData.${alert.id}.title`, alert.title)}
                </span>
                <StatusBadge variant={alert.badgeVariant || 'neutral'}>
                  {translateTime(alert.time, t)}
                </StatusBadge>
              </div>
              <p className="agri-alert-item__msg">
                {t(`dashboard.alertsData.${alert.id}.message`, alert.message)}
              </p>
              <p className="agri-alert-item__meta">
                {alert.type === 'irrigation' ? (
                  <Link
                    to="/irrigation"
                    style={{ color: 'var(--primary-700)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {formatFieldName(alert.field, t)} • {t('dashboard.openSchedule', 'Open Schedule')} →
                  </Link>
                ) : (
                  formatFieldName(alert.field, t)
                )}
              </p>
            </div>
          </div>
        ))
        )}
      </div>
    </Card>
  );
}
