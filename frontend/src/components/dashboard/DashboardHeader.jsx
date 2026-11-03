import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Activity } from 'lucide-react';
import { translateTime } from '../../utils/displayLabels';

/**
 * Dashboard Header component
 * @param {Object} props
 * @param {Object} props.farmer
 */
export default function DashboardHeader({ farmer }) {
  const { t, i18n } = useTranslation();
  const currentDate = new Intl.DateTimeFormat(i18n.language || 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const greeting = farmer?.name
    ? `${t('dashboard.welcome', 'Welcome back')}, ${farmer.name}`
    : t('dashboard.welcome', 'Welcome back');

  return (
    <div className="agri-dash-header">
      <div className="agri-dash-header__left">
        <div className="agri-dash-header__badge">
          <Activity size={12} aria-hidden="true" />
          <span>{t('navigation.dashboard', 'AgriTrack Command Center')}</span>
        </div>
        <h1 className="agri-dash-header__title">{greeting}</h1>
        <p className="agri-dash-header__subtitle">
          {t('dashboard.greetingSubtitle', farmer?.subtitle || 'Monitor your farms, crops, weather, irrigation, markets and financial performance.')}
        </p>
      </div>

      <div className="agri-dash-header__right">
        <div className="agri-dash-header__date-pill">
          <Calendar size={15} className="text-primary" aria-hidden="true" />
          <span>{currentDate}</span>
        </div>
        <div className="agri-dash-header__updated">
          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
          <span>{translateTime(farmer?.lastUpdated, t) || t('common.active', 'Active')}</span>
        </div>
      </div>
    </div>
  );
}
