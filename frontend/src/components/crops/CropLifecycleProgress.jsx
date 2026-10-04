import { Check, CircleDot, Clock } from 'lucide-react';
import { cropLifecycleStages } from '../../data/cropData';

/**
 * CropLifecycleProgress component
 * Visually displays the 5 agronomic crop lifecycle stages:
 * 1. Sowing -> 2. Vegetative Growth -> 3. Flowering -> 4. Ripening -> 5. Harvest Readiness
 *
 * @param {Object} props
 * @param {string} props.currentStage - Name of current stage (e.g. 'Vegetative Growth')
 * @param {number} [props.progressPercent] - Overall completion percentage (0 - 100)
 * @param {Array} [props.stageHistory] - Optional list of stage dates/notes
 * @param {boolean} [props.compact] - If true, renders a condensed version for cards
 * @param {string} [props.sowingDate] - Sowing date
 * @param {string} [props.expectedHarvestDate] - Expected harvest date
 */
export default function CropLifecycleProgress({
  currentStage,
  progressPercent = 50,
  stageHistory = [],
  compact = false,
  sowingDate,
  expectedHarvestDate,
}) {
  // Find current stage index (1-based, default 2)
  const currentStageObj = cropLifecycleStages.find(
    (s) => s.name.toLowerCase() === (currentStage || '').toLowerCase()
  );
  const currentStep = currentStageObj ? currentStageObj.step : 2;

  return (
    <div className={`agri-lifecycle ${compact ? 'agri-lifecycle--compact' : ''}`}>
      {/* Top progress overview bar */}
      <div className="agri-lifecycle__progress-header">
        <div className="agri-lifecycle__label-row">
          <span className="agri-lifecycle__current-tag">
            <span className="agri-lifecycle__pulse-dot" aria-hidden="true" />
            Current: <strong>{currentStage || 'Vegetative Growth'}</strong>
          </span>
          <span className="agri-lifecycle__percent-text">
            {progressPercent}% Cycle Completed
          </span>
        </div>

        <div
          className="agri-lifecycle__bar"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Crop cycle progress: ${progressPercent}%`}
        >
          <div
            className="agri-lifecycle__bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* 5-Stage Stepper Track */}
      <div className="agri-lifecycle__timeline" role="list" aria-label="Crop lifecycle stages">
        {cropLifecycleStages.map((stage) => {
          const isCompleted = stage.step < currentStep;
          const isCurrent = stage.step === currentStep;
          const isUpcoming = stage.step > currentStep;

          // Find date from stageHistory or dates passed
          let stageDate = null;
          if (stage.id === 'sowing' && sowingDate) {
            stageDate = sowingDate;
          } else if (stage.id === 'harvest_readiness' && expectedHarvestDate) {
            stageDate = expectedHarvestDate;
          }

          if (stageHistory && stageHistory.length > 0) {
            const historyItem = stageHistory.find((h) => h.stage.toLowerCase() === stage.name.toLowerCase());
            if (historyItem?.date) {
              stageDate = historyItem.date;
            }
          }

          let stateClass = 'agri-lifecycle__step--upcoming';
          if (isCompleted) stateClass = 'agri-lifecycle__step--completed';
          if (isCurrent) stateClass = 'agri-lifecycle__step--current';

          return (
            <div
              key={stage.id}
              role="listitem"
              className={`agri-lifecycle__step ${stateClass}`}
            >
              {/* Connector line behind marker */}
              <div className="agri-lifecycle__connector" aria-hidden="true" />

              {/* Marker Icon */}
              <div className="agri-lifecycle__marker" aria-hidden="true">
                {isCompleted ? (
                  <Check size={14} className="agri-lifecycle__check-icon" strokeWidth={3} />
                ) : isCurrent ? (
                  <CircleDot size={14} className="agri-lifecycle__dot-icon" />
                ) : (
                  <span className="agri-lifecycle__step-num">{stage.step}</span>
                )}
              </div>

              {/* Label & Details */}
              <div className="agri-lifecycle__content">
                <span className="agri-lifecycle__step-name">
                  {stage.name}
                </span>

                <span className="agri-lifecycle__step-status">
                  {isCompleted && 'Completed'}
                  {isCurrent && 'In Progress'}
                  {isUpcoming && 'Upcoming'}
                </span>

                {stageDate && (
                  <span className="agri-lifecycle__step-date">
                    <Clock size={11} aria-hidden="true" />
                    <span>{stageDate}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
