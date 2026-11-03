import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbsForPath } from '../../utils/navigationConfig';

const CRUMB_KEYS = {
  'Dashboard': 'navigation.dashboard',
  'Farms': 'navigation.farms',
  'Fields': 'navigation.fields',
  'Soil Records': 'navigation.soil',
  'Crops': 'navigation.crops',
  'Crop Calendar': 'navigation.cropCalendar',
  'Activities': 'navigation.activities',
  'Irrigation': 'navigation.irrigation',
  'Weather': 'navigation.weather',
  'Recommendations': 'navigation.recommendations',
  'Harvests': 'navigation.harvests',
  'Sales': 'navigation.sales',
  'Market Prices': 'navigation.marketPrices',
  'Expenses': 'navigation.expenses',
  'Revenue': 'navigation.revenue',
  'Profit & Loss': 'navigation.profitLoss',
  'Notifications': 'navigation.notifications',
  'Profile': 'navigation.profile',
  'Overview': 'navigation.groups.overview',
  'Farm Management': 'navigation.groups.farmManagement',
  'Agronomy': 'navigation.groups.agronomy',
  'Weather & Insights': 'navigation.groups.weatherInsights',
  'Harvest & Trade': 'navigation.groups.harvestTrade',
  'Finance': 'navigation.groups.finance',
  'System': 'navigation.groups.system',
};

/**
 * Reusable dynamic Breadcrumbs component based on route metadata
 */
export default function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsForPath(location.pathname);

  const getLabel = (label) => {
    const key = CRUMB_KEYS[label];
    return key ? t(key, label) : label;
  };

  return (
    <nav aria-label={t('navigation.breadcrumb', 'Breadcrumb')} className="agri-breadcrumbs">
      <ol className="agri-breadcrumbs__list">
        <li className="agri-breadcrumbs__item">
          <Link to="/dashboard" className="agri-breadcrumbs__home-link" title={t('navigation.dashboard', 'Dashboard')}>
            <Home size={14} aria-hidden="true" />
            <span className="sr-only">{t('navigation.dashboard', 'Dashboard')}</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const label = getLabel(crumb.label);
          return (
            <li key={index} className="agri-breadcrumbs__item">
              <ChevronRight size={13} className="agri-breadcrumbs__separator" aria-hidden="true" />
              {isLast || !crumb.path ? (
                <span
                  className={`agri-breadcrumbs__label ${isLast ? 'agri-breadcrumbs__label--current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {label}
                </span>
              ) : (
                <Link to={crumb.path} className="agri-breadcrumbs__link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
