import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';

/**
 * Reusable EmptyState component
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className='']
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  const { t } = useTranslation();
  const displayTitle = title || t('common.noData', 'No records found');
  const displayDescription = description || t('common.noDataDescription', 'There is no data available to display at this moment.');

  return (
    <div className={`agri-state-container ${className}`.trim()}>
      <div className="agri-state-icon agri-state-icon--empty">
        {icon || <Inbox size={26} aria-hidden="true" />}
      </div>
      <h4 className="agri-state-title">{displayTitle}</h4>
      <p className="agri-state-description">{displayDescription}</p>
      {action && <div className="agri-state-action">{action}</div>}
    </div>
  );
}
