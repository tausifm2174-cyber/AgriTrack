import { CloudRain, AlertTriangle, CheckCircle, Droplets, Info } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * WeatherAlerts component
 * Renders rule-based agronomic alerts triggered by weather conditions.
 *
 * @param {Object} props
 * @param {Array} props.alerts - List of evaluated weather alerts
 * @param {string} [props.farmName] - Currently selected farm
 */
export default function WeatherAlerts({ alerts = [], farmName = 'Green Valley Farm' }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return <CloudRain size={20} className="text-warning" aria-hidden="true" />;
      case 'disease':
        return <AlertTriangle size={20} className="text-danger" aria-hidden="true" />;
      case 'spray':
        return <Droplets size={20} className="text-primary" aria-hidden="true" />;
      case 'normal':
        return <CheckCircle size={20} className="text-success" aria-hidden="true" />;
      default:
        return <Info size={20} className="text-info" aria-hidden="true" />;
    }
  };

  return (
    <section className="agri-weather-alerts-card" aria-label="Rule-Based Weather Advisories">
      <div className="agri-weather-alerts-card__header">
        <div className="agri-weather-alerts-card__title-group">
          <AlertTriangle size={18} className="text-warning" aria-hidden="true" />
          <h2 className="agri-weather-alerts-card__title">Rule-Based Weather Advisories</h2>
        </div>
        <span className="agri-weather-alerts-card__sub">
          Automated agronomic thresholds evaluated for {farmName}
        </span>
      </div>

      <div className="agri-weather-alerts-list">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className={`agri-weather-alert-item agri-weather-alert-item--${alert.severityVariant || 'warning'}`}
          >
            <div className="agri-weather-alert-item__icon-col">
              {getAlertIcon(alert.type)}
            </div>

            <div className="agri-weather-alert-item__main">
              <div className="agri-weather-alert-item__top">
                <h3 className="agri-weather-alert-item__title">{alert.title}</h3>
                <div className="agri-weather-alert-item__badge-wrap">
                  <StatusBadge variant={alert.severityVariant || 'warning'}>
                    {alert.severity}
                  </StatusBadge>
                  {alert.time && (
                    <span className="agri-weather-alert-item__time">{alert.time}</span>
                  )}
                </div>
              </div>

              <p className="agri-weather-alert-item__condition">
                <strong>Trigger:</strong> {alert.condition || alert.triggerCondition}
              </p>

              <div className="agri-weather-alert-item__recommendation">
                <span className="agri-weather-alert-item__recom-label">Recommended Action:</span>
                <span className="agri-weather-alert-item__recom-text">
                  {alert.recommendation || alert.recommendedAction}
                </span>
              </div>

              {alert.affectedFields && alert.affectedFields.length > 0 && (
                <div className="agri-weather-alert-item__fields">
                  <span className="text-muted">Target Parcels: </span>
                  {alert.affectedFields.map((f, i) => (
                    <span key={i} className="agri-weather-alert-item__field-pill">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
