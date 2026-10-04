import { useNavigate } from 'react-router-dom';
import { X, Grid3X3, FlaskConical, Calendar, Clock, Info, PackageCheck, TrendingUp } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import CropLifecycleProgress from './CropLifecycleProgress';

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
              <span className="agri-crop-card__season-badge">{crop.season} Season</span>
              <StatusBadge variant={crop.statusVariant || 'success'}>
                {crop.status}
              </StatusBadge>
            </div>
            <h3 id="crop-modal-title" className="agri-modal-title">
              {crop.cropName} {crop.variety ? `(${crop.variety})` : ''}
            </h3>
            <p className="agri-modal-subtitle">
              Assigned to {crop.fieldName} • {crop.farmName}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close crop details"
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
                5-Stage Crop Lifecycle Progress
              </h4>
              <span className="agri-detail-section-subtitle">
                Current Stage: <strong>{crop.currentStage}</strong> ({crop.progressPercent}%)
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
            <h4 className="agri-detail-section-title">Cultivation & Field Specifications</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Field Plot</span>
                <span className="agri-detail-value">{crop.fieldName}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Farm Holding</span>
                <span className="agri-detail-value">{crop.farmName}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Cultivated Area</span>
                <span className="agri-detail-value">{formatAcres(crop.areaAcres)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil Type</span>
                <span className="agri-detail-value">{crop.soilType || 'Alluvial Loam'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Sowing Date</span>
                <span className="agri-detail-value">{crop.sowingDate}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Expected Harvest</span>
                <span className="agri-detail-value">{crop.expectedHarvestDate}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Irrigation System</span>
                <span className="agri-detail-value">{crop.irrigationMethod || 'Drip Irrigation'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Crop Category</span>
                <span className="agri-detail-value">{crop.category || 'Cereals & Grains'}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Milestone */}
          {crop.upcomingMilestone && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">Next Scheduled Milestone</h4>
              <div className="agri-milestone-banner">
                <Clock size={18} className="text-primary" aria-hidden="true" />
                <div className="agri-milestone-banner__text">
                  <span className="agri-milestone-banner__title">
                    {crop.upcomingMilestone}
                  </span>
                  {crop.upcomingMilestoneDate && (
                    <span className="agri-milestone-banner__date">
                      Scheduled Window: {crop.upcomingMilestoneDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Agronomic Notes */}
          {crop.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">Agronomic Field Notes</h4>
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
              Field Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FlaskConical size={14} aria-hidden="true" />}
              onClick={handleGoToSoil}
            >
              Soil Records
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Calendar size={14} aria-hidden="true" />}
              onClick={handleGoToCalendar}
            >
              Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<PackageCheck size={14} aria-hidden="true" />}
              onClick={handleGoToHarvests}
            >
              Harvests
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<TrendingUp size={14} aria-hidden="true" />}
              onClick={handleGoToMarketPrices}
            >
              Market Prices
            </Button>
          </div>

          <div className="agri-modal-footer__right">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onEdit(crop);
                }}
              >
                Edit Crop
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
