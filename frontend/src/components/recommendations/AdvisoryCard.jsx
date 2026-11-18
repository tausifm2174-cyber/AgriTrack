import { useTranslation } from 'react-i18next';
import { CloudRain, AlertTriangle, CheckCircle, Droplets, Info, Check, EyeOff } from 'lucide-react';
import { StatusBadge, Button } from '../common';

/**
 * AdvisoryCard component
 * Displays "Current Farm Advisories" section evaluated against live backend advisory rules.
 */
export default function AdvisoryCard({
  advisories = [],
  farmName = '',
  onUpdateStatus,
}) {
  const { t } = useTranslation();

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
    <section className="agri-advisory-section" aria-label={t('recommendations.currentFarmAdvisories', 'Current Farm Advisories')}>
      <div className="agri-advisory-section__header">
        <div>
          <h2 className="agri-advisory-section__title">{t('recommendations.currentFarmAdvisories', 'Current Farm Advisories')}</h2>
          <p className="agri-advisory-section__subtitle">
            {t('recommendations.directivesGenerated', 'Rule-based operational directives generated from current micro-climate conditions')}{farmName ? ` at ${farmName}` : ''}
          </p>
        </div>
      </div>

      {advisories.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--slate-200)', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
          <CheckCircle size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--success-text)', display: 'block' }} aria-hidden="true" />
          <p>{t('advisories.noAdvisories', 'No active agronomic advisories for this holding.')}</p>
        </div>
      ) : (
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
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <StatusBadge variant={adv.severityVariant || 'warning'}>
                    {adv.severity}
                  </StatusBadge>
                  {adv.status && adv.status !== 'ACTIVE' && (
                    <StatusBadge variant="neutral">
                      {adv.status === 'ACKNOWLEDGED' ? t('advisories.acknowledged', 'Acknowledged') : t('advisories.dismissed', 'Dismissed')}
                    </StatusBadge>
                  )}
                </div>
              </div>

              <div className="agri-advisory-card__body">
                <div className="agri-advisory-card__row">
                  <span className="agri-advisory-card__label">{t('recommendations.triggerCondition', 'Trigger Condition')}:</span>
                  <span className="agri-advisory-card__val">{adv.triggerCondition}</span>
                </div>

                <div className="agri-advisory-card__action-box">
                  <span className="agri-advisory-card__action-label">{t('weather.recommendedAction', 'Recommended Action')}:</span>
                  <span className="agri-advisory-card__action-val">{adv.recommendedAction}</span>
                </div>
              </div>

              <div className="agri-advisory-card__footer">
                <div>
                  <span className="agri-advisory-card__farm">{adv.farmName || farmName}</span>
                  {adv.time && (
                    <span className="agri-advisory-card__time" style={{ marginLeft: '0.5rem' }}>{adv.time}</span>
                  )}
                </div>

                {onUpdateStatus && adv.status === 'ACTIVE' && (
                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Check size={13} aria-hidden="true" />}
                      onClick={() => onUpdateStatus(adv.id, 'ACKNOWLEDGED')}
                    >
                      {t('advisories.acknowledge', 'Acknowledge')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<EyeOff size={13} aria-hidden="true" />}
                      onClick={() => onUpdateStatus(adv.id, 'DISMISSED')}
                    >
                      {t('advisories.dismiss', 'Dismiss')}
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
