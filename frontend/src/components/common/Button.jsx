
/**
 * Reusable Button component for AgriTrack
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {React.ReactNode} [props.icon]
 * @param {'left' | 'right'} [props.iconPosition='left']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const sizeClass = size !== 'md' ? `agri-btn--${size}` : '';
  const variantClass = `agri-btn--${variant}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`agri-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <span
          className="agri-spinner"
          style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}
          aria-hidden="true"
        />
      ) : (
        icon && iconPosition === 'left' && <span className="agri-btn__icon" aria-hidden="true">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="agri-btn__icon" aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}
