import { Compass, RotateCcw, Info, Sparkles } from 'lucide-react';
import { Button } from '../common';

/**
 * RecommendationHeader component
 * Displays page title, transparent deterministic engine disclaimer, and reset action.
 *
 * @param {Object} props
 * @param {Function} props.onResetInputs - Callback to reset all agronomic inputs to defaults
 */
export default function RecommendationHeader({ onResetInputs }) {
  return (
    <header className="agri-recom-header">
      <div className="agri-recom-header__left">
        <div className="agri-recom-header__badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>Rule-Based Decision Support</span>
        </div>

        <h1 className="agri-recom-header__title">
          <Compass size={28} className="text-primary" aria-hidden="true" />
          <span>Rule-Based Crop Recommendation</span>
        </h1>

        <p className="agri-recom-header__desc">
          Deterministic agronomic engine matching field soil chemistry, micro-climate metrics, and seasonal windows to optimal crops.
        </p>

        <div className="agri-recom-header__disclaimer">
          <Info size={14} aria-hidden="true" />
          <span>
            <strong>Deterministic Agronomic Rules:</strong> Evaluated using agronomic parameters (Soil Type, pH, NPK, Season, Temp, Rainfall). Non-ML heuristic engine.
          </span>
        </div>
      </div>

      <div className="agri-recom-header__actions">
        <Button
          variant="outline"
          icon={<RotateCcw size={14} aria-hidden="true" />}
          onClick={onResetInputs}
        >
          Reset Inputs
        </Button>
      </div>
    </header>
  );
}
