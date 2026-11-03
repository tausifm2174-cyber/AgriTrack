import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Grid3X3, FlaskConical, Calendar, Clock, Info, PackageCheck, TrendingUp } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import CropLifecycleProgress from './CropLifecycleProgress';
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
 * CropDetailsModal component
 * Displays full agronomic specifications, field ownership, 5-stage lifecycle history, and milestones.
 *
 * @param {Object} props
 * @param {Object} props.crop - Crop cycle object
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onEdit - Callback to edit this crop
 */
export default function CropDetailsModal({ crop, onClose, onEdit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!crop) return null;

  const handleGoToField = () => {
    onClose();
    navigate('/fields');
  };

  const handleGoToSoil = () => {
    onClose();
    navigate(`/soil?fieldId=${encodeURIComponent(crop.fieldId)}`);
  };

  const handleGoToCalendar = () => {
    onClose();
    navigate(`/crop-calendar?crop=${encodeURIComponent(crop.cropName)}`);
  };

  const handleGoToHarvests = () => {
    onClose();
    navigate(`/harvests?crop=${encodeURIComponent(crop.cropName)}`);
  };

  const handleGoToMarketPrices = () => {
    onClose();
    navigate(`/market-prices?crop=${encodeURIComponent(crop.cropName)}`);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="agri-crop-card__season-badge">{translateSeason(crop.season, t)} {t('crops.season', 'Season')}</span>
              <StatusBadge variant={crop.statusVariant || 'success'}>
                {translateStatus(crop.status, t)}
              </StatusBadge>
            </div>
            <h3 id="crop-modal-title" className="agri-modal-title">
              {translateCrop(crop.cropName, t)} {crop.variety ? `(${translateVariety(crop.variety, t)})` : ''}
            </h3>
            <p className="agri-modal-subtitle">
              {formatFieldName(crop.fieldName, t)} • {t(`farms.demoNames.${crop.farmId}`, crop.farmName)}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close crop details')}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Lifecycle Progress Visual Section */}
          <div className="agri-detail-section">
            <div className="agri-detail-section-header">
              <h4 className="agri-detail-section-title">
                {t('crops.lifecycleProgress', '5-Stage Crop Lifecycle Progress')}
              </h4>
              <span className="agri-detail-section-subtitle">
                {t('crops.currentStage', 'Current Stage')}: <strong>{translateStage(crop.currentStage, t)}</strong> ({crop.progressPercent}%)
              </span>
            </div>

            <div className="agri-modal-lifecycle-box">
              <CropLifecycleProgress
                currentStage={crop.currentStage}
                progressPercent={crop.progressPercent}
                stageHistory={crop.stageHistory}
                sowingDate={crop.sowingDate}
                expectedHarvestDate={crop.expectedHarvestDate}
                compact={false}
              />
            </div>
          </div>

          {/* Agronomic & Field Specifications */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('crops.cropDetails', 'Cultivation & Field Specifications')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.fieldName', 'Field Plot')}</span>
                <span className="agri-detail-value">{formatFieldName(crop.fieldName, t)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.farm', 'Farm Holding')}</span>
                <span className="agri-detail-value">{t(`farms.demoNames.${crop.farmId}`, crop.farmName)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.area', 'Cultivated Area')}</span>
                <span className="agri-detail-value">{formatAcres(crop.areaAcres)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.soilType', 'Soil Type')}</span>
                <span className="agri-detail-value">{translateSoilType(crop.soilType, t)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('crops.sowingDate', 'Sowing Date')}</span>
                <span className="agri-detail-value">{crop.sowingDate}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('crops.expectedHarvest', 'Expected Harvest')}</span>
                <span className="agri-detail-value">{crop.expectedHarvestDate}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.irrigationSystem', 'Irrigation System')}</span>
                <span className="agri-detail-value">{translateIrrigationMethod(crop.irrigationMethod, t)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('crops.variety', 'Crop Category')}</span>
                <span className="agri-detail-value">{crop.category || 'Cereals & Grains'}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Milestone */}
          {crop.upcomingMilestone && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">{t('cropCalendar.milestoneName', 'Next Scheduled Milestone')}</h4>
              <div className="agri-milestone-banner">
                <Clock size={18} className="text-primary" aria-hidden="true" />
                <div className="agri-milestone-banner__text">
                  <span className="agri-milestone-banner__title">
                    {crop.upcomingMilestone}
                  </span>
                  {crop.upcomingMilestoneDate && (
                    <span className="agri-milestone-banner__date">
                      {crop.upcomingMilestoneDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Agronomic Notes */}
          {crop.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">{t('common.notes', 'Agronomic Field Notes')}</h4>
              <div className="agri-notes-box">
                <Info size={16} aria-hidden="true" />
                <p>{crop.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="agri-modal-footer">
          <div className="agri-modal-footer__left">
            <Button
              variant="outline"
              size="sm"
              icon={<Grid3X3 size={14} aria-hidden="true" />}
              onClick={handleGoToField}
            >
              {t('fields.fieldDetails', 'Field Details')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FlaskConical size={14} aria-hidden="true" />}
              onClick={handleGoToSoil}
            >
              {t('navigation.soil', 'Soil Records')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Calendar size={14} aria-hidden="true" />}
              onClick={handleGoToCalendar}
            >
              {t('cropCalendar.title', 'Calendar')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<PackageCheck size={14} aria-hidden="true" />}
              onClick={handleGoToHarvests}
            >
              {t('navigation.harvests', 'Harvests')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<TrendingUp size={14} aria-hidden="true" />}
              onClick={handleGoToMarketPrices}
            >
              {t('navigation.marketPrices', 'Market Prices')}
            </Button>
          </div>

          <div className="agri-modal-footer__right">
            <Button variant="secondary" onClick={onClose}>
              {t('common.close', 'Close')}
            </Button>
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onEdit(crop);
                }}
              >
                {t('common.edit', 'Edit Crop')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
