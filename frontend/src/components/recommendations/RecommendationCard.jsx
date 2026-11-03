import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Calendar, ChevronDown, ChevronUp, Droplets, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import RuleEvaluation from './RuleEvaluation';
import { translateCrop, translateVariety, translateStatus } from '../../utils/displayLabels';

/**
 * RecommendationCard component
 * Displays suitability results, sowing guidance, and explainable rule evaluation for a single crop.
 */
export default function RecommendationCard({ crop, targetFieldId = '' }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handlePlanCrop = () => {
    if (targetFieldId) {
      navigate(`/crops?fieldId=${encodeURIComponent(targetFieldId)}`);
    } else {
      navigate('/crops');
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'agri-recom-card__score--high';
    if (score >= 60) return 'agri-recom-card__score--mid';
    if (score >= 40) return 'agri-recom-card__score--low';
    return 'agri-recom-card__score--poor';
  };

  return (
    <article className="agri-recom-card" aria-label={`${t('recommendations.title', 'Recommendation')} for ${crop.crop}`}>
      {/* Top Header */}
      <div className="agri-recom-card__header">
        <div className="agri-recom-card__title-row">
          <div className="agri-recom-card__name-group">
            <Sprout size={20} className="text-primary" aria-hidden="true" />
            <div>
              <h3 className="agri-recom-card__title">
                {translateCrop(crop.crop, t)}
                {crop.variety && <span className="agri-recom-card__variety"> — {translateVariety(crop.variety, t)}</span>}
              </h3>
              <span className="agri-recom-card__category">{crop.category}</span>
            </div>
          </div>

          <div className="agri-recom-card__badge-stack">
            <StatusBadge variant={crop.matchVariant || 'success'}>
              {translateStatus(crop.matchTier, t)}
            </StatusBadge>
            <div className={`agri-recom-card__score-pill ${getScoreColorClass(crop.score)}`}>
              <span>{crop.score}% {t('recommendations.match', 'Match')}</span>
            </div>
          </div>
        </div>

        <p className="agri-recom-card__desc">{crop.description}</p>
      </div>

      {/* Key Agronomic Guidance Grid */}
      <div className="agri-recom-card__specs-grid">
        <div className="agri-recom-card__spec-item">
          <span className="agri-recom-card__spec-label">
            <Calendar size={13} aria-hidden="true" />
            {t('recommendations.sowingWindow', 'Sowing Window')}
          </span>
          <span className="agri-recom-card__spec-val">{crop.sowingWindow}</span>
        </div>

        <div className="agri-recom-card__spec-item">
          <span className="agri-recom-card__spec-label">
            <Clock size={13} aria-hidden="true" />
            {t('recommendations.maturity', 'Maturity')}
          </span>
          <span className="agri-recom-card__spec-val">{crop.maturityDays}</span>
        </div>

        <div className="agri-recom-card__spec-item">
          <span className="agri-recom-card__spec-label">
            <Droplets size={13} aria-hidden="true" />
            {t('recommendations.waterDemand', 'Water Demand')}
          </span>
          <span className="agri-recom-card__spec-val">{crop.waterRequirement}</span>
        </div>
      </div>

      {/* Active Warning Badge Preview */}
      {crop.warnings && crop.warnings.length > 0 && (
        <div className="agri-recom-card__quick-warning">
          <ShieldAlert size={14} className="text-warning" aria-hidden="true" />
          <span>{crop.warnings[0]}</span>
        </div>
      )}

      {/* Expandable Rule Evaluation Details */}
      {isExpanded && (
        <div className="agri-recom-card__eval-wrap">
          <RuleEvaluation
            checks={crop.checks}
            warnings={crop.warnings}
            crop={crop}
          />
        </div>
      )}

      {/* Footer Controls */}
      <div className="agri-recom-card__footer">
        <button
          type="button"
          className="agri-recom-card__expand-btn"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? t('recommendations.hideRuleEval', 'Hide Rule Evaluation') : t('recommendations.whyRecommendation', 'Why this recommendation? (Rule Details)')}</span>
          {isExpanded ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
        </button>

        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowRight size={14} aria-hidden="true" />}
          onClick={handlePlanCrop}
        >
          {t('recommendations.viewInCrops', 'View in Crops')}
        </Button>
      </div>
    </article>
  );
}
