import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, FlaskConical, Droplets, Sprout, Trash2, AlertTriangle, Loader2, Edit3 } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import fieldService from '../../services/fieldService';

/**
 * FieldDetailsModal component
 * Displays detailed agronomic information and specifications for a single plot.
 */
export default function FieldDetailsModal({ field, onClose, onDeleteField, onEditField }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await fieldService.deleteField(field.id);
      onDeleteField?.(field.id);
      onClose();
    } catch (err) {
      setDeleteError(err.message || t('common.error', 'Failed to delete field. Please try again.'));
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="agri-farm-card__code">{field.code}</span>
              <StatusBadge variant={field.healthVariant || 'success'}>
                {field.healthStatus || 'Active'}
              </StatusBadge>
            </div>
            <h3 id="field-modal-title" className="agri-modal-title">
              {field.name}
            </h3>
            <p className="agri-modal-subtitle">
              {t('fields.farm', 'Located in')} {field.farmName || 'Assigned Farm'}
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
                      'fields.deleteCascadeWarning',
                      'Deleting this field plot will permanently delete all associated soil test records. This action cannot be undone.'
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
                        <span>{t('common.delete', 'Yes, Delete Field')}</span>
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

          {/* Land & Soil Characteristics */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('soil.title', 'Plot Properties & Soil')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.area', 'Parcel Size')}</span>
                <span className="agri-detail-value">{formatAcres(field.areaAcres)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.soilType', 'Soil Classification')}</span>
                <span className="agri-detail-value">{field.soilType || 'Not specified'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('fields.irrigationSystem', 'Irrigation System')}</span>
                <span className="agri-detail-value">{field.irrigationMethod || 'Rainfed'}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('common.status', 'Status')}</span>
                <span className="agri-detail-value">{field.status || 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Cultivation Profile */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('crops.stage', 'Cultivation Status')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="agri-detail-label">{t('fields.currentCrop', 'Standing Crop')}</span>
                <span className="agri-detail-value">
                  {field.currentCrop ? (
                    `${field.currentCrop} ${field.cropVariety ? `(${field.cropVariety})` : ''}`
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      {t('crops.noCropAssigned', 'No crop assigned')}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {field.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">{t('common.notes', 'Agronomic Notes')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                {field.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
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
                <span>{t('common.delete', 'Delete Field')}</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
              {t('common.close', 'Close')}
            </Button>
            <Button
              variant="outline"
              icon={<Edit3 size={15} aria-hidden="true" />}
              onClick={() => onEditField?.(field)}
              disabled={isDeleting}
            >
              {t('common.edit', 'Edit')}
            </Button>
            <Button
              variant="outline"
              icon={<Droplets size={15} aria-hidden="true" />}
              onClick={handleGoToIrrigation}
              disabled={isDeleting}
            >
              {t('navigation.irrigation', 'Irrigation')}
            </Button>
            <Button
              variant="outline"
              icon={<Sprout size={15} aria-hidden="true" />}
              onClick={handleGoToCrops}
              disabled={isDeleting}
            >
              {t('navigation.crops', 'Crop Cycle')}
            </Button>
            <Button
              variant="primary"
              icon={<FlaskConical size={15} aria-hidden="true" />}
              onClick={handleGoToSoil}
              disabled={isDeleting}
            >
              {t('navigation.soil', 'Soil Records')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
