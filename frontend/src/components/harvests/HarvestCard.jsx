import { useTranslation } from 'react-i18next';
import { Eye, PlusCircle, MapPin, Calendar } from 'lucide-react';
import { Button } from '../common';
import HarvestStatusBadge from './HarvestStatusBadge';
import { formatWeight } from '../../utils/formatters';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  formatFieldName,
} from '../../utils/displayLabels';

export default function HarvestCard({ harvest, onViewDetails, onRecordSale }) {
  const { t } = useTranslation();
  const soldPercent =
    harvest.harvestedQuantityKg > 0
      ? Math.min(100, Math.round((harvest.soldQuantityKg / harvest.harvestedQuantityKg) * 100))
      : 0;

  const gradeClass =
    harvest.qualityGrade === 'A'
      ? 'agri-quality-pill--a'
      : harvest.qualityGrade === 'B'
      ? 'agri-quality-pill--b'
      : 'agri-quality-pill--c';

  return (
    <div className="agri-harvest-card">
      <div className="agri-harvest-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
              {harvest.id}
            </span>
            <HarvestStatusBadge status={harvest.status} />
          </div>
          <h3 className="agri-harvest-card__title">
            {translateCrop(harvest.cropName, t)} ({translateVariety(harvest.variety, t)})
          </h3>
          <div className="agri-harvest-card__subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} />
            <span>
              {t(`farms.demoNames.${harvest.farmId}`, harvest.farmName)} • {formatFieldName(harvest.fieldName, t)}
            </span>
          </div>
        </div>
        <span className={`agri-quality-pill ${gradeClass}`}>
          {t('harvests.grade', 'Grade')} {harvest.qualityGrade}
        </span>
      </div>

      <div className="agri-harvest-card__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <Calendar size={14} />
          <span>{t('harvests.harvested', 'Harvested')}: {harvest.harvestDate} ({translateSeason(harvest.season, t)})</span>
        </div>

        <div className="agri-harvest-card__stats-grid">
          <div className="agri-harvest-card__stat-item">
            <span className="agri-harvest-card__stat-label">{t('harvests.harvestQuantity', 'Harvested')}</span>
            <span className="agri-harvest-card__stat-value">
              {formatWeight(harvest.harvestedQuantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-harvest-card__stat-item">
            <span className="agri-harvest-card__stat-label">{t('harvests.availableQuantity', 'Available')}</span>
            <span
              className="agri-harvest-card__stat-value"
              style={{ color: harvest.availableQuantityKg > 0 ? 'var(--primary-700)' : 'var(--slate-400)' }}
            >
              {formatWeight(harvest.availableQuantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-harvest-card__stat-item">
            <span className="agri-harvest-card__stat-label">{t('harvests.soldQuantity', 'Sold')}</span>
            <span className="agri-harvest-card__stat-value">
              {formatWeight(harvest.soldQuantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-harvest-card__stat-item">
            <span className="agri-harvest-card__stat-label">{t('harvests.qualityScore', 'Quality Score')}</span>
            <span className="agri-harvest-card__stat-value">
              {harvest.qualityScore}/100
            </span>
          </div>
        </div>

        <div className="agri-harvest-card__progress-container">
          <div className="agri-harvest-card__progress-label">
            <span>{t('harvests.salesOffload', 'Sales Offload')}</span>
            <span>{soldPercent}% {t('sales.soldOut', 'Sold')}</span>
          </div>
          <div className="agri-harvest-card__progress-track">
            <div
              className="agri-harvest-card__progress-bar"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="agri-harvest-card__footer">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(harvest)}
          aria-label={`${t('common.viewDetails', 'View details')} ${harvest.id}`}
        >
          <Eye size={14} />
          <span>{t('common.details', 'Details')}</span>
        </Button>
        {harvest.availableQuantityKg > 0 && onRecordSale && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRecordSale(harvest)}
            aria-label={`${t('sales.addSale', 'Record sale')} ${harvest.id}`}
          >
            <PlusCircle size={14} />
            <span>{t('sales.addSale', 'Record Sale')}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
