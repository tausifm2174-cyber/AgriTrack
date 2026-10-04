import { Warehouse, Calendar, Eye, Droplet } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button } from '../common';

/**
 * SoilRecordCard component
 * Card presentation for an individual soil test report.
 */
export default function SoilRecordCard({ record, onViewDetails }) {
  const getPhBadgeClass = (ph) => {
    if (ph < 6.0) return 'agri-soil-ph-badge--acidic';
    if (ph > 7.5) return 'agri-soil-ph-badge--alkaline';
    return 'agri-soil-ph-badge--neutral';
  };

  return (
    <article className="agri-soil-card" aria-labelledby={`soil-title-${record.id}`}>
      {/* Header */}
      <div className="agri-soil-card__header">
        <div className="agri-soil-field-cell">
          <h2 id={`soil-title-${record.id}`} className="agri-soil-field-name">
            {record.fieldName}
          </h2>
          <span className="agri-soil-farm-name">
            <Warehouse size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
            {record.farmName}
          </span>
        </div>
        <SoilStatus status={record.status} variant={record.statusVariant} />
      </div>

      {/* Body */}
      <div className="agri-soil-card__body">
        {/* pH & Soil Type Row */}
        <div className="agri-soil-card__ph-row">
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
              Soil Type
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)' }}>
              {record.soilType}
            </div>
          </div>
          <span className={`agri-soil-ph-badge ${getPhBadgeClass(record.ph)}`}>
            {record.ph} pH • {record.phRating}
          </span>
        </div>

        {/* N-P-K Nutrient Breakdown */}
        <div className="agri-soil-card__nutrients-box">
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Primary Nutrients (kg/ha)
          </div>

          <div className="agri-soil-card__nutrient-bar-group">
            <div className="agri-soil-card__nutrient-label-row">
              <span>Nitrogen (N)</span>
              <strong>{record.nitrogen} kg/ha ({record.nitrogenRating})</strong>
            </div>
            <div className="agri-field-card__progress-bar">
              <div
                className="agri-field-card__progress-fill"
                style={{ width: `${Math.min(100, (record.nitrogen / 400) * 100)}%`, backgroundColor: '#3b82f6' }}
              />
            </div>
          </div>

          <div className="agri-soil-card__nutrient-bar-group">
            <div className="agri-soil-card__nutrient-label-row">
              <span>Phosphorus (P)</span>
              <strong>{record.phosphorus} kg/ha ({record.phosphorusRating})</strong>
            </div>
            <div className="agri-field-card__progress-bar">
              <div
                className="agri-field-card__progress-fill"
                style={{ width: `${Math.min(100, (record.phosphorus / 30) * 100)}%`, backgroundColor: '#f59e0b' }}
              />
            </div>
          </div>

          <div className="agri-soil-card__nutrient-bar-group">
            <div className="agri-soil-card__nutrient-label-row">
              <span>Potassium (K)</span>
              <strong>{record.potassium} kg/ha ({record.potassiumRating})</strong>
            </div>
            <div className="agri-field-card__progress-bar">
              <div
                className="agri-field-card__progress-fill"
                style={{ width: `${Math.min(100, (record.potassium / 350) * 100)}%`, backgroundColor: '#8b5cf6' }}
              />
            </div>
          </div>
        </div>

        {/* Carbon & Moisture Metrics */}
        <div className="agri-field-card__specs" style={{ marginTop: '0.25rem' }}>
          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Organic Carbon</span>
            <span className="agri-field-card__spec-value">{record.organicCarbon}% ({record.organicCarbonRating})</span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Soil Moisture</span>
            <span className="agri-field-card__spec-value">
              <Droplet size={13} style={{ color: 'var(--info-text)' }} aria-hidden="true" />
              <span>{record.moisturePercent}% ({record.moistureRating})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="agri-soil-card__footer">
        <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} aria-hidden="true" />
          <span>{record.testedDaysAgo}</span>
        </span>

        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={14} aria-hidden="true" />}
          onClick={() => onViewDetails(record)}
        >
          View Full Report
        </Button>
      </div>
    </article>
  );
}
