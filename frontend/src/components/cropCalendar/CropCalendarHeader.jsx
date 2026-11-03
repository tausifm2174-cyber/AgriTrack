import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sprout, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '../common';

/**
 * CropCalendarHeader component
 * Displays header title, operational agronomy badge, view toggle, and actions.
 */
export default function CropCalendarHeader({
  activeView = 'hybrid',
  onViewChange,
  onAddMilestone,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="agri-cal-header">
      <div className="agri-cal-header__left">
        <div className="agri-cal-header__badge">
          <Calendar size={16} aria-hidden="true" />
          <span>{t('cropCalendar.title', 'Agronomic Scheduling')}</span>
        </div>
        <h1 className="agri-cal-header__title">{t('cropCalendar.title', 'Crop Calendar')}</h1>
        <p className="agri-cal-header__desc">
          {t('cropCalendar.subtitle', 'Interactive schedule of crop growth stages, fertigation cycles, irrigation triggers, and expected harvest windows.')}
        </p>
      </div>

      <div className="agri-cal-header__actions">
        {/* View Toggle */}
        <div className="agri-cal-view-toggle" role="group" aria-label={t('cropCalendar.calendarView', 'Calendar view options')}>
          <button
            type="button"
            className={`agri-cal-toggle-btn ${activeView === 'hybrid' ? 'agri-cal-toggle-btn--active' : ''}`}
            onClick={() => onViewChange('hybrid')}
            aria-pressed={activeView === 'hybrid'}
          >
            <LayoutGrid size={15} aria-hidden="true" />
            <span>{t('cropCalendar.calendarView', 'Calendar Grid')}</span>
          </button>
          <button
            type="button"
            className={`agri-cal-toggle-btn ${activeView === 'list' ? 'agri-cal-toggle-btn--active' : ''}`}
            onClick={() => onViewChange('list')}
            aria-pressed={activeView === 'list'}
          >
            <List size={15} aria-hidden="true" />
            <span>{t('cropCalendar.timeline', 'Milestones List')}</span>
          </button>
        </div>

        <Button
          variant="outline"
          icon={<Sprout size={16} aria-hidden="true" />}
          onClick={() => navigate('/crops')}
        >
          {t('navigation.crops', 'Manage Crops')}
        </Button>

        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddMilestone}
        >
          {t('cropCalendar.addMilestone', 'Schedule Milestone')}
        </Button>
      </div>
    </header>
  );
}
