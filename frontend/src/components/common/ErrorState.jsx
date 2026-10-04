import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ErrorState component
 * @param {Object} props
 * @param {string} [props.title='Unable to load data']
 * @param {string} [props.message='An error occurred while loading this section. Please try again.']
 * @param {Function} [props.onRetry]
 * @param {string} [props.className='']
 */
export default function ErrorState({
  title = 'Unable to load data',
  message = 'An error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`agri-state-container ${className}`.trim()} role="alert">
      <div className="agri-state-icon agri-state-icon--error">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h4 className="agri-state-title">{title}</h4>
      <p className="agri-state-description">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
