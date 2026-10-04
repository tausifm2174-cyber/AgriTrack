import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cropCalendarEvents } from '../data/cropData';
import { fieldData } from '../data/fieldData';
import {
  CropCalendarHeader,
  CalendarSummaryCards,
  CalendarFilters,
  CropCalendarView,
  CalendarEventList,
  AddMilestoneModal,
} from '../components/cropCalendar';
import '../components/cropCalendar/cropCalendar.css';

/**
 * CropCalendarPage (Phase 5 — Crop Calendar & Agronomic Milestones)
 * Provides interactive month calendar scheduling, lifecycle milestones tracking,
 * and fertigation/irrigation event monitoring across fields.
 */
export default function CropCalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCrop = searchParams.get('crop') || '';
  const selectedFieldId = searchParams.get('fieldId') || '';

  // Local state
  const [events, setEvents] = useState(cropCalendarEvents);
  const [fields] = useState(fieldData.fields);
  const [activeView, setActiveView] = useState('hybrid'); // 'hybrid' | 'list'

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle crop change
  const handleCropChange = (crop) => {
    const newParams = {};
    if (crop) newParams.crop = crop;
    if (selectedFieldId) newParams.fieldId = selectedFieldId;
    setSearchParams(newParams);
  };

  // Handle field change
  const handleFieldChange = (fieldId) => {
    const newParams = {};
    if (selectedCrop) newParams.crop = selectedCrop;
    if (fieldId) newParams.fieldId = fieldId;
    setSearchParams(newParams);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedEventType('');
    setSelectedStatus('');
    setSelectedDate('');
    setSearchParams({});
  };

  const isFiltered = Boolean(
    searchQuery ||
    selectedCrop ||
    selectedFieldId ||
    selectedEventType ||
    selectedStatus ||
    selectedDate
  );

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = (ev.title || '').toLowerCase().includes(q);
        const matchesCrop = (ev.crop || '').toLowerCase().includes(q);
        const matchesField = (ev.fieldName || '').toLowerCase().includes(q);
        const matchesCategory = (ev.category || '').toLowerCase().includes(q);
        const matchesDesc = (ev.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesCrop && !matchesField && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Crop
      if (selectedCrop && ev.crop !== selectedCrop) {
        return false;
      }

      // 3. Field
      if (selectedFieldId && ev.fieldId !== selectedFieldId) {
        return false;
      }

      // 4. Event Type
      if (selectedEventType && ev.eventType !== selectedEventType) {
        return false;
      }

      // 5. Status
      if (selectedStatus && ev.status !== selectedStatus) {
        return false;
      }

      // 6. Selected Date (from calendar click)
      if (selectedDate && ev.date !== selectedDate) {
        return false;
      }

      return true;
    });
  }, [
    events,
    searchQuery,
    selectedCrop,
    selectedFieldId,
    selectedEventType,
    selectedStatus,
    selectedDate,
  ]);

  // Calendar summary metrics
  const summary = useMemo(() => {
    const totalEvents = events.length;
    // Calculate upcoming within 7 days relative to October 3, 2026
    const upcomingIn7Days = events.filter((e) => {
      if (!e.date) return false;
      return (
        e.date === '2026-10-03' ||
        e.date === '2026-10-04' ||
        e.date === '2026-10-05' ||
        e.date === '2026-10-08' ||
        e.status === 'Ready' ||
        e.displayDate?.includes('Tomorrow') ||
        e.displayDate?.includes('Today')
      );
    }).length;

    const farmInputsCount = events.filter(
      (e) => e.eventType === 'fertilizer' || e.eventType === 'irrigation'
    ).length;

    const harvestWindowsCount = events.filter(
      (e) => e.eventType === 'harvest' || e.stage === 'Harvest Readiness'
    ).length;

    return {
      totalEvents,
      upcomingIn7Days,
      farmInputsCount,
      harvestWindowsCount,
    };
  }, [events]);

  const handleMilestoneAdded = (newMilestone) => {
    setEvents((prev) => [newMilestone, ...prev]);
  };

  return (
    <div className="agri-crop-calendar-page">
      {/* 1. Header with View Switcher */}
      <CropCalendarHeader
        activeView={activeView}
        onViewChange={setActiveView}
        onAddMilestone={() => setIsAddModalOpen(true)}
      />

      {/* 2. 4 Agronomic Summary KPI Cards */}
      <CalendarSummaryCards summary={summary} />

      {/* 3. Toolbar with Search and Filters */}
      <CalendarFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCrop={selectedCrop}
        onCropChange={handleCropChange}
        selectedFieldId={selectedFieldId}
        onFieldChange={handleFieldChange}
        selectedEventType={selectedEventType}
        onEventTypeChange={setSelectedEventType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        fields={fields}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* 4. Interactive Monthly Calendar Grid (if hybrid view) */}
      {activeView === 'hybrid' && (
        <CropCalendarView
          events={filteredEvents}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />
      )}

      {/* 5. Chronological Upcoming Crop Milestones List */}
      <CalendarEventList
        events={filteredEvents}
        selectedDate={selectedDate}
        onClearDateFilter={() => setSelectedDate('')}
      />

      {/* 6. Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMilestoneAdded={handleMilestoneAdded}
        fields={fields}
      />
    </div>
  );
}
