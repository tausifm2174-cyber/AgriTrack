import { useNavigate } from 'react-router-dom';
import { X, FlaskConical, Droplets, Sprout } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';

/**
 * FieldDetailsModal component
 * Displays detailed agronomic information and specifications for a single plot.
 */
export default function FieldDetailsModal({ field, onClose }) {
  const navigate = useNavigate();

  if (!field) return null;

  const handleGoToSoil = () => {
    onClose();
    navigate(`/soil?fieldId=${encodeURIComponent(field.id)}`);
  };

  const handleGoToCrops = () => {
    onClose();
    navigate(`/crops?fieldId=${encodeURIComponent(field.id)}`);
  };

  const handleGoToIrrigation = () => {
    onClose();
    navigate('/irrigation');
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="agri-farm-card__code">{field.code}</span>
              <StatusBadge variant={field.healthVariant || 'success'}>
                {field.healthStatus}
              </StatusBadge>
            </div>
            <h3 id="field-modal-title" className="agri-modal-title">
              {field.name}
            </h3>
            <p className="agri-modal-subtitle">
              Located in {field.farmName}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Crop Profile */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Cultivation Status</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Current Crop</span>
                <span className="agri-detail-value">
                  {field.currentCrop} {field.cropVariety ? `(${field.cropVariety})` : ''}
                </span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Crop Season</span>
                <span className="agri-detail-value">{field.cropSeason}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Growth Stage</span>
                <span className="agri-detail-value">{field.cropStage}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Crop Progress</span>
                <span className="agri-detail-value">{field.cropProgress}% Cycle Completed</span>
              </div>
            </div>
          </div>

          {/* Land & Soil Characteristics */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Soil & Moisture Properties</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Parcel Size</span>
                <span className="agri-detail-value">{formatAcres(field.areaAcres)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil Classification</span>
                <span className="agri-detail-value">{field.soilType}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil Moisture</span>
                <span className="agri-detail-value">{field.soilMoisture}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil pH & Nitrogen</span>
                <span className="agri-detail-value">{field.phLevel} pH • {field.nitrogenStatus}</span>
              </div>
            </div>
          </div>

          {/* Irrigation & Operations */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Irrigation & Management</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Irrigation System</span>
                <span className="agri-detail-value">{field.irrigationMethod}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Irrigation Status</span>
                <span className="agri-detail-value">{field.irrigationStatus}</span>
              </div>
              <div className="agri-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="agri-detail-label">Recent Operational Activity</span>
                <span className="agri-detail-value">{field.lastActivity} ({field.lastActivityDate})</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {field.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">Agronomic Notes</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                {field.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="agri-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            icon={<Droplets size={15} aria-hidden="true" />}
            onClick={handleGoToIrrigation}
          >
            Irrigation
          </Button>
          <Button
            variant="outline"
            icon={<Sprout size={15} aria-hidden="true" />}
            onClick={handleGoToCrops}
          >
            Crop Cycle
          </Button>
          <Button
            variant="primary"
            icon={<FlaskConical size={15} aria-hidden="true" />}
            onClick={handleGoToSoil}
          >
            Soil Records
          </Button>
        </div>
      </div>
    </div>
  );
}
