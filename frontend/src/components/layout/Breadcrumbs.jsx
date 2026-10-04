import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbsForPath } from '../../utils/navigationConfig';

/**
 * Reusable dynamic Breadcrumbs component based on route metadata
 */
export default function Breadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsForPath(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="agri-breadcrumbs">
      <ol className="agri-breadcrumbs__list">
        <li className="agri-breadcrumbs__item">
          <Link to="/dashboard" className="agri-breadcrumbs__home-link" title="Dashboard">
            <Home size={14} aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="agri-breadcrumbs__item">
              <ChevronRight size={13} className="agri-breadcrumbs__separator" aria-hidden="true" />
              {isLast || !crumb.path ? (
                <span
                  className={`agri-breadcrumbs__label ${isLast ? 'agri-breadcrumbs__label--current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="agri-breadcrumbs__link">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
