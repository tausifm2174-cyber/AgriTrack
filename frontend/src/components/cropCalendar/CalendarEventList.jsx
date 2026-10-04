import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Sprout, Grid3X3, ArrowRight } from 'lucide-react';
import { StatusBadge, Button, EmptyState } from '../common';

/**
 * CalendarEventList component
 * Displays upcoming crop milestones and scheduled agronomic tasks.
 *
 * @param {Object} props
 * @param {Array} props.events - List of milestone events
 * @param {string} [props.selectedDate] - Currently filtered date if any
 * @param {Function} [props.onClearDateFilter] - Callback to clear selected date
 */
export default function CalendarEventList({
  events = [],
  selectedDate = '',
  onClearDateFilter,
}) {
  const navigate = useNavigate();

  const handleGoToCrop = (fieldId) => {
    if (fieldId) {
      navigate(`/crops?fieldId=${encodeURIComponent(fieldId)}`);
    } else {
      navigate('/crops');
    }
  };

  return (
    <div className="agri-cal-list-section">
      <div className="agri-cal-list-header">
        <div>
          <h3 className="agri-cal-list-title">Upcoming Crop Milestones</h3>
          <p className="agri-cal-list-subtitle">
            {selectedDate
              ? `Showing scheduled activities for ${selectedDate}`
              : 'Chronological timeline of crop lifecycle stages and field management activities'}
          </p>
        </div>

        {selectedDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearDateFilter}
          >
            Show All Dates
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="agri-cal-list-empty">
          <EmptyState
            icon={<Calendar size={36} aria-hidden="true" />}
            title="No milestones scheduled"
            description="No agronomic events match the currently selected date or filters."
            action={
              selectedDate && (
                <Button variant="outline" size="sm" onClick={onClearDateFilter}>
                  View All Scheduled Milestones
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="agri-cal-events-stack">
          {events.map((event) => {
            let typeColorClass = 'agri-cal-event-pill--green';
            if (event.eventType === 'irrigation') typeColorClass = 'agri-cal-event-pill--blue';
            if (event.eventType === 'harvest') typeColorClass = 'agri-cal-event-pill--purple';
            if (event.eventType === 'fertilizer') typeColorClass = 'agri-cal-event-pill--amber';

            return (
              <article key={event.id} className="agri-cal-event-card">
                {/* Left Date Column */}
                <div className="agri-cal-event-card__date-col">
                  <div className="agri-cal-event-card__badge-date">
                    <Clock size={13} aria-hidden="true" />
                    <span>{event.displayDate || event.date}</span>
                  </div>
                  <span className={`agri-cal-event-pill ${typeColorClass}`}>
                    {event.category || event.eventType}
                  </span>
                </div>

                {/* Center Content */}
                <div className="agri-cal-event-card__main">
                  <div className="agri-cal-event-card__title-row">
                    <h4 className="agri-cal-event-card__title">{event.title}</h4>
                    <StatusBadge variant={event.statusVariant || 'info'}>
                      {event.status}
                    </StatusBadge>
                  </div>

                  {/* Field & Crop Subtitle */}
                  <div className="agri-cal-event-card__context">
                    <span className="agri-cal-event-card__field">
                      <Grid3X3 size={13} aria-hidden="true" />
                      <strong>{event.fieldName}</strong> ({event.farmName})
                    </span>
                    <span className="agri-cal-event-card__dot">•</span>
                    <span className="agri-cal-event-card__crop">
                      <Sprout size={13} className="text-primary" aria-hidden="true" />
                      <span>{event.crop} {event.variety ? `– ${event.variety}` : ''}</span>
                    </span>
                    {event.stage && (
                      <>
                        <span className="agri-cal-event-card__dot">•</span>
                        <span className="agri-cal-event-card__stage">
                          Stage: <strong>{event.stage}</strong>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="agri-cal-event-card__desc">{event.description}</p>
                  )}
                </div>

                {/* Right Action Button */}
                <div className="agri-cal-event-card__action">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowRight size={14} aria-hidden="true" />}
                    onClick={() => handleGoToCrop(event.fieldId)}
                  >
                    Crop Details
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
