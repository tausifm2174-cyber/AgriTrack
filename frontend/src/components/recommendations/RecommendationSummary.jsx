import { CheckCircle2, AlertCircle, Sprout, Layers } from 'lucide-react';

/**
 * RecommendationSummary component
 * Displays high-level result metrics of the rule engine evaluation.
 *
 * @param {Object} props
 * @param {Array} props.recommendations - List of evaluated crops
 * @param {Object} props.inputs - Current input parameters
 */
export default function RecommendationSummary({ recommendations = [], inputs = {} }) {
  const highlyRecommended = recommendations.filter((r) => r.matchTier === 'Highly Recommended').length;
  const moderatelySuitable = recommendations.filter((r) => r.matchTier === 'Moderately Suitable').length;
  const conditional = recommendations.filter((r) => r.matchTier === 'Conditional / Marginal').length;

  return (
    <section className="agri-recom-summary-grid" aria-label="Recommendation Engine Overview">
      {/* 1. Highly Recommended */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--green">
          <CheckCircle2 size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">Highly Recommended</span>
          <span className="agri-recom-summary-value">{highlyRecommended} Crops</span>
          <span className="agri-recom-summary-sub">Suitability score &ge; 80%</span>
        </div>
      </div>

      {/* 2. Moderately Suitable */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--blue">
          <Sprout size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">Moderately Suitable</span>
          <span className="agri-recom-summary-value">{moderatelySuitable} Crops</span>
          <span className="agri-recom-summary-sub">Suitability score 60%–79%</span>
        </div>
      </div>

      {/* 3. Conditional / Marginal */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--amber">
          <AlertCircle size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">Conditional / Needs Inputs</span>
          <span className="agri-recom-summary-value">{conditional} Crops</span>
          <span className="agri-recom-summary-sub">Requires soil or timing adjustments</span>
        </div>
      </div>

      {/* 4. Target Evaluation Profile */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--purple">
          <Layers size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">Target Evaluation Profile</span>
          <span className="agri-recom-summary-value">{inputs.season} Season</span>
          <span className="agri-recom-summary-sub">{inputs.soilType} • pH {inputs.soilPh}</span>
        </div>
      </div>
    </section>
  );
}
