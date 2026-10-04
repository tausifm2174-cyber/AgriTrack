import { useNavigate } from 'react-router-dom';
import { Warehouse, Droplets, FlaskConical, Eye, Sprout, Activity } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatAcres } from '../../utils/formatters';

/**
 * FieldCard component
 * Displays operational parcel metrics, standing crop, soil type, irrigation, and quick links.
 */
export default function FieldCard({ field, onViewDetails }) {
  const navigate = useNavigate();

  const handleGoToSoil = () => {
    navigate(`/soil?fieldId=${encodeURIComponent(field.id)}`);
  };

  const handleGoToCrops = () => {
    navigate(`/crops?fieldId=${encodeURIComponent(field.id)}`);
  };

  return (
    <article className="agri-field-card" aria-labelledby={`field-title-${field.id}`}>
      {/* Header */}
      <div className="agri-field-card__header">
        <div className="agri-field-card__title-group">
          <h2 id={`field-title-${field.id}`} className="agri-field-card__name">
            {field.name}
          </h2>
          <span className="agri-field-card__farm-name">
            <Warehouse size={12} aria-hidden="true" />
            <span>{field.farmName}</span>
          </span>
        </div>
        <StatusBadge variant={field.healthVariant || 'success'}>
          {field.healthStatus}
        </StatusBadge>
      </div>

      {/* Body */}
      <div className="agri-field-card__body">
        {/* Crop & Growth Stage Banner */}
        <div className="agri-field-card__crop-banner">
          <div className="agri-field-card__crop-header">
            <span className="agri-field-card__crop-title">
              <Sprout size={15} className="text-primary" aria-hidden="true" />
              <span>{field.currentCrop} {field.cropVariety ? `(${field.cropVariety})` : ''}</span>
            </span>
            <span className="agri-field-card__crop-season">{field.cropSeason}</span>
          </div>

          <div className="agri-field-card__stage-row">
            <span>Stage: <strong>{field.cropStage}</strong></span>
            <span>{field.cropProgress}% Cycle</span>
          </div>

          <div className="agri-field-card__progress-bar">
            <div
              className="agri-field-card__progress-fill"
              style={{ width: `${field.cropProgress || 50}%` }}
            />
          </div>
        </div>

        {/* Specs Grid */}
        <div className="agri-field-card__specs">
          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Area</span>
            <span className="agri-field-card__spec-value">{formatAcres(field.areaAcres)}</span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Soil Type</span>
            <span className="agri-field-card__spec-value">{field.soilType}</span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Irrigation</span>
            <span className="agri-field-card__spec-value">
              <Droplets size={13} style={{ color: 'var(--info-text)' }} aria-hidden="true" />
              <span>{field.irrigationMethod}</span>
            </span>
          </div>

          <div className="agri-field-card__spec-item">
            <span className="agri-field-card__spec-label">Soil Moisture</span>
            <span className="agri-field-card__spec-value">{field.soilMoisture || '38%'}</span>
          </div>
        </div>

        {/* Last Activity */}
        {field.lastActivity && (
          <div className="agri-field-card__activity">
            <span className="agri-field-card__activity-label">Recent / Scheduled Activity</span>
            <span className="agri-field-card__activity-text">
              <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
              {field.lastActivity}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="agri-field-card__footer">
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={14} aria-hidden="true" />}
          onClick={() => onViewDetails(field)}
        >
          Details
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={<Sprout size={14} aria-hidden="true" />}
          onClick={handleGoToCrops}
        >
          Crops
        </Button>

        <Button
          variant="outline"
          size="sm"
          icon={<FlaskConical size={14} aria-hidden="true" />}
          onClick={handleGoToSoil}
        >
          Soil Records
        </Button>
      </div>
    </article>
  );
}
