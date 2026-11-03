import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Award, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button } from '../common';
import {
  formatFieldName,
  translateSoilType,
  translateStatus,
} from '../../utils/displayLabels';

/**
 * SoilDetailsModal component
 * Displays full laboratory analysis, benchmark comparison, and agronomist recommendations.
 */
export default function SoilDetailsModal({ record, onClose }) {
  const { t } = useTranslation();
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
              {t('soil.soilReport', 'Soil Test Report')}: {formatFieldName(record.fieldName, t)}
            </h3>
            <p className="agri-modal-subtitle">
              {t(`farms.demoNames.${record.farmId}`, record.farmName)} • {record.testDate}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close dialog')}
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
              <span><strong>{t('soil.title', 'Testing Lab')}:</strong> {record.labName}</span>
            </span>
          </div>

          {/* Primary Macronutrients */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.nutrientBalance', 'Primary Macronutrients (NPK)')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.nitrogen', 'Available Nitrogen (N)')}</span>
                <span className="agri-detail-value">{record.nitrogen} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  {t('common.status', 'Rating')}: <strong>{translateStatus(record.nitrogenRating, t)}</strong>
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.phosphorus', 'Available Phosphorus (P)')}</span>
                <span className="agri-detail-value">{record.phosphorus} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  {t('common.status', 'Rating')}: <strong>{translateStatus(record.phosphorusRating, t)}</strong>
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.potassium', 'Available Potassium (K)')}</span>
                <span className="agri-detail-value">{record.potassium} kg/ha</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  {t('common.status', 'Rating')}: <strong>{translateStatus(record.potassiumRating, t)}</strong>
                </span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.organicCarbon', 'Organic Carbon (OC)')}</span>
                <span className="agri-detail-value">{record.organicCarbon}%</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  {t('common.status', 'Status')}: <strong>{translateStatus(record.organicCarbonRating, t)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Physical & Chemical Indicators */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.soilStatus', 'Physiochemical Properties')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.ph', 'Soil pH (Reaction)')}</span>
                <span className="agri-detail-value">{record.ph} ({translateStatus(record.phRating, t)})</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.electricalConductivity', 'Electrical Conductivity')}</span>
                <span className="agri-detail-value">{record.electricalConductivity} dS/m</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.moisture', 'Soil Moisture')}</span>
                <span className="agri-detail-value">{record.moisturePercent}%</span>
              </div>

              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.soilType', 'Soil Texture')}</span>
                <span className="agri-detail-value">{translateSoilType(record.soilType, t)}</span>
              </div>
            </div>
          </div>

          {/* Agronomist Recommendations */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.recommendations', 'Advisory & Nutrient Recommendations')}</h4>
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
            {t('common.close', 'Close Report')}
          </Button>
          <Button
            variant="primary"
            icon={<Compass size={15} aria-hidden="true" />}
            onClick={handleGoToRecommendations}
          >
            {t('navigation.recommendations', 'Crop Recommendations')}
          </Button>
        </div>
      </div>
    </div>
  );
}
