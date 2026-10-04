
/**
 * Reusable PageHeader component for AgriTrack
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.actions]
 * @param {string} [props.className='']
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <div className={`agri-page-header ${className}`.trim()}>
      <div className="agri-page-header__title-group">
        <h1>{title}</h1>
        {subtitle && <p className="agri-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="agri-page-header__actions">{actions}</div>}
    </div>
  );
}
