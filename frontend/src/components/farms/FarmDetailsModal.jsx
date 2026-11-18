import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Grid3X3, Trash2, AlertTriangle, Loader2, Edit3 } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import farmService from '../../services/farmService';

/**
 * FarmDetailsModal component
 * Modal showing comprehensive breakdown of a farm holding with live actions.
 */
export default function FarmDetailsModal({ farm, onClose, onDeleteFarm, onEditFarm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!farm) return null;

  const handleGoToFields = () => {
    onClose();
    navigate(`/fields?farmId=${encodeURIComponent(farm.id)}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await farmService.deleteFarm(farm.id);
      onDeleteFarm?.(farm.id);
      onClose();
    } catch (err) {
      setDeleteError(err.message || t('common.error', 'Failed to delete farm. Please try again.'));
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
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
            <p className="agri-modal-subtitle">{t('farms.farmDetails', 'Operational Holding Specifications')}</p>
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
                      'farms.deleteCascadeWarning',
                      'Deleting this farm holding will permanently delete all associated fields and soil records. This action cannot be undone.'
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
                        <span>{t('common.delete', 'Yes, Delete Farm')}</span>
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

          {/* General Specs */}
          <div className="agri-detail-section">
            <h4 className="agri-detail-section-title">{t('common.details', 'Property Information')}</h4>
            <div className="agri-detail-grid">
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('farms.location', 'Location')}</span>
                <span className="agri-detail-value">{farm.location}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('farms.totalArea', 'Total Area')}</span>
                <span className="agri-detail-value">{formatAcres(farm.areaAcres, t)}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('farms.fieldsCount', 'Total Fields')}</span>
                <span className="agri-detail-value">{farm.fieldsCount} {t('navigation.fields', 'Mapped Plots')}</span>
              </div>
              <div className="agri-detail-item">
                <span className="agri-detail-label">{t('common.status', 'Status')}</span>
                <span className="agri-detail-value">{farm.status}</span>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {farm.notes && (
            <div className="agri-detail-section">
              <h4 className="agri-detail-section-title">{t('common.notes', 'Operational Notes')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                {farm.notes}
              </p>
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
                <span>{t('common.delete', 'Delete Farm')}</span>
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
              onClick={() => onEditFarm?.(farm)}
              disabled={isDeleting}
            >
              {t('common.edit', 'Edit')}
            </Button>
            <Button
              variant="primary"
              icon={<Grid3X3 size={15} aria-hidden="true" />}
              onClick={handleGoToFields}
              disabled={isDeleting}
            >
              {t('farms.viewFields', 'View Fields')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
