import { Link } from 'react-router-dom';
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
  return (
    <Card
      title="Quick Actions"
      subtitle="Fast operational workflows and record logging"
    >
      <div className="agri-quick-actions-grid">
        {actions.map((act) => {
          const IconComponent = ACTION_ICONS[act.icon] || PlusCircle;
          return (
            <Link
              key={act.id}
              to={act.path}
              className="agri-quick-action-btn"
              title={`Navigate to ${act.label}`}
            >
              <div className="agri-quick-action-btn__icon">
                <IconComponent size={20} aria-hidden="true" />
              </div>
              <span className="agri-quick-action-btn__label">{act.label}</span>
              <span className="agri-quick-action-btn__desc">{act.description}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
