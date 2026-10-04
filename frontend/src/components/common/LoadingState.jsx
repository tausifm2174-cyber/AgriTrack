
/**
 * Reusable LoadingState component
 * @param {Object} props
 * @param {string} [props.message='Loading information...']
 * @param {string} [props.className='']
 */
export default function LoadingState({
  message = 'Loading information...',
  className = '',
}) {
  return (
    <div className={`agri-state-container ${className}`.trim()} role="status" aria-live="polite">
      <div className="agri-state-icon agri-state-icon--loading">
        <div className="agri-spinner" />
      </div>
      <p className="agri-state-title">{message}</p>
      <p className="agri-state-description">Please wait while AgriTrack fetches the latest data.</p>
    </div>
  );
}
