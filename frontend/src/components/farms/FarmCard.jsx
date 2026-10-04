import { useNavigate } from 'react-router-dom';
import { MapPin, Grid3X3, Eye, Droplet, Sprout } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmCard component
 * Represents an individual farm holding with key statistics, crops, and navigation.
 */
export default function FarmCard({ farm, onViewDetails }) {
  const navigate = useNavigate();

  const handleViewFields = () => {
    navigate(`/fields?farmId=${encodeURIComponent(farm.id)}`);
  };

  return (
    <article className="agri-farm-card" aria-labelledby={`farm-heading-${farm.id}`}>
      {/* Header */}
      <div className="agri-farm-card__header">
        <div className="agri-farm-card__title-area">
          <span className="agri-farm-card__code">{farm.code || 'HOLDING'}</span>
          <h2 id={`farm-heading-${farm.id}`} className="agri-farm-card__name">
            {farm.name}
          </h2>
          <div className="agri-farm-card__location">
            <MapPin size={14} aria-hidden="true" />
            <span>{farm.location}</span>
          </div>
        </div>
        <StatusBadge variant={farm.statusVariant || 'success'}>
          {farm.status}
        </StatusBadge>
      </div>

      {/* Body */}
      <div className="agri-farm-card__body">
        {/* Key Metrics */}
        <div className="agri-farm-card__stats">
          <div className="agri-farm-card__stat-item">
            <span className="agri-farm-card__stat-label">Total Acreage</span>
            <span className="agri-farm-card__stat-value">{formatAcres(farm.areaAcres)}</span>
          </div>
          <div className="agri-farm-card__stat-item">
            <span className="agri-farm-card__stat-label">Fields Mapped</span>
            <span className="agri-farm-card__stat-value">{farm.fieldsCount} Plots</span>
          </div>
        </div>

        {/* Primary Crops */}
        <div className="agri-farm-card__meta-group">
          <div className="agri-farm-card__meta-row">
            <span className="agri-farm-card__meta-label">Primary Crops</span>
            <div className="agri-farm-card__crops-pills">
              {farm.primaryCrops.map((crop, idx) => (
                <span key={idx} className="agri-farm-card__crop-pill">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Soil & Water Summary */}
          <div className="agri-farm-card__meta-row">
            <span className="agri-farm-card__meta-label">Soil & Irrigation</span>
            <p className="agri-farm-card__soil-text">
              <Sprout size={14} className="text-primary" aria-hidden="true" />
              <span>{farm.soilSummary}</span>
            </p>
            <p className="agri-farm-card__soil-text text-muted" style={{ marginTop: '0.2rem' }}>
              <Droplet size={14} style={{ color: 'var(--info-text)' }} aria-hidden="true" />
              <span>{farm.irrigationSummary || farm.waterSource}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="agri-farm-card__footer">
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={15} aria-hidden="true" />}
          onClick={() => onViewDetails(farm)}
        >
          View Details
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<Grid3X3 size={15} aria-hidden="true" />}
          iconPosition="left"
          onClick={handleViewFields}
        >
          View Fields
        </Button>
      </div>
    </article>
  );
}
