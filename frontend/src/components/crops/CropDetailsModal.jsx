import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Grid3X3,
  FlaskConical,
  Calendar,
  Clock,
  Info,
  PackageCheck,
  TrendingUp,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import CropLifecycleProgress from './CropLifecycleProgress';
import cropService from '../../services/cropService';
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
 * Displays full agronomic specifications, field ownership, 5-stage lifecycle history, milestones, and actions.
 *
 * @param {Object} props
 * @param {Object} props.crop - Crop cycle object
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onEdit - Callback to edit this crop
 * @param {Function} [props.onDelete] - Callback invoked when crop is deleted
 */
export default function CropDetailsModal({ crop, onClose, onEdit, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await cropService.deleteCropCycle(crop.id);
      onDelete?.(crop.id);
      onClose();
    } catch (err) {
      setDeleteError(err.message || t('common.error', 'Failed to delete crop cycle.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const farmDisplayName = crop.farmName || (crop.farmId ? t(`farms.demoNames.${crop.farmId}`, 'Farm Holding') : '');

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {crop.season && (
                <span className="agri-crop-card__season-badge">
                  {translateSeason(crop.season, t)} {t('crops.season', 'Season')}
                </span>
              )}
              <StatusBadge variant={crop.statusVariant || 'success'}>
                {translateStatus(crop.status, t)}
              </StatusBadge>
            </div>
            <h3 id="crop-modal-title" className="agri-modal-title">
              {translateCrop(crop.cropName, t)} {crop.variety ? `(${translateVariety(crop.variety, t)})` : ''}
            </h3>
            <p className="agri-modal-subtitle">
              {formatFieldName(crop.fieldName, t)} {farmDisplayName ? `• ${farmDisplayName}` : ''}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close crop details')}
            disabled={isDeleting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Delete Error Banner */}
          {deleteError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div
              style={{
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#be123c' }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('crops.deleteWarning', 'Are you sure you want to delete this crop cycle? This action cannot be undone.')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  icon={isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                >
                  {isDeleting ? t('crops.deleting', 'Deleting...') : t('crops.deleteCrop', 'Delete Crop Cycle')}
                </Button>
              </div>
            </div>
          )}

          {/* Lifecycle Progress Visual Section */}
          <div className="agri-detail-section">
            <div className="agri-detail-section-header">
              <h4 className="agri-detail-section-title">
                {t('crops.lifecycleProgress', '5-Stage Crop Lifecycle Progress')}
              </h4>
              <span className="agri-detail-section-subtitle">
                {t('crops.currentStage', 'Current Stage')}: <strong>{translateStage(crop.currentStage, t)}</strong>{crop.progressPercent != null ? ` (${crop.progressPercent}%)` : ''}
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
                <span className="agri-detail-value">{formatFieldName(crop.fieldName, t) || '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.farm', 'Farm Holding')}</span>
                <span className="agri-detail-value">{farmDisplayName || '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.area', 'Cultivated Area')}</span>
                <span className="agri-detail-value">{crop.areaAcres ? formatAcres(crop.areaAcres) : '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.soilType', 'Soil Type')}</span>
                <span className="agri-detail-value">{crop.soilType ? translateSoilType(crop.soilType, t) : '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('crops.sowingDate', 'Sowing Date')}</span>
                <span className="agri-detail-value">{crop.sowingDate || '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('crops.expectedHarvest', 'Expected Harvest')}</span>
                <span className="agri-detail-value">{crop.expectedHarvestDate || '—'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.irrigationSystem', 'Irrigation System')}</span>
                <span className="agri-detail-value">{crop.irrigationMethod ? translateIrrigationMethod(crop.irrigationMethod, t) : '—'}</span>
              </div>
              {crop.category ? (
                <div className="agri-detail-item">
                  <span className="agri-detail-label">{t('crops.variety', 'Crop Category')}</span>
                  <span className="agri-detail-value">{crop.category}</span>
                </div>
              ) : null}
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
            {!showDeleteConfirm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                icon={<Trash2 size={14} style={{ color: '#dc2626' }} />}
              >
                <span style={{ color: '#dc2626' }}>{t('common.delete', 'Delete')}</span>
              </Button>
            )}
            <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
              {t('common.close', 'Close')}
            </Button>
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onEdit(crop);
                }}
                disabled={isDeleting}
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
