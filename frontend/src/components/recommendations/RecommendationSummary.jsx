import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, Sprout, Layers } from 'lucide-react';

/**
 * RecommendationSummary component
 * Displays high-level result metrics of the rule engine evaluation.
 */
export default function RecommendationSummary({ recommendations = [], inputs = {} }) {
  const { t } = useTranslation();
  const highlyRecommended = recommendations.filter((r) => r.matchTier === 'Highly Recommended').length;
  const moderatelySuitable = recommendations.filter((r) => r.matchTier === 'Moderately Suitable').length;
  const conditional = recommendations.filter((r) => r.matchTier === 'Conditional / Marginal').length;

  return (
    <section className="agri-recom-summary-grid" aria-label={t('recommendations.summaryOverview', 'Recommendation Engine Overview')}>
      {/* 1. Highly Recommended */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--green">
          <CheckCircle2 size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">{t('recommendations.highlyRecommended', 'Highly Recommended')}</span>
          <span className="agri-recom-summary-value">{highlyRecommended} {t('navigation.crops', 'Crops')}</span>
          <span className="agri-recom-summary-sub">{t('recommendations.scoreHigh', 'Suitability score ≥ 80%')}</span>
        </div>
      </div>

      {/* 2. Moderately Suitable */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--blue">
          <Sprout size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">{t('recommendations.moderatelySuitable', 'Moderately Suitable')}</span>
          <span className="agri-recom-summary-value">{moderatelySuitable} {t('navigation.crops', 'Crops')}</span>
          <span className="agri-recom-summary-sub">{t('recommendations.scoreMid', 'Suitability score 60%–79%')}</span>
        </div>
      </div>

      {/* 3. Conditional / Marginal */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--amber">
          <AlertCircle size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">{t('recommendations.conditional', 'Conditional / Needs Inputs')}</span>
          <span className="agri-recom-summary-value">{conditional} {t('navigation.crops', 'Crops')}</span>
          <span className="agri-recom-summary-sub">{t('recommendations.adjustmentsReq', 'Requires soil or timing adjustments')}</span>
        </div>
      </div>

      {/* 4. Target Evaluation Profile */}
      <div className="agri-recom-summary-card">
        <div className="agri-recom-summary-icon agri-recom-summary-icon--purple">
          <Layers size={22} aria-hidden="true" />
        </div>
        <div className="agri-recom-summary-info">
          <span className="agri-recom-summary-label">{t('recommendations.targetProfile', 'Target Evaluation Profile')}</span>
          <span className="agri-recom-summary-value">{inputs.season} {t('crops.season', 'Season')}</span>
          <span className="agri-recom-summary-sub">{inputs.soilType} • pH {inputs.soilPh}</span>
        </div>
      </div>
    </section>
  );
}
