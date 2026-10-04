import { Link } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

/**
 * CropSummary Component
 * Shows currently standing active crops across farm holdings.
 * @param {Object} props
 * @param {Array} props.crops
 */
export default function CropSummary({ crops = [] }) {
  return (
    <Card
      title="Active Crops"
      subtitle="Standing crop cycles and development stages"
      action={
        <Link to="/crops" className="agri-card-action-link">
          <span>Manage Crops</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-crops-list">
        {crops.map((crop) => (
          <div key={crop.id} className="agri-crop-card">
            <div className="agri-crop-card__top">
              <span className="agri-crop-card__name">
                <Sprout size={16} className="text-primary" aria-hidden="true" />
                <span>
                  {crop.name} ({crop.variety})
                </span>
              </span>
              <StatusBadge
                variant={crop.healthStatus === 'Optimal' ? 'success' : 'info'}
              >
                {crop.healthStatus} Health
              </StatusBadge>
            </div>

            <div className="agri-crop-card__meta-grid">
              <div>
                <span className="text-muted">Season: </span>
                <strong>{crop.season}</strong>
              </div>
              <div>
                <span className="text-muted">Field: </span>
                <strong>{crop.field}</strong>
              </div>
              <div>
                <span className="text-muted">Stage: </span>
                <strong>{crop.stage}</strong>
              </div>
              <div>
                <span className="text-muted">Area: </span>
                <strong>{crop.areaAcres} Ac</strong>
              </div>
            </div>

            <div className="agri-crop-card__progress" title={`Growth progress: ${crop.progressPercent}%`}>
              <div
                className="agri-crop-card__progress-bar"
                style={{ width: `${crop.progressPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
