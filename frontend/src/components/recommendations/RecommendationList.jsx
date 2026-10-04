import { Sprout } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { EmptyState } from '../common';

/**
 * RecommendationList component
 * Renders the ranked list of evaluated crop recommendation cards.
 *
 * @param {Object} props
 * @param {Array} props.recommendations - List of evaluated crops
 * @param {string} [props.targetFieldId] - Active field being evaluated
 */
export default function RecommendationList({ recommendations = [], targetFieldId = '' }) {
  if (recommendations.length === 0) {
    return (
      <div className="agri-recom-empty-wrap">
        <EmptyState
          icon={<Sprout size={36} aria-hidden="true" />}
          title="No recommendations generated"
          description="Adjust evaluation parameters above to test crop suitability."
        />
      </div>
    );
  }

  return (
    <section className="agri-recom-list-section" aria-label="Ranked Crop Recommendations">
      <div className="agri-recom-list-header">
        <div>
          <h2 className="agri-recom-list-title">Ranked Crop Recommendations</h2>
          <p className="agri-recom-list-subtitle">
            Ranked by deterministic suitability score based on your soil, weather, and seasonal inputs
          </p>
        </div>
      </div>

      <div className="agri-recom-cards-stack">
        {recommendations.map((crop) => (
          <RecommendationCard
            key={crop.ruleId}
            crop={crop}
            targetFieldId={targetFieldId}
          />
        ))}
      </div>
    </section>
  );
}
