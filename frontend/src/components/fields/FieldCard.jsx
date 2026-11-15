import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Droplets, FlaskConical, Eye, Sprout, Activity } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  translateStage,
  translateStatus,
  translateSoilType,
  translateIrrigationMethod,
  formatFieldName,
} from '../../utils/displayLabels';

/**
 * FieldCard component
 * Displays operational parcel metrics, standing crop, soil type, irrigation, and quick links.
 */
export default function FieldCard({ field, onViewDetails }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToSoil = () => {
    navigate(`/soil?fieldId=${encodeURIComponent(field.id)}`);
  };

  const handleGoToCrops = () => {
    navigate(`/crops?fieldId=${encodeURIComponent(field.id)}`);
  };

  return (
    <article className="agri-field-card" aria-labelledby={`field-title-${field.id}`}>
      {/* Header */}
      <div className="agri-field-card__header">
        <div className="agri-field-card__title-group">
          <h2 id={`field-title-${field.id}`} className="agri-field-card__name">
            {formatFieldName(field.name, t)}
          </h2>
          <span className="agri-field-card__farm-name">
            <Warehouse size={12} aria-hidden="true" />
            <span>{field.farmName || t(`farms.demoNames.${field.farmId}`, field.farmName) || 'Assigned Farm'}</span>
          </span>
        </div>
        <StatusBadge variant={field.healthVariant || 'success'}>
          {translateStatus(field.healthStatus, t)}
        </StatusBadge>
      </div>

      {/* Body */}
      <div className="agri-field-card__body">
        {/* Crop & Growth Stage Banner */}
        <div className="agri-field-card__crop-banner">
          {field.currentCrop ? (
            <>
              <div className="agri-field-card__crop-header">
                <span className="agri-field-card__crop-title">
                  <Sprout size={15} className="text-primary" aria-hidden="true" />
                  <span>
                    {translateCrop(field.currentCrop, t)}{' '}
                    {field.cropVariety ? `(${translateVariety(field.cropVariety, t)})` : ''}
                  </span>
                </span>
                <span className="agri-field-card__crop-season">{translateSeason(field.cropSeason, t)}</span>
              </div>

              <div className="agri-field-card__stage-row">
                <span>{t('crops.stage', 'Stage')}: <strong>{translateStage(field.cropStage, t)}</strong></span>
                <span>{field.cropProgress != null ? `${field.cropProgress}% ` : ''}{t('crops.cropCycle', 'Cycle')}</span>
              </div>

              <div className="agri-field-card__progress-bar">
                <div
                  className="agri-field-card__progress-fill"
                  style={{ width: `${field.cropProgress != null ? Math.min(100, Math.max(0, field.cropProgress)) : 0}%` }}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0' }}>
              <Sprout size={15} style={{ color: '#94a3b8' }} aria-hidden="true" />
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                {t('crops.noCropAssigned', 'No crop assigned')}
              </span>
            </div>
          )}
        </div>

        {/* Specs Grid */}
        <div className="agri-field-card__specs">
          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">{t('fields.area', 'Area')}</span>
            <span className="agri-field-card__spec-value">{formatAcres(field.areaAcres, t)}</span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">{t('fields.soilType', 'Soil Type')}</span>
            <span className="agri-field-card__spec-value">{translateSoilType(field.soilType, t)}</span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">{t('fields.irrigationSystem', 'Irrigation')}</span>
            <span className="agri-field-card__spec-value">
              <Droplets size={13} style={{ color: 'var(--info-text)' }} aria-hidden="true" />
              <span>{translateIrrigationMethod(field.irrigationMethod, t)}</span>
            </span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">{t('soil.moisture', 'Soil Moisture')}</span>
            <span className="agri-field-card__spec-value">{field.soilMoisture || '38%'}</span>
          </div>
        </div>

        {/* Last Activity */}
        {field.lastActivity && (
          <div className="agri-field-card__activity">
            <span className="agri-field-card__activity-label">{t('activities.title', 'Recent / Scheduled Activity')}</span>
            <span className="agri-field-card__activity-text">
              <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
              {field.lastActivity}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="agri-field-card__footer">
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={14} aria-hidden="true" />}
          onClick={() => onViewDetails(field)}
        >
          {t('common.details', 'Details')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={<Sprout size={14} aria-hidden="true" />}
          onClick={handleGoToCrops}
        >
          {t('navigation.crops', 'Crops')}
        </Button>

        <Button
          variant="outline"
          size="sm"
          icon={<FlaskConical size={14} aria-hidden="true" />}
          onClick={handleGoToSoil}
        >
          {t('navigation.soil', 'Soil Records')}
        </Button>
      </div>
    </article>
  );
}
