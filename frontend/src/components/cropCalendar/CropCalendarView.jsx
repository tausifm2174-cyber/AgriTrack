import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * CropCalendarView component
 * Interactive monthly agronomic calendar with event pills and date selection.
 *
 * @param {Object} props
 * @param {Array} props.events - List of calendar events
 * @param {string} [props.selectedDate] - Currently selected date string (YYYY-MM-DD)
 * @param {Function} props.onSelectDate - Callback when a date is clicked
 */
export default function CropCalendarView({
  events = [],
  selectedDate = '',
  onSelectDate,
}) {
  const { t, i18n } = useTranslation();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Map events to date strings
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      if (ev.date) {
        if (!map[ev.date]) map[ev.date] = [];
        map[ev.date].push(ev);
      }
    });
    return map;
  }, [events]);

  // Calendar matrix calculations
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];

    // Empty cells for preceding days
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      const dayEvents = eventsByDate[dateStr] || [];

      cells.push({
        empty: false,
        key: dateStr,
        dayNumber: day,
        dateString: dateStr,
        events: dayEvents,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }

    return cells;
  }, [currentYear, currentMonth, eventsByDate, selectedDate]);

  const monthYearLabel = useMemo(() => {
    try {
      const date = new Date(currentYear, currentMonth, 1);
      return new Intl.DateTimeFormat(i18n.language || 'en', { month: 'long', year: 'numeric' }).format(date);
    } catch {
      return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    }
  }, [currentYear, currentMonth, i18n.language]);

  return (
    <div className="agri-cal-grid-card">
      {/* Month Navigation Header */}
      <div className="agri-cal-month-nav">
        <div className="agri-cal-month-title">
          <CalendarIcon size={18} className="text-primary" aria-hidden="true" />
          <h2 className="agri-cal-month-heading">
            {monthYearLabel}
          </h2>
        </div>

        <div className="agri-cal-nav-buttons">
          <button
            type="button"
            className="agri-cal-nav-btn"
            onClick={handleGoToToday}
            title={t('common.today', 'Today')}
          >
            {t('common.today', 'Today')}
          </button>
          <button
            type="button"
            className="agri-cal-nav-arrow"
            onClick={handlePrevMonth}
            aria-label={t('common.previous', 'Previous month')}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="agri-cal-nav-arrow"
            onClick={handleNextMonth}
            aria-label={t('common.next', 'Next month')}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="agri-cal-weekdays-row" role="row">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="agri-cal-weekday" role="columnheader">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="agri-cal-days-grid" role="grid">
        {calendarCells.map((cell) => {
          if (cell.empty) {
            return <div key={cell.key} className="agri-cal-cell agri-cal-cell--empty" />;
          }

          const hasEvents = cell.events.length > 0;

          return (
            <div
              key={cell.key}
              role="gridcell"
              className={`agri-cal-cell ${cell.isToday ? 'agri-cal-cell--today' : ''} ${
                cell.isSelected ? 'agri-cal-cell--selected' : ''
              } ${hasEvents ? 'agri-cal-cell--has-events' : ''}`}
              onClick={() => onSelectDate(cell.isSelected ? '' : cell.dateString)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDate(cell.isSelected ? '' : cell.dateString);
                }
              }}
              aria-label={`${cell.dateString}${hasEvents ? `, ${cell.events.length} events` : ''}`}
            >
              <div className="agri-cal-cell-header">
                <span className="agri-cal-day-num">{cell.dayNumber}</span>
                {cell.isToday && <span className="agri-cal-today-pill">{t('common.today', 'Today')}</span>}
              </div>

              {/* Event Chips List */}
              <div className="agri-cal-chips-container">
                {cell.events.slice(0, 3).map((ev) => {
                  let chipColorClass = 'agri-cal-chip--green';
                  if (ev.eventType === 'irrigation') chipColorClass = 'agri-cal-chip--blue';
                  if (ev.eventType === 'harvest') chipColorClass = 'agri-cal-chip--purple';
                  if (ev.eventType === 'fertilizer') chipColorClass = 'agri-cal-chip--amber';

                  return (
                    <div
                      key={ev.id}
                      className={`agri-cal-chip ${chipColorClass}`}
                      title={`${ev.title} (${ev.fieldName})`}
                    >
                      <span className="agri-cal-chip-text">
                        {ev.crop}: {ev.stage || ev.category}
                      </span>
                    </div>
                  );
                })}
                {cell.events.length > 3 && (
                  <span className="agri-cal-more-chip">
                    +{cell.events.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
