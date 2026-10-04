
/**
 * Reusable StatusBadge component
 * @param {Object} props
 * @param {'success' | 'warning' | 'danger' | 'info' | 'neutral'} [props.variant='neutral']
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 */
export default function StatusBadge({
  variant = 'neutral',
  icon,
  children,
  className = '',
}) {
  return (
    <span className={`agri-badge agri-badge--${variant} ${className}`.trim()}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
