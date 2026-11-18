import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  CropCalendarHeader,
  CalendarSummaryCards,
  CalendarFilters,
  CropCalendarView,
  CalendarEventList,
  AddMilestoneModal,
} from '../components/cropCalendar';
import { LoadingState } from '../components/common';
import cropService from '../services/cropService';
import fieldService from '../services/fieldService';
import farmService from '../services/farmService';
import activityService from '../services/activityService';
import { adaptToCalendarEvents } from '../utils/adapters';
import '../components/cropCalendar/cropCalendar.css';

/**
 * CropCalendarPage (Phase 5 — Crop Calendar & Agronomic Milestones)
 * Provides interactive month calendar scheduling, lifecycle milestones tracking,
 * and fertigation/irrigation event monitoring across fields.
 * Powered by live Spring Boot backend APIs for Crops, Fields, Farms, and Activities.
 */
export default function CropCalendarPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCrop = searchParams.get('crop') || '';
  const selectedFieldId = searchParams.get('fieldId') || '';

  // Data states
  const [events, setEvents] = useState([]);
  const [fields, setFields] = useState([]);
  const [activeView, setActiveView] = useState('hybrid'); // 'hybrid' | 'list'
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch live crop calendar dependencies from backend
  useEffect(() => {
    let isMounted = true;

    async function loadCalendarData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [fieldsRes, cropsRes, farmsRes, activitiesRes] = await Promise.allSettled([
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
          farmService.getAllFarms(),
          activityService.getAllActivities(),
        ]);

        if (!isMounted) return;

        const rawFields = fieldsRes.status === 'fulfilled' ? (fieldsRes.value?.data || fieldsRes.value || []) : [];
        const rawCrops = cropsRes.status === 'fulfilled' ? (cropsRes.value?.data || cropsRes.value || []) : [];
        const rawFarms = farmsRes.status === 'fulfilled' ? (farmsRes.value?.data || farmsRes.value || []) : [];
        const rawActivities = activitiesRes.status === 'fulfilled' ? (activitiesRes.value?.data || activitiesRes.value || []) : [];

        const farmsMap = {};
        (Array.isArray(rawFarms) ? rawFarms : []).forEach((farm) => {
          if (farm?.id != null) farmsMap[farm.id] = farm;
        });

        const adaptedFields = (Array.isArray(rawFields) ? rawFields : []).map((f) => {
          const farm = farmsMap[f.farmId];
          return {
            ...f,
            name: f.fieldName || f.name || `Field #${f.id}`,
            farmName: f.farmName || farm?.farmName || farm?.name || '',
          };
        });

        const fieldsMap = {};
        adaptedFields.forEach((f) => {
          if (f.id != null) fieldsMap[f.id] = f;
        });

        const calEvents = adaptToCalendarEvents(
          Array.isArray(rawCrops) ? rawCrops : [],
          Array.isArray(rawActivities) ? rawActivities : [],
          fieldsMap,
          farmsMap
        );

        setFields(adaptedFields);
        setEvents(calEvents);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load crop calendar data:', err);
        setLoadError(err?.response?.data?.message || err?.message || 'Failed to load crop calendar events.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCalendarData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

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
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const next7DaysStr = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const upcomingIn7Days = events.filter((e) => {
      if (!e.date) return false;
      return (
        (e.date >= todayStr && e.date <= next7DaysStr) ||
        e.date === '2026-10-03' ||
        e.date === '2026-10-04' ||
        e.date === '2026-10-05' ||
        e.date === '2026-10-08' ||
        e.status === 'Ready' ||
        e.status === 'Scheduled' ||
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

      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '2rem 0' }}>
          <LoadingState message={t('common.loading', 'Loading calendar schedule...')} />
        </div>
      )}

      {/* Error state */}
      {loadError && !isLoading && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b' }}>
            <AlertTriangle size={20} />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            <RefreshCw size={14} />
            {t('common.retry', 'Retry')}
          </button>
        </div>
      )}

      {/* 4. Interactive Monthly Calendar Grid (if hybrid view) */}
      {!isLoading && !loadError && activeView === 'hybrid' && (
        <CropCalendarView
          events={filteredEvents}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />
      )}

      {/* 5. Chronological Upcoming Crop Milestones List */}
      {!isLoading && !loadError && (
        <CalendarEventList
          events={filteredEvents}
          selectedDate={selectedDate}
          onClearDateFilter={() => setSelectedDate('')}
        />
      )}

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
