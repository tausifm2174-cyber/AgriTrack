import { CloudRain, AlertTriangle, CheckCircle, Droplets, Info } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * AdvisoryCard component
 * Displays "Current Farm Advisories" section evaluated against local weather demo rules.
 *
 * @param {Object} props
 * @param {Array} props.advisories - List of active advisories
 * @param {string} [props.farmName] - Target farm holding
 */
export default function AdvisoryCard({ advisories = [], farmName = 'Green Valley Farm' }) {
  const getIcon = (type) => {
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
    <section className="agri-advisory-section" aria-label="Current Farm Advisories">
      <div className="agri-advisory-section__header">
        <div>
          <h2 className="agri-advisory-section__title">Current Farm Advisories</h2>
          <p className="agri-advisory-section__subtitle">
            Rule-based operational directives generated from current micro-climate conditions at {farmName}
          </p>
        </div>
      </div>

      <div className="agri-advisory-grid">
        {advisories.map((adv) => (
          <article
            key={adv.id}
            className={`agri-advisory-card agri-advisory-card--${adv.severityVariant || 'warning'}`}
          >
            <div className="agri-advisory-card__header">
              <div className="agri-advisory-card__icon-box">
                {getIcon(adv.type)}
              </div>
              <div className="agri-advisory-card__title-box">
                <span className="agri-advisory-card__category">{adv.category}</span>
                <h3 className="agri-advisory-card__title">{adv.title}</h3>
              </div>
              <StatusBadge variant={adv.severityVariant || 'warning'}>
                {adv.severity}
              </StatusBadge>
            </div>

            <div className="agri-advisory-card__body">
              <div className="agri-advisory-card__row">
                <span className="agri-advisory-card__label">Trigger Condition:</span>
                <span className="agri-advisory-card__val">{adv.triggerCondition}</span>
              </div>

              <div className="agri-advisory-card__action-box">
                <span className="agri-advisory-card__action-label">Recommended Action:</span>
                <span className="agri-advisory-card__action-val">{adv.recommendedAction}</span>
              </div>
            </div>

            <div className="agri-advisory-card__footer">
              <span className="agri-advisory-card__farm">{adv.farmName || farmName}</span>
              {adv.time && (
                <span className="agri-advisory-card__time">{adv.time}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
