import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Droplets, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import {
  IrrigationHeader,
  IrrigationSummaryCards,
  IrrigationAdvisory,
  UpcomingIrrigation,
  IrrigationFilters,
  IrrigationTable,
  IrrigationCard,
  IrrigationDetailsModal,
  AddIrrigationModal,
} from '../components/irrigation';
import { Button } from '../components/common';
import { getIrrigationSummary } from '../data/irrigationData';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import irrigationService from '../services/irrigationService';
import { adaptIrrigation, adaptField, adaptFarm } from '../utils/adapters';
import '../components/irrigation/irrigation.css';

/**
 * IrrigationPage Component
 * Full-featured Precision Irrigation Management and Water Delivery Console.
 * Integrates live Spring Boot backend APIs for Farms, Fields, Crops, and Precision Irrigation.
 */
export default function IrrigationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId') || '';
  const urlFarmId = searchParams.get('farmId') || '';

  // Data states
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state initialized from URL query parameters if present
  const [filters, setFilters] = useState(() => ({
    search: '',
    farmId: urlFarmId,
    fieldId: urlFieldId,
    cropName: '',
    method: '',
    status: '',
    priority: '',
    date: '',
  }));

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [selectedScheduleForDetails, setSelectedScheduleForDetails] = useState(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Fast indexing lookup maps
  const farmsMap = useMemo(() => {
    return farms.reduce((acc, f) => {
      acc[f.id] = f;
      return acc;
    }, {});
  }, [farms]);

  const fieldsMap = useMemo(() => {
    return fields.reduce((acc, f) => {
      acc[f.id] = f;
      return acc;
    }, {});
  }, [fields]);

  // Load all live data in parallel
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [farmsRes, fieldsRes, cropsRes, schedulesRes] = await Promise.all([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
          irrigationService.getAllIrrigations(),
        ]);

        if (!isMounted) return;

        const rawFarms = Array.isArray(farmsRes) ? farmsRes : (farmsRes?.data?.data || farmsRes?.data || []);
        const rawFields = Array.isArray(fieldsRes) ? fieldsRes : (fieldsRes?.data?.data || fieldsRes?.data || []);
        const rawCrops = Array.isArray(cropsRes) ? cropsRes : (cropsRes?.data?.data || cropsRes?.data || []);
        const rawSchedules = Array.isArray(schedulesRes) ? schedulesRes : (schedulesRes?.data?.data || schedulesRes?.data || []);

        const adaptedFarms = rawFarms.map((f) => adaptFarm(f, rawFields)).filter(Boolean);
        const adaptedFields = rawFields.map((f) => adaptField(f, rawCrops)).filter(Boolean);

        const fMap = adaptedFarms.reduce((acc, f) => {
          acc[f.id] = f;
          return acc;
        }, {});

        const flMap = adaptedFields.reduce((acc, f) => {
          acc[f.id] = f;
          return acc;
        }, {});

        const adaptedSchedules = rawSchedules.map((s) => adaptIrrigation(s, flMap, fMap)).filter(Boolean);

        setFarms(adaptedFarms);
        setFields(adaptedFields);
        setCrops(rawCrops);
        setSchedules(adaptedSchedules);
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err.response?.data?.message || err.message || t('irrigation.loadError', 'Failed to load irrigation schedules.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, t]);

  // Toast helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filter change handlers
  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      farmId: '',
      fieldId: '',
      cropName: '',
      method: '',
      status: '',
      priority: '',
      date: '',
    });
  };

  const handleRetry = () => {
    setRefreshKey((k) => k + 1);
  };

  // Summary counts based on live schedules
  const summaryMetrics = useMemo(() => {
    return getIrrigationSummary(schedules);
  }, [schedules]);

  // Filtered schedules computation
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Search text match
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const farmName = (item.farmName || farmsMap[item.farmId]?.name || '').toLowerCase();
        const fieldName = (item.fieldName || fieldsMap[item.fieldId]?.name || '').toLowerCase();
        const matchesTitle = (item.title || '').toLowerCase().includes(query);
        const matchesCrop = (item.cropName || '').toLowerCase().includes(query);
        const matchesMethod = (item.irrigationMethod || '').toLowerCase().includes(query);
        const matchesNotes = (item.notes || '').toLowerCase().includes(query);
        const matchesLocation = farmName.includes(query) || fieldName.includes(query);

        if (!matchesTitle && !matchesCrop && !matchesMethod && !matchesNotes && !matchesLocation) {
          return false;
        }
      }

      // Farm filter
      if (filters.farmId && String(item.farmId) !== String(filters.farmId)) {
        return false;
      }

      // Field filter
      if (filters.fieldId && String(item.fieldId) !== String(filters.fieldId)) {
        return false;
      }

      // Crop filter
      if (filters.cropName && item.cropName !== filters.cropName) {
        return false;
      }

      // Method filter
      if (filters.method && item.irrigationMethod !== filters.method) {
        return false;
      }

      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && item.priority !== filters.priority) {
        return false;
      }

      // Date filter
      if (filters.date && item.scheduledDate !== filters.date) {
        return false;
      }

      return true;
    });
  }, [schedules, filters, farmsMap, fieldsMap]);

  // Modal actions
  const handleOpenAddModal = () => {
    setScheduleToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (schedule) => {
    setScheduleToEdit(schedule);
    setIsAddEditModalOpen(true);
    if (selectedScheduleForDetails) {
      setSelectedScheduleForDetails(null);
    }
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setScheduleToEdit(null);
  };

  const handleSaveSchedule = (savedSchedule, isEdit) => {
    const adapted = adaptIrrigation(savedSchedule, fieldsMap, farmsMap);
    if (isEdit) {
      setSchedules((prev) =>
        prev.map((item) => (String(item.id) === String(adapted.id) ? adapted : item))
      );
      showToast(`${t('alerts.activityUpdated', 'Schedule updated')}: ${adapted.title}`);
    } else {
      setSchedules((prev) => [adapted, ...prev]);
      showToast(`${t('alerts.irrigationScheduled', 'Irrigation scheduled')}: ${adapted.title}`);
    }
  };

  // View details modal
  const handleViewSchedule = (schedule) => {
    setSelectedScheduleForDetails(schedule);
  };

  const handleCloseDetailsModal = () => {
    setSelectedScheduleForDetails(null);
  };

  // Cancel schedule (sets status to Cancelled on backend)
  const handleCancelSchedule = async (schedule) => {
    const confirmed = window.confirm(
      `${t('irrigation.cancelWarning', 'Are you sure you want to cancel this scheduled irrigation run?')}\n\n"${schedule.title}"`
    );
    if (!confirmed) return;

    try {
      const payload = {
        title: schedule.title,
        irrigationMethod: schedule.irrigationMethod,
        status: 'Cancelled',
        priority: schedule.priority,
        scheduledDate: schedule.scheduledDate,
        scheduledTime: schedule.scheduledTime,
        durationMinutes: schedule.durationMinutes,
        waterVolumeLitres: schedule.waterVolumeLitres,
        soilMoisture: schedule.soilMoisture,
        weatherCondition: schedule.weatherCondition,
        rainfallExpected: schedule.rainfallExpected,
        completedAt: null,
        notes: schedule.notes,
        cropCycleId: schedule.cropCycleId,
      };

      const updated = await irrigationService.updateIrrigation(schedule.id, payload);
      const adapted = adaptIrrigation(updated, fieldsMap, farmsMap);

      setSchedules((prev) =>
        prev.map((item) => (String(item.id) === String(adapted.id) ? adapted : item))
      );
      if (selectedScheduleForDetails && String(selectedScheduleForDetails.id) === String(schedule.id)) {
        setSelectedScheduleForDetails(adapted);
      }
      showToast(`${t('status.cancelled', 'Cancelled')}: ${schedule.title}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || t('common.error'));
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (schedule) => {
    const confirmed = window.confirm(
      `${t('irrigation.deleteWarning', 'Are you sure you want to delete this irrigation schedule? This action cannot be undone.')}\n\n"${schedule.title}"`
    );
    if (!confirmed) return;

    try {
      await irrigationService.deleteIrrigation(schedule.id);
      setSchedules((prev) => prev.filter((item) => String(item.id) !== String(schedule.id)));
      if (selectedScheduleForDetails && String(selectedScheduleForDetails.id) === String(schedule.id)) {
        setSelectedScheduleForDetails(null);
      }
      showToast(`${t('alerts.itemDeleted', 'Item deleted')}: ${schedule.title}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || t('common.error'));
    }
  };

  return (
    <div className="agri-irrigation-page">
      {/* 1. Page Header with Schedule Action */}
      <IrrigationHeader onScheduleIrrigation={handleOpenAddModal} />

      {/* 2. Error Banner */}
      {loadError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            backgroundColor: 'var(--danger-bg, #fef2f2)',
            border: '1px solid var(--danger-border, #fecaca)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-text, #991b1b)',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} aria-hidden="true" />
            <span>{loadError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry} style={{ gap: '0.35rem' }}>
            <RefreshCw size={14} aria-hidden="true" />
            <span>{t('common.retry', 'Retry')}</span>
          </Button>
        </div>
      )}

      {/* 3. Interactive KPI Summary Cards */}
      <IrrigationSummaryCards
        summary={summaryMetrics}
        activeStatusFilter={filters.status}
        onStatusFilterChange={(status) => handleFilterChange({ status })}
      />

      {/* 4. Weather-Aware Irrigation Advisory Section */}
      <IrrigationAdvisory
        selectedFarmId={filters.farmId}
        farmsMap={farmsMap}
      />

      {/* 5. Today's & Upcoming Irrigation Highlight Section */}
      <UpcomingIrrigation
        schedules={schedules}
        onViewSchedule={handleViewSchedule}
        fieldsMap={fieldsMap}
      />

      {/* 6. Multi-Criteria Filter Toolbar */}
      <IrrigationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        farms={farms}
        fields={fields}
        crops={crops}
        totalResultsCount={filteredSchedules.length}
      />

      {/* 7. Loading Skeletons */}
      {isLoading ? (
        <div className="agri-irrigation-cards-grid" style={{ width: '100%' }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                height: '180px',
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: 'pulse 1.5s infinite',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--slate-200)',
              }}
            />
          ))}
        </div>
      ) : filteredSchedules.length > 0 ? (
        <>
          {/* Desktop & Tablet Table */}
          <div className="agri-desktop-table-only">
            <IrrigationTable
              schedules={filteredSchedules}
              onViewSchedule={handleViewSchedule}
              onEditSchedule={handleOpenEditModal}
              onDeleteSchedule={handleDeleteSchedule}
              onCancelSchedule={handleCancelSchedule}
              farmsMap={farmsMap}
              fieldsMap={fieldsMap}
            />
          </div>

          {/* Mobile Cards */}
          <div className="agri-mobile-cards-only">
            <div className="agri-irrigation-cards-grid" style={{ width: '100%' }}>
              {filteredSchedules.map((schedule) => (
                <IrrigationCard
                  key={schedule.id}
                  schedule={schedule}
                  onViewSchedule={handleViewSchedule}
                  onEditSchedule={handleOpenEditModal}
                  onDeleteSchedule={handleDeleteSchedule}
                  onCancelSchedule={handleCancelSchedule}
                  farmsMap={farmsMap}
                  fieldsMap={fieldsMap}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="agri-irrigation-empty">
          <div className="agri-irrigation-empty__icon" aria-hidden="true">
            <Droplets size={28} />
          </div>
          <h3 className="agri-irrigation-empty__title">{t('irrigation.noSchedules', t('common.noData'))}</h3>
          <p className="agri-irrigation-empty__text">
            {Object.values(filters).some(Boolean)
              ? t('common.noData')
              : t('irrigation.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {Object.values(filters).some(Boolean) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                {t('common.clear')}
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <Plus size={14} aria-hidden="true" />
              <span>{t('irrigation.addSchedule')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* 8. Irrigation Details Modal */}
      {selectedScheduleForDetails && (
        <IrrigationDetailsModal
          schedule={selectedScheduleForDetails}
          onClose={handleCloseDetailsModal}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteSchedule}
          onCancel={handleCancelSchedule}
          farmsMap={farmsMap}
          fieldsMap={fieldsMap}
        />
      )}

      {/* 9. Add / Edit Irrigation Modal */}
      {isAddEditModalOpen && (
        <AddIrrigationModal
          isOpen={isAddEditModalOpen}
          onClose={handleCloseAddEditModal}
          onSaveSchedule={handleSaveSchedule}
          scheduleToEdit={scheduleToEdit}
          farms={farms}
          fields={fields}
          crops={crops}
        />
      )}

      {/* 10. Action Toast Notification */}
      {toastMessage && (
        <div className="agri-irrigation-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} style={{ color: 'var(--primary-400)' }} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
