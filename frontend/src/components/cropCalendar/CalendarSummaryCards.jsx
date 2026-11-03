import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Droplets, PackageCheck } from 'lucide-react';

/**
 * CalendarSummaryCards component
 * Displays agronomic schedule metrics.
 */
export default function CalendarSummaryCards({ summary = {} }) {
  const { t } = useTranslation();
  const {
    totalEvents = 0,
    upcomingIn7Days = 0,
    farmInputsCount = 0,
    harvestWindowsCount = 0,
  } = summary;

  return (
    <section className="agri-cal-summary-grid" aria-label={t('cropCalendar.title', 'Agronomic Calendar Summary Metrics')}>
      {/* 1. Total Scheduled Milestones */}
      <div className="agri-cal-summary-card">
        <div className="agri-cal-summary-icon agri-cal-summary-icon--green">
          <Calendar size={22} aria-hidden="true" />
        </div>
        <div className="agri-cal-summary-info">
          <span className="agri-cal-summary-label">{t('cropCalendar.milestoneName', 'Total Milestones')}</span>
          <span className="agri-cal-summary-value">{totalEvents}</span>
          <span className="agri-cal-summary-sub">{t('crops.season', 'Full seasonal cycle schedule')}</span>
        </div>
      </div>

      {/* 2. Upcoming in 7 Days */}
      <div className="agri-cal-summary-card">
        <div className="agri-cal-summary-icon agri-cal-summary-icon--amber">
          <Clock size={22} aria-hidden="true" />
        </div>
        <div className="agri-cal-summary-info">
          <span className="agri-cal-summary-label">{t('status.pending', 'Upcoming (7 Days)')}</span>
          <span className="agri-cal-summary-value">{upcomingIn7Days}</span>
          <span className="agri-cal-summary-sub">{t('common.status', 'Immediate operational attention')}</span>
        </div>
      </div>

      {/* 3. Critical Farm Inputs */}
      <div className="agri-cal-summary-card">
        <div className="agri-cal-summary-icon agri-cal-summary-icon--blue">
          <Droplets size={22} aria-hidden="true" />
        </div>
        <div className="agri-cal-summary-info">
          <span className="agri-cal-summary-label">{t('irrigation.title', 'Fertilizer & Irrigation')}</span>
          <span className="agri-cal-summary-value">{farmInputsCount}</span>
          <span className="agri-cal-summary-sub">{t('activityTypes.fertilization', 'Nutrition & water applications')}</span>
        </div>
      </div>

      {/* 4. Harvest Windows */}
      <div className="agri-cal-summary-card">
        <div className="agri-cal-summary-icon agri-cal-summary-icon--purple">
          <PackageCheck size={22} aria-hidden="true" />
        </div>
        <div className="agri-cal-summary-info">
          <span className="agri-cal-summary-label">{t('stages.harvestReadiness', 'Harvest Windows')}</span>
          <span className="agri-cal-summary-value">{harvestWindowsCount}</span>
          <span className="agri-cal-summary-sub">{t('stages.ripening', 'Combine & manual crop cuts')}</span>
        </div>
      </div>
    </section>
  );
}
