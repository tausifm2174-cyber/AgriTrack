import { Link } from 'react-router-dom';

/**
 * KPI Summary Card component
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.value
 * @param {string} [props.subValue]
 * @param {React.ReactNode} props.icon
 * @param {'green' | 'blue' | 'amber' | 'emerald'} [props.iconColor='green']
 * @param {string} [props.badge]
 * @param {'success' | 'warning' | 'info' | 'neutral'} [props.badgeVariant='neutral']
 * @param {string} [props.to]
 */
export default function KpiCard({
  title,
  value,
  subValue,
  icon,
  iconColor = 'green',
  badge,
  badgeVariant = 'neutral',
  to,
}) {
  const content = (
    <div className="agri-kpi-card">
      <div className="agri-kpi-card__top">
        <span className="agri-kpi-card__title">{title}</span>
        <div className={`agri-kpi-card__icon-wrap agri-kpi-card__icon-wrap--${iconColor}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="agri-kpi-card__value">{value}</div>
        <div className="agri-kpi-card__sub">
          {subValue && <span>{subValue}</span>}
          {badge && (
            <span className={`agri-badge agri-badge--${badgeVariant} agri-kpi-card__badge`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
