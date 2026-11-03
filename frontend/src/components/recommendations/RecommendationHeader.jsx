import { useTranslation } from 'react-i18next';
import { Compass, RotateCcw, Info, Sparkles } from 'lucide-react';
import { Button } from '../common';

/**
 * RecommendationHeader component
 * Displays page title, transparent deterministic engine disclaimer, and reset action.
 */
export default function RecommendationHeader({ onResetInputs }) {
  const { t } = useTranslation();

  return (
    <header className="agri-recom-header">
      <div className="agri-recom-header__left">
        <div className="agri-recom-header__badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>{t('recommendations.badge', 'Rule-Based Decision Support')}</span>
        </div>

        <h1 className="agri-recom-header__title">
          <Compass size={28} className="text-primary" aria-hidden="true" />
          <span>{t('recommendations.title', 'Rule-Based Crop Recommendation')}</span>
        </h1>

        <p className="agri-recom-header__desc">
          {t('recommendations.subtitle', 'Deterministic agronomic engine matching field soil chemistry, micro-climate metrics, and seasonal windows to optimal crops.')}
        </p>

        <div className="agri-recom-header__disclaimer">
          <Info size={14} aria-hidden="true" />
          <span>
            <strong>{t('recommendations.deterministicRules', 'Deterministic Agronomic Rules')}:</strong> {t('recommendations.engineNotice', 'Evaluated using agronomic parameters (Soil Type, pH, NPK, Season, Temp, Rainfall). Non-ML heuristic engine.')}
          </span>
        </div>
      </div>

      <div className="agri-recom-header__actions">
        <Button
          variant="outline"
          icon={<RotateCcw size={14} aria-hidden="true" />}
          onClick={onResetInputs}
        >
          {t('recommendations.resetInputs', 'Reset Inputs')}
        </Button>
      </div>
    </header>
  );
}
