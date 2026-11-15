import { useTranslation } from 'react-i18next';
import { Sprout, Warehouse, Grid3X3, Layers, Eye, Edit3 } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';
import CropLifecycleProgress from './CropLifecycleProgress';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  translateSoilType,
  translateStatus,
  formatFieldName,
} from '../../utils/displayLabels';

/**
 * CropCard component
 * Displays full crop cycle specifications, field ownership, 5-stage progress, and operational actions.
 *
 * @param {Object} props
 * @param {Object} props.crop - Crop cycle record
 * @param {Function} props.onViewDetails - Callback to view details
 * @param {Function} props.onViewLifecycle - Callback to view full lifecycle timeline
 * @param {Function} props.onEdit - Callback to edit crop record
 */
export default function CropCard({
  crop,
  onViewDetails,
  onViewLifecycle,
  onEdit,
}) {
  const { t } = useTranslation();

  return (
    <article className="agri-crop-card" aria-labelledby={`crop-title-${crop.id}`}>
      {/* Card Header */}
      <div className="agri-crop-card__header">
        <div className="agri-crop-card__title-group">
          <div className="agri-crop-card__name-row">
            <Sprout size={18} className="text-primary" aria-hidden="true" />
            <h2 id={`crop-title-${crop.id}`} className="agri-crop-card__name">
              {translateCrop(crop.cropName, t)} {crop.variety ? `– ${translateVariety(crop.variety, t)}` : ''}
            </h2>
          </div>
          <div className="agri-crop-card__location-sub">
            <span className="agri-crop-card__farm-pill">
              <Warehouse size={12} aria-hidden="true" />
              <span>{crop.farmName || (crop.farmId ? t(`farms.demoNames.${crop.farmId}`, 'Farm Holding') : '')}</span>
            </span>
            <span className="agri-crop-card__dot-sep">•</span>
            <span className="agri-crop-card__field-pill">
              <Grid3X3 size={12} aria-hidden="true" />
              <span>{formatFieldName(crop.fieldName, t) || 'Field'}</span>
            </span>
          </div>
        </div>

        <div className="agri-crop-card__badge-stack">
          <StatusBadge variant={crop.statusVariant || 'success'}>
            {translateStatus(crop.status, t)}
          </StatusBadge>
          <span className="agri-crop-card__season-badge">{translateSeason(crop.season, t)}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="agri-crop-card__body">
        {/* Specs Grid */}
        <div className="agri-crop-card__specs">
          <div className="agri-crop-card__spec-item">
            <span className="agri-crop-card__spec-label">{t('fields.area', 'Cultivated Area')}</span>
            <span className="agri-crop-card__spec-value">{crop.areaAcres ? formatAcres(crop.areaAcres) : '—'}</span>
          </div>

          <div className="agri-crop-card__spec-item">
            <span className="agri-crop-card__spec-label">{t('fields.soilType', 'Soil Medium')}</span>
            <span className="agri-crop-card__spec-value">{crop.soilType ? translateSoilType(crop.soilType, t) : '—'}</span>
          </div>

          <div className="agri-crop-card__spec-item">
            <span className="agri-crop-card__spec-label">{t('crops.sowingDate', 'Sowing Date')}</span>
            <span className="agri-crop-card__spec-value">{crop.sowingDate || '—'}</span>
          </div>

          <div className="agri-crop-card__spec-item">
            <span className="agri-crop-card__spec-label">{t('crops.expectedHarvest', 'Expected Harvest')}</span>
            <span className="agri-crop-card__spec-value">{crop.expectedHarvestDate || '—'}</span>
          </div>
        </div>

        {/* Embedded 5-Stage Lifecycle Progress */}
        <div className="agri-crop-card__lifecycle-wrap">
          <CropLifecycleProgress
            currentStage={crop.currentStage}
            progressPercent={crop.progressPercent}
            compact={true}
            sowingDate={crop.sowingDate}
            expectedHarvestDate={crop.expectedHarvestDate}
          />
        </div>

        {/* Upcoming Milestone preview */}
        {crop.upcomingMilestone && (
          <div className="agri-crop-card__milestone">
            <span className="agri-crop-card__milestone-label">{t('cropCalendar.milestoneName', 'Upcoming Milestone')}:</span>
            <span className="agri-crop-card__milestone-val">
              {crop.upcomingMilestone} {crop.upcomingMilestoneDate ? `(${crop.upcomingMilestoneDate})` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="agri-crop-card__footer">
        <div className="agri-crop-card__actions-left">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={14} aria-hidden="true" />}
            onClick={() => onViewDetails(crop)}
          >
            {t('common.details', 'Details')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Layers size={14} aria-hidden="true" />}
            onClick={() => onViewLifecycle(crop)}
          >
            {t('crops.lifecycleProgress', 'Lifecycle')}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Edit3 size={14} aria-hidden="true" />}
          onClick={() => onEdit(crop)}
        >
          {t('common.edit', 'Edit')}
        </Button>
      </div>
    </article>
  );
}
