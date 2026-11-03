
import { useTranslation } from 'react-i18next';

/**
 * Reusable LoadingState component
 * @param {Object} props
 * @param {string} [props.message]
 * @param {string} [props.className='']
 */
export default function LoadingState({
  message,
  className = '',
}) {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loadingInfo', 'Loading information...');

  return (
    <div className={`agri-state-container ${className}`.trim()} role="status" aria-live="polite">
      <div className="agri-state-icon agri-state-icon--loading">
        <div className="agri-spinner" />
      </div>
      <p className="agri-state-title">{displayMessage}</p>
      <p className="agri-state-description">
        {t('common.loadingDescription', 'Please wait while AgriTrack fetches the latest data.')}
      </p>
    </div>
  );
}
