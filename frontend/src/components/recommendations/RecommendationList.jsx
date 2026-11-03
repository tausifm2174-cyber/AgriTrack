import { useTranslation } from 'react-i18next';
import { Sprout } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { EmptyState } from '../common';

/**
 * RecommendationList component
 * Renders the ranked list of evaluated crop recommendation cards.
 */
export default function RecommendationList({ recommendations = [], targetFieldId = '' }) {
  const { t } = useTranslation();

  if (recommendations.length === 0) {
    return (
      <div className="agri-recom-empty-wrap">
        <EmptyState
          icon={<Sprout size={36} aria-hidden="true" />}
          title={t('recommendations.noRecommendations', 'No recommendations generated')}
          description={t('recommendations.adjustParamsDesc', 'Adjust evaluation parameters above to test crop suitability.')}
        />
      </div>
    );
  }

  return (
    <section className="agri-recom-list-section" aria-label={t('recommendations.rankedRecommendations', 'Ranked Crop Recommendations')}>
      <div className="agri-recom-list-header">
        <div>
          <h2 className="agri-recom-list-title">{t('recommendations.rankedRecommendations', 'Ranked Crop Recommendations')}</h2>
          <p className="agri-recom-list-subtitle">
            {t('recommendations.rankedSubtitle', 'Ranked by deterministic suitability score based on your soil, weather, and seasonal inputs')}
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
