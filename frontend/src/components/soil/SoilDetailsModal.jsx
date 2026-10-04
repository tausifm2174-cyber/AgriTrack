import { useNavigate } from 'react-router-dom';
import { X, Award, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button } from '../common';

/**
 * SoilDetailsModal component
 * Displays full laboratory analysis, benchmark comparison, and agronomist recommendations.
 */
export default function SoilDetailsModal({ record, onClose }) {
  const navigate = useNavigate();

  if (!record) return null;

  const handleGoToRecommendations = () => {
    onClose();
    navigate(`/recommendations?fieldId=${encodeURIComponent(record.fieldId)}&farmId=${encodeURIComponent(record.farmId)}`);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="soil-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="agri-farm-card__code">{record.sampleId || 'SOIL-TEST'}</span>
              <SoilStatus status={record.status} variant={record.statusVariant} />
            </div>
            <h3 id="soil-modal-title" className="agri-modal-title">
              Soil Test Report: {record.fieldName}
            </h3>
            <p className="agri-modal-subtitle">
              {record.farmName} • Tested on {record.testDate} ({record.testedDaysAgo})
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
          {/* Lab Info Banner */}
          <div className="agri-demo-badge-banner" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} aria-hidden="true" />
              <span><strong>Testing Lab:</strong> {record.labName}</span>
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
              Accredited Demo Analysis
            </span>
          </div>

          {/* Primary Macronutrients */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Primary Macronutrients (NPK)</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Available Nitrogen (N)</span>
                <span className="agri-detail-value">{record.nitrogen} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Rating: <strong>{record.nitrogenRating}</strong> (Ideal: {record.nitrogenBenchmark})
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Available Phosphorus (P)</span>
                <span className="agri-detail-value">{record.phosphorus} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Rating: <strong>{record.phosphorusRating}</strong> (Ideal: {record.phosphorusBenchmark})
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Available Potassium (K)</span>
                <span className="agri-detail-value">{record.potassium} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Rating: <strong>{record.potassiumRating}</strong> (Ideal: {record.potassiumBenchmark})
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Organic Carbon (OC)</span>
                <span className="agri-detail-value">{record.organicCarbon}%</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Status: <strong>{record.organicCarbonRating}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Physical & Chemical Indicators */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Physiochemical Properties</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil pH (Reaction)</span>
                <span className="agri-detail-value">{record.ph} ({record.phRating})</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Electrical Conductivity</span>
                <span className="agri-detail-value">{record.electricalConductivity} dS/m (Normal)</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil Moisture</span>
                <span className="agri-detail-value">{record.moisturePercent}% ({record.moistureRating})</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">Soil Texture</span>
                <span className="agri-detail-value">{record.soilType}</span>
              </div>
            </div>
          </div>

          {/* Agronomist Recommendations */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">Advisory & Nutrient Recommendations</h4>
            <div
              style={{
                backgroundColor: record.status === 'Needs Attention' ? 'var(--danger-bg)' : 'var(--slate-50)',
                border: `1px solid ${record.status === 'Needs Attention' ? 'var(--danger-border)' : 'var(--slate-200)'}`,
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                {record.status === 'Needs Attention' ? (
                  <AlertTriangle size={18} className="text-danger" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={18} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                )}
                <p style={{ fontSize: '0.85rem', color: record.status === 'Needs Attention' ? 'var(--danger-text)' : 'var(--slate-800)', margin: 0, lineHeight: 1.5 }}>
                  {record.recommendations}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="agri-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close Report
          </Button>
          <Button
            variant="primary"
            icon={<Compass size={15} aria-hidden="true" />}
            onClick={handleGoToRecommendations}
          >
            Crop Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}
