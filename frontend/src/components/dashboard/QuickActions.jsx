import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Warehouse,
  Grid3X3,
  FlaskConical,
  Sprout,
  Droplets,
  CreditCard,
  PlusCircle,
  PackageCheck,
  Receipt,
  TrendingUp,
  Wallet,
  PieChart,
} from 'lucide-react';
import Card from '../common/Card';

const ACTION_ICONS = {
  Warehouse,
  Grid3X3,
  FlaskConical,
  Sprout,
  Droplets,
  CreditCard,
  PackageCheck,
  Receipt,
  TrendingUp,
  Wallet,
  PieChart,
};

/**
 * QuickActions Component
 * Renders immediate operational action triggers for farms and fields.
 * @param {Object} props
 * @param {Array} props.actions
 */
export default function QuickActions({ actions = [] }) {
  const { t } = useTranslation();

  return (
    <Card
      title={t('dashboard.quickActions.title', 'Quick Actions')}
      subtitle={t('dashboard.quickActions.subtitle', 'Fast operational workflows and record logging')}
    >
      <div className="agri-quick-actions-grid">
        {actions.map((act) => {
          const IconComponent = ACTION_ICONS[act.icon] || PlusCircle;
          const actionTitle = act.titleKey ? t(act.titleKey, act.label) : t(`dashboard.quickActions.${act.id}.title`, act.label);
          const actionDesc = act.descriptionKey ? t(act.descriptionKey, act.description) : t(`dashboard.quickActions.${act.id}.description`, act.description);
          return (
            <Link
              key={act.id}
              to={act.path}
              className="agri-quick-action-btn"
              title={`${t('common.viewDetails', 'View details')}: ${actionTitle}`}
            >
              <div className="agri-quick-action-btn__icon">
                <IconComponent size={20} aria-hidden="true" />
              </div>
              <span className="agri-quick-action-btn__label">{actionTitle}</span>
              <span className="agri-quick-action-btn__desc">{actionDesc}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
