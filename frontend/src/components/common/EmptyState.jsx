import { Inbox } from 'lucide-react';

/**
 * Reusable EmptyState component
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.title='No records found']
 * @param {string} [props.description='There is no data available to display at this moment.']
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className='']
 */
export default function EmptyState({
  icon,
  title = 'No records found',
  description = 'There is no data available to display at this moment.',
  action,
  className = '',
}) {
  return (
    <div className={`agri-state-container ${className}`.trim()}>
      <div className="agri-state-icon agri-state-icon--empty">
        {icon || <Inbox size={26} aria-hidden="true" />}
      </div>
      <h4 className="agri-state-title">{title}</h4>
      <p className="agri-state-description">{description}</p>
      {action && <div className="agri-state-action">{action}</div>}
    </div>
  );
}
