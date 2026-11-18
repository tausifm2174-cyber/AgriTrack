import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  translateStage,
  translateStatus,
  formatFieldName,
} from '../../utils/displayLabels';

/**
 * CropSummary Component
 * Shows currently standing active crops across farm holdings.
 * @param {Object} props
 * @param {Array} props.crops
 */
export default function CropSummary({ crops = [] }) {
  const { t } = useTranslation();

  return (
    <Card
      title={t('dashboard.activeCrops', 'Active Crops')}
      subtitle={t('crops.subtitle', 'Standing crop cycles and development stages')}
      action={
        <Link to="/crops" className="agri-card-action-link">
          <span>{t('navigation.crops', 'Manage Crops')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-crops-list">
        {crops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <Sprout size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('dashboard.noCrops', 'No active crop cycles currently recorded.')}</p>
          </div>
        ) : (
          crops.map((crop) => (
          <div key={crop.id} className="agri-crop-card">
            <div className="agri-crop-card__top">
              <span className="agri-crop-card__name">
                <Sprout size={16} className="text-primary" aria-hidden="true" />
                <span>
                  {translateCrop(crop.name, t)} ({translateVariety(crop.variety, t)})
                </span>
              </span>
              <StatusBadge
                variant={crop.healthStatus === 'Optimal' ? 'success' : 'info'}
              >
                {translateStatus(crop.healthStatus, t)}
              </StatusBadge>
            </div>

            <div className="agri-crop-card__meta-grid">
              <div>
                <span className="text-muted">{t('crops.season', 'Season')}: </span>
                <strong>{translateSeason(crop.season, t)}</strong>
              </div>
              <div>
                <span className="text-muted">{t('fields.farm', 'Field')}: </span>
                <strong>{formatFieldName(crop.field, t)}</strong>
              </div>
              <div>
                <span className="text-muted">{t('crops.currentStage', 'Stage')}: </span>
                <strong>{translateStage(crop.stage, t)}</strong>
              </div>
              <div>
                <span className="text-muted">{t('common.area', 'Area')}: </span>
                <strong>{crop.areaAcres} {t('units.acres', 'Acres')}</strong>
              </div>
            </div>

            <div className="agri-crop-card__progress" title={`${t('crops.lifecycleProgress', 'Growth progress')}: ${crop.progressPercent}%`}>
              <div
                className="agri-crop-card__progress-bar"
                style={{ width: `${crop.progressPercent}%` }}
              />
            </div>
          </div>
        ))
        )}
      </div>
    </Card>
  );
}
