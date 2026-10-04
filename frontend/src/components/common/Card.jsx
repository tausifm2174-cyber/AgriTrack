
/**
 * Reusable Card component for AgriTrack
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.action]
 * @param {React.ReactNode} [props.footer]
 * @param {boolean} [props.hoverable=false]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export default function Card({
  title,
  subtitle,
  action,
  footer,
  hoverable = false,
  className = '',
  children,
  ...rest
}) {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <div
      className={`agri-card ${hoverable ? 'agri-card--hoverable' : ''} ${className}`.trim()}
      {...rest}
    >
      {hasHeader && (
        <div className="agri-card__header">
          <div>
            {title && <h3 className="agri-card__title">{title}</h3>}
            {subtitle && <p className="agri-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="agri-card__action">{action}</div>}
        </div>
      )}
      <div className="agri-card__body">{children}</div>
      {footer && <div className="agri-card__footer">{footer}</div>}
    </div>
  );
}
