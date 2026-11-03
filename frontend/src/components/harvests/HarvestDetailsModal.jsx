import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Sprout, Grid3X3, Receipt, PlusCircle, Warehouse, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../common';
import HarvestStatusBadge from './HarvestStatusBadge';
import { formatWeight } from '../../utils/formatters';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  formatFieldName,
} from '../../utils/displayLabels';

export default function HarvestDetailsModal({ harvest, onClose, onRecordSale }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!harvest) return null;

  const soldPercent =
    harvest.harvestedQuantityKg > 0
      ? Math.min(100, Math.round((harvest.soldQuantityKg / harvest.harvestedQuantityKg) * 100))
      : 0;

  const handleViewSales = () => {
    onClose();
    navigate(`/sales?harvestId=${encodeURIComponent(harvest.id)}`);
  };

  const handleViewCrop = () => {
    onClose();
    navigate(`/crops?crop=${encodeURIComponent(harvest.cropName)}`);
  };

  const handleViewField = () => {
    onClose();
    navigate(`/fields?farmId=${encodeURIComponent(harvest.farmId)}`);
  };

  const gradeClass =
    harvest.qualityGrade === 'A'
      ? 'agri-quality-pill--a'
      : harvest.qualityGrade === 'B'
      ? 'agri-quality-pill--b'
      : 'agri-quality-pill--c';

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="harvest-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
                {harvest.id}
              </span>
              <HarvestStatusBadge status={harvest.status} />
              <span className={`agri-quality-pill ${gradeClass}`}>
                {t('harvests.grade', 'Grade')} {harvest.qualityGrade} ({harvest.qualityScore}/100)
              </span>
            </div>
            <h3 id="harvest-modal-title" className="agri-modal-title">
              {translateCrop(harvest.cropName, t)} — {translateVariety(harvest.variety, t)}
            </h3>
            <p className="agri-modal-subtitle">
              {t(`farms.demoNames.${harvest.farmId}`, harvest.farmName)} • {formatFieldName(harvest.fieldName, t)} ({translateSeason(harvest.season, t)} {t('crops.season', 'Season')})
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close modal')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Quantity Metrics */}
          <div className="agri-harvest-detail-metrics">
            <div className="agri-harvest-detail-metric-card">
              <span className="agri-harvest-detail-metric-card__label">{t('harvests.harvestQuantity', 'Harvested Qty')}</span>
              <span className="agri-harvest-detail-metric-card__value">
                {formatWeight(harvest.harvestedQuantityKg, 'kg')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {(harvest.harvestedQuantityKg / 100).toFixed(1)} {t('units.quintals', 'quintals')}
              </span>
            </div>

            <div className="agri-harvest-detail-metric-card">
              <span className="agri-harvest-detail-metric-card__label">{t('harvests.availableQuantity', 'Available Qty')}</span>
              <span
                className="agri-harvest-detail-metric-card__value"
                style={{ color: harvest.availableQuantityKg > 0 ? 'var(--primary-700)' : 'var(--slate-400)' }}
              >
                {formatWeight(harvest.availableQuantityKg, 'kg')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {(harvest.availableQuantityKg / 100).toFixed(1)} {t('units.quintals', 'quintals')} {t('harvests.inStock', 'in stock')}
              </span>
            </div>

            <div className="agri-harvest-detail-metric-card">
              <span className="agri-harvest-detail-metric-card__label">{t('harvests.soldQuantity', 'Sold Qty')}</span>
              <span className="agri-harvest-detail-metric-card__value">
                {formatWeight(harvest.soldQuantityKg, 'kg')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {(harvest.soldQuantityKg / 100).toFixed(1)} {t('units.quintals', 'quintals')} {t('harvests.traded', 'traded')}
              </span>
            </div>

            <div className="agri-harvest-detail-metric-card">
              <span className="agri-harvest-detail-metric-card__label">{t('crops.expectedYield', 'Expected Yield')}</span>
              <span className="agri-harvest-detail-metric-card__value">
                {formatWeight(harvest.expectedYieldKg, 'kg')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {harvest.expectedYieldKg > 0
                  ? `${Math.round((harvest.harvestedQuantityKg / harvest.expectedYieldKg) * 100)}% realization`
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Sales Offload Progress */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
              <span>{t('harvests.salesOffload', 'Sales Offload & Inventory Depletion')}</span>
              <span>{soldPercent}% {t('sales.soldOut', 'Offloaded')}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${soldPercent}%`,
                  backgroundColor: soldPercent === 100 ? 'var(--slate-400)' : 'var(--primary-600)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              <span>{harvest.soldQuantityKg} kg {t('harvests.sold', 'sold to registered buyers')}</span>
              <span>{harvest.availableQuantityKg} kg {t('harvests.remaining', 'remaining in storage')}</span>
            </div>
          </div>

          {/* Agronomic & Storage Info */}
          <div className="agri-form-grid agri-form-grid--2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                {t('harvests.harvestAndTiming', 'Harvest & Timing')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                <Calendar size={16} className="text-primary-600" />
                <span>{t('common.date', 'Date')}: <strong>{harvest.harvestDate}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                <CheckCircle2 size={16} className="text-primary-600" />
                <span>{t('harvests.moistureLevel', 'Moisture Level')}: <strong>{harvest.moisturePercent}%</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                {t('harvests.storageLocation', 'Storage Location')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                <Warehouse size={16} className="text-primary-600" />
                <span>{harvest.storageLocation || t('harvests.onFarmStorage', 'On-farm storage yard')}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {t('harvests.batchCertified', 'Batch inspected and certified under post-harvest quality standard.')}
              </div>
            </div>
          </div>

          {/* Agronomist Notes */}
          {harvest.notes && (
            <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                {t('harvests.observations', 'Field & Quality Observations')}
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                {harvest.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Actions */}
        <div className="agri-modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleViewCrop} aria-label={t('harvests.viewCrops', 'View Crop')}>
              <Sprout size={14} />
              <span>{t('harvests.viewCrops', 'View Crop')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewField} aria-label={t('navigation.fields', 'View Field')}>
              <Grid3X3 size={14} />
              <span>{t('navigation.fields', 'View Field')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewSales} aria-label={t('harvests.viewSales', 'View Linked Sales')}>
              <Receipt size={14} />
              <span>{t('harvests.viewSales', 'View Sales')}</span>
            </Button>
          </div>

          {harvest.availableQuantityKg > 0 && onRecordSale && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onRecordSale(harvest);
              }}
              aria-label={t('sales.addSale', 'Record Sale for this Harvest')}
            >
              <PlusCircle size={15} />
              <span>{t('harvests.sellProduce', 'Sell Produce')}</span>
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose} aria-label={t('common.close', 'Close modal')}>
            {t('common.close', 'Close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
