
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  let content = children;
  if (typeof children === 'string') {
    const lower = children.trim().toLowerCase();
    const camel = lower.replace(/[\s-_]+(\w)/g, (_, c) => c.toUpperCase());
    const candidateKey = `status.${camel}`;
    content = t(candidateKey, children);
  }

  return (
    <span className={`agri-badge agri-badge--${variant} ${className}`.trim()}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{content}</span>
    </span>
  );
}
