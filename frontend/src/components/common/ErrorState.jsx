import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ErrorState component
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {Function} [props.onRetry]
 * @param {string} [props.className='']
 */
export default function ErrorState({
  title,
  message,
  onRetry,
  className = '',
}) {
  const { t } = useTranslation();
  const displayTitle = title || t('common.unableToLoad', 'Unable to load data');
  const displayMessage = message || t('common.errorDescription', 'An error occurred while loading this section. Please try again.');

  return (
    <div className={`agri-state-container ${className}`.trim()} role="alert">
      <div className="agri-state-icon agri-state-icon--error">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h4 className="agri-state-title">{displayTitle}</h4>
      <p className="agri-state-description">{displayMessage}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={onRetry}
        >
          {t('common.retry', 'Try Again')}
        </Button>
      )}
    </div>
  );
}
