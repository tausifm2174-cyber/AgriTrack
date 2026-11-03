import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  LayoutDashboard,
  Warehouse,
  Grid3X3,
  FlaskConical,
  Calendar,
  ClipboardList,
  Droplets,
  Compass,
  CloudSun,
  PackageCheck,
  Receipt,
  TrendingUp,
  CreditCard,
  Wallet,
  PieChart,
  Bell,
  User,
} from 'lucide-react';
import { NAVIGATION_GROUPS } from '../../utils/navigationConfig';
import { useNotifications } from '../../hooks/useNotifications';

const ICON_MAP = {
  LayoutDashboard,
  Warehouse,
  Grid3X3,
  FlaskConical,
  Sprout,
  Calendar,
  ClipboardList,
  Droplets,
  Compass,
  CloudSun,
  PackageCheck,
  Receipt,
  TrendingUp,
  CreditCard,
  Wallet,
  PieChart,
  Bell,
  User,
};

/**
 * Sidebar navigation component for AgriTrack
 * @param {Object} props
 * @param {Function} [props.onNavigate] - Callback invoked when a nav item is clicked
 */
export default function Sidebar({ onNavigate }) {
  const { t } = useTranslation();
  const { unreadCount = 0 } = useNotifications();

  const toCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  return (
    <aside className="agri-sidebar" aria-label={t('navigation.groups.system', 'Sidebar Navigation')}>
      {/* Brand Header */}
      <div className="agri-sidebar__brand">
        <div className="agri-sidebar__logo-badge">
          <Sprout size={22} className="agri-sidebar__brand-icon" aria-hidden="true" />
        </div>
        <div className="agri-sidebar__brand-text">
          <span className="agri-sidebar__brand-name">AgriTrack</span>
          <span className="agri-sidebar__brand-sub">{t('common.brandSub', 'Smart Farm Management')}</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="agri-sidebar__nav">
        {NAVIGATION_GROUPS.map((group) => {
          const groupKey = `navigation.groups.${toCamelCase(group.id)}`;
          return (
            <div key={group.id} className="agri-sidebar__group">
              <span className="agri-sidebar__group-title">{t(groupKey, group.label)}</span>
              <ul className="agri-sidebar__menu">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.icon] || Sprout;
                  const isNotif = item.id === 'notifications';
                  const itemKey = `navigation.${toCamelCase(item.id)}`;
                  return (
                    <li key={item.id} className="agri-sidebar__menu-item">
                      <NavLink
                        to={item.path}
                        onClick={() => onNavigate && onNavigate()}
                        className={({ isActive }) =>
                          `agri-sidebar-link ${isActive ? 'agri-sidebar-link--active' : ''}`
                        }
                      >
                        <IconComponent size={18} className="agri-sidebar-link__icon" aria-hidden="true" />
                        <span className="agri-sidebar-link__label">{t(itemKey, item.label)}</span>
                        {isNotif && unreadCount > 0 && (
                          <span
                            className="agri-bell-badge"
                            style={{
                              position: 'static',
                              marginLeft: 'auto',
                              transform: 'none',
                            }}
                            aria-label={`${unreadCount} ${t('topbar.unread', 'unread')}`}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="agri-sidebar__footer">
        <div className="agri-sidebar__system-status">
          <span className="agri-status-dot" aria-hidden="true" />
          <span className="agri-status-text">AgriTrack SaaS v1.0</span>
        </div>
      </div>
    </aside>
  );
}
