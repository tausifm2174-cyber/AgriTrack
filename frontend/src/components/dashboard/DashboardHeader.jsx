import { Calendar, Clock, Activity } from 'lucide-react';

/**
 * Dashboard Header component
 * @param {Object} props
 * @param {Object} props.farmer
 * @param {string} [props.farmer.name]
 * @param {string} [props.farmer.greeting]
 * @param {string} [props.farmer.subtitle]
 * @param {string} [props.farmer.lastUpdated]
 */
export default function DashboardHeader({ farmer }) {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="agri-dash-header">
      <div className="agri-dash-header__left">
        <div className="agri-dash-header__badge">
          <Activity size={12} aria-hidden="true" />
          <span>AgriTrack Operational Command Center</span>
        </div>
        <h1 className="agri-dash-header__title">
          {farmer?.greeting || `Welcome back, ${farmer?.name || 'Farmer'}`}
        </h1>
        <p className="agri-dash-header__subtitle">
          {farmer?.subtitle || 'Monitor your farms, crops, weather, irrigation, markets and financial performance from one place.'}
        </p>
      </div>

      <div className="agri-dash-header__right">
        <div className="agri-dash-header__date-pill">
          <Calendar size={15} className="text-primary" aria-hidden="true" />
          <span>Today, {currentDate}</span>
        </div>
        <div className="agri-dash-header__updated">
          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
          <span>Last updated: {farmer?.lastUpdated || 'Just now (Demo)'}</span>
        </div>
      </div>
    </div>
  );
}
