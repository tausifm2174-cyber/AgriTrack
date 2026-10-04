import { Check, X, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * RuleEvaluation component
 * Displays transparent, explainable rule verification checklist for a single crop recommendation.
 *
 * @param {Object} props
 * @param {Array} props.checks - Array of evaluated parameter checks
 * @param {Array} props.warnings - Array of potential warnings or limitations
 * @param {Object} props.crop - The crop object with target ranges
 */
export default function RuleEvaluation({ checks = [], warnings = [], crop = {} }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <Check size={14} className="text-success" strokeWidth={3} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-warning" aria-hidden="true" />;
      case 'fail':
        return <X size={14} className="text-danger" strokeWidth={3} aria-hidden="true" />;
      default:
        return <HelpCircle size={14} className="text-slate-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="agri-rule-eval">
      <h4 className="agri-rule-eval__title">
        Why this recommendation? (Rule Evaluation Details)
      </h4>

      {/* Transparent Evaluation Checklist */}
      <div className="agri-rule-eval__checks-list">
        {checks.map((chk, idx) => (
          <div key={idx} className={`agri-rule-eval__check-item agri-rule-eval__check-item--${chk.status}`}>
            <span className="agri-rule-eval__icon-box">
              {getStatusIcon(chk.status)}
            </span>
            <div className="agri-rule-eval__check-text">
              <strong className="agri-rule-eval__param">{chk.parameter}:</strong>{' '}
              <span className="agri-rule-eval__label">{chk.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Target Benchmarks Reference */}
      <div className="agri-rule-eval__benchmarks">
        <div className="agri-rule-eval__bench-item">
          <span className="text-muted">Target Soil:</span>
          <strong>{crop.soilTypesPreferred}</strong>
        </div>
        <div className="agri-rule-eval__bench-item">
          <span className="text-muted">Target pH:</span>
          <strong>{crop.phRange}</strong>
        </div>
        <div className="agri-rule-eval__bench-item">
          <span className="text-muted">Thermal Range:</span>
          <strong>{crop.tempRange}</strong>
        </div>
        <div className="agri-rule-eval__bench-item">
          <span className="text-muted">Required Season:</span>
          <strong>{crop.seasonRequired}</strong>
        </div>
      </div>

      {/* Warnings / Agronomic Caveats */}
      {warnings && warnings.length > 0 && (
        <div className="agri-rule-eval__warnings">
          <div className="agri-rule-eval__warning-header">
            <AlertTriangle size={14} className="text-warning" aria-hidden="true" />
            <span>Agronomic Advisory & Amendments Needed:</span>
          </div>
          <ul className="agri-rule-eval__warning-list">
            {warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
