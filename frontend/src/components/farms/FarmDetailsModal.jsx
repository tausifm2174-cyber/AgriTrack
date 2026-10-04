import { useNavigate } from 'react-router-dom';
import { X, Grid3X3 } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmDetailsModal component
 * Modal showing comprehensive breakdown of a farm holding.
 */
export default function FarmDetailsModal({ farm, onClose }) {
  const navigate = useNavigate();

  if (!farm) return null;

  const handleGoToFields = () => {
    onClose();
    navigate(`/fields?farmId=${encodeURIComponent(farm.id)}`);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="agri-farm-card__code">{farm.code}</span>
              <StatusBadge variant={farm.statusVariant || 'success'}>{farm.status}</StatusBadge>
            </div>
            <h3 id="farm-modal-title" className="agri-modal-title">
              {farm.name}
            </h3>
            <p className="agri-modal-subtitle">Operational Holding Specifications</p>
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
          {/* General Specs */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Property Information</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Location</span>
                <span className="agri-detail-value">{farm.location}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">District & State</span>
                <span className="agri-detail-value">{farm.district}, {farm.state}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Total Area</span>
                <span className="agri-detail-value">{formatAcres(farm.areaAcres)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Total Fields</span>
                <span className="agri-detail-value">{farm.fieldsCount} Mapped Plots</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Established Year</span>
                <span className="agri-detail-value">{farm.establishedYear || '2019'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">Registered Farmer / Owner</span>
                <span className="agri-detail-value">{farm.owner || 'XYZ (Farmer)'}</span>
              </div>
            </div>
          </div>

          {/* Agronomy & Water */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Agronomy & Infrastructure</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="agri-detail-label">Soil Profile</span>
                <span className="agri-detail-value">{farm.soilSummary}</span>
              </div>
              <div className="agri-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="agri-detail-label">Irrigation Network</span>
                <span className="agri-detail-value">{farm.irrigationSummary}</span>
              </div>
              <div className="agri-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="agri-detail-label">Primary Water Source</span>
                <span className="agri-detail-value">{farm.waterSource}</span>
              </div>
            </div>
          </div>

          {/* Primary Crops */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Cultivated Crops</h4>
            <div className="agri-farm-card__crops-pills">
              {farm.primaryCrops.map((crop, idx) => (
                <span key={idx} className="agri-farm-card__crop-pill">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Operational Notes */}
          {farm.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">Operational Notes</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                {farm.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="agri-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={<Grid3X3 size={15} aria-hidden="true" />}
            onClick={handleGoToFields}
          >
            View {farm.fieldsCount} Fields
          </Button>
        </div>
      </div>
    </div>
  );
}
