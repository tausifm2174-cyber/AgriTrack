import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Award, CheckCircle2, AlertTriangle, Compass, Trash2, Loader2 } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button } from '../common';
import {
  formatFieldName,
  translateSoilType,
} from '../../utils/displayLabels';
import soilService from '../../services/soilService';

/**
 * SoilDetailsModal component
 * Displays full laboratory analysis, benchmark comparison, and agronomist recommendations.
 */
export default function SoilDetailsModal({ record, onClose, onDeleteRecord }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!record) return null;

  const handleGoToRecommendations = () => {
    onClose();
    navigate(`/recommendations?fieldId=${encodeURIComponent(record.fieldId)}&farmId=${encodeURIComponent(record.farmId)}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await soilService.deleteSoilRecord(record.id);
      onDeleteRecord?.(record.id);
      onClose();
    } catch (err) {
      setDeleteError(err.message || t('common.error', 'Failed to delete soil test record. Please try again.'));
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="soil-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
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
              {record.farmName || 'Farm Holding'} • {record.testDate}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close dialog')}
            disabled={isDeleting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Delete Warning / Confirm Box */}
          {showDeleteConfirm && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertTriangle size={20} className="text-danger" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#991b1b' }}>
                    {t('common.confirmDelete', 'Confirm Deletion')}
                  </h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#b91c1c', lineHeight: 1.4 }}>
                    {t(
                      'soil.deleteWarning',
                      'Are you sure you want to delete this soil laboratory test record? This action cannot be undone.'
                    )}
                  </p>
                  {deleteError && (
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>
                      {deleteError}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          <span>{t('common.deleting', 'Deleting...')}</span>
                        </>
                      ) : (
                        <span>{t('common.delete', 'Yes, Delete Record')}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t('common.cancel', 'Cancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lab Info Banner */}
          <div className="agri-demo-badge-banner" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} aria-hidden="true" />
              <span><strong>{t('soil.title', 'Testing Lab')}:</strong> {record.labName || 'Certified Soil Lab Analysis'}</span>
            </span>
          </div>

          {/* Primary Macronutrients */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.title', 'Macronutrient Profile (NPK)')}</h4>
            <div className="agri-detail-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.nitrogen', 'Nitrogen (N)')}</span>
                <span className="agri-detail-value">
                  {record.nitrogen != null ? `${record.nitrogen} kg/ha` : 'Not tested'}
                </span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.phosphorus', 'Phosphorus (P)')}</span>
                <span className="agri-detail-value">
                  {record.phosphorus != null ? `${record.phosphorus} kg/ha` : 'Not tested'}
                </span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.potassium', 'Potassium (K)')}</span>
                <span className="agri-detail-value">
                  {record.potassium != null ? `${record.potassium} kg/ha` : 'Not tested'}
                </span>
              </div>
            </div>
          </div>

          {/* Soil Physics & Chemistry */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.title', 'Chemical & Physical Properties')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.ph', 'Soil pH')}</span>
                <span className="agri-detail-value">{record.ph != null ? `${record.ph} (${record.phRating})` : 'Not tested'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.organicCarbon', 'Organic Matter')}</span>
                <span className="agri-detail-value">
                  {record.organicCarbon != null ? `${record.organicCarbon}%` : 'Not tested'}
                </span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('soil.moisture', 'Moisture Level')}</span>
                <span className="agri-detail-value">
                  {record.moisturePercent != null ? `${record.moisturePercent}%` : 'Not tested'}
                </span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.soilType', 'Soil Texture')}</span>
                <span className="agri-detail-value">{translateSoilType(record.soilType, t)}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {record.recommendations && (
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
          )}
        </div>

        {/* Footer */}
        <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <Trash2 size={16} />
                <span>{t('common.delete', 'Delete Record')}</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
              {t('common.close', 'Close Report')}
            </Button>
            <Button
              variant="primary"
              icon={<Compass size={15} aria-hidden="true" />}
              onClick={handleGoToRecommendations}
              disabled={isDeleting}
            >
              {t('navigation.recommendations', 'Crop Recommendations')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
