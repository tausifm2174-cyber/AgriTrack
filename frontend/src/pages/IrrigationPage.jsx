import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Droplets, Plus } from 'lucide-react';
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
import {
  initialIrrigationRecords,
  getIrrigationSummary,
} from '../data/irrigationData';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
import { cropCycles } from '../data/cropData';
import '../components/irrigation/irrigation.css';

/**
 * IrrigationPage Component
 * Full-featured Precision Irrigation Management and Water Delivery Console.
 * Supports scheduling, telemetry, weather advisory, and cascading parcel filters.
 */
export default function IrrigationPage() {
  const [searchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId') || '';
  const urlFarmId = searchParams.get('farmId') || '';

  const farms = useMemo(() => farmData.farms || [], []);
  const fields = useMemo(() => fieldData.fields || [], []);
  const crops = useMemo(() => cropCycles || [], []);

  // Irrigation local state initialized from realistic demo data
  const [schedules, setSchedules] = useState(initialIrrigationRecords);

  // Filter state initialized from URL query parameters if present
  const [filters, setFilters] = useState(() => {
    let initialFarmId = urlFarmId;
    if (urlFieldId) {
      const allFields = fieldData.fields || [];
      const matchedField = allFields.find((f) => f.id === urlFieldId);
      if (matchedField) {
        initialFarmId = matchedField.farmId;
      }
    }
    return {
      search: '',
      farmId: initialFarmId,
      fieldId: urlFieldId,
      cropName: '',
      method: '',
      status: '',
      priority: '',
      date: '',
    };
  });

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

  // Summary counts based on all schedules
  const summaryMetrics = useMemo(() => {
    return getIrrigationSummary(schedules);
  }, [schedules]);

  // Filtered schedules computation
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Search text match
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const farmName = (farmsMap[item.farmId]?.name || '').toLowerCase();
        const fieldName = (fieldsMap[item.fieldId]?.name || '').toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCrop = (item.cropName || '').toLowerCase().includes(query);
        const matchesMethod = item.irrigationMethod.toLowerCase().includes(query);
        const matchesNotes = (item.notes || '').toLowerCase().includes(query);
        const matchesLocation = farmName.includes(query) || fieldName.includes(query);

        if (!matchesTitle && !matchesCrop && !matchesMethod && !matchesNotes && !matchesLocation) {
          return false;
        }
      }

      // Farm filter
      if (filters.farmId && item.farmId !== filters.farmId) {
        return false;
      }

      // Field filter
      if (filters.fieldId && item.fieldId !== filters.fieldId) {
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
    if (isEdit) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === savedSchedule.id ? savedSchedule : item))
      );
      showToast(`Schedule "${savedSchedule.title}" successfully updated`);
    } else {
      setSchedules((prev) => [savedSchedule, ...prev]);
      showToast(`New irrigation run "${savedSchedule.title}" scheduled`);
    }
  };

  // View details modal
  const handleViewSchedule = (schedule) => {
    setSelectedScheduleForDetails(schedule);
  };

  const handleCloseDetailsModal = () => {
    setSelectedScheduleForDetails(null);
  };

  // Cancel schedule (sets status to Cancelled)
  const handleCancelSchedule = (schedule) => {
    const confirmed = window.confirm(
      `Cancel scheduled irrigation "${schedule.title}" (${schedule.id})?`
    );
    if (!confirmed) return;

    setSchedules((prev) =>
      prev.map((item) =>
        item.id === schedule.id ? { ...item, status: 'Cancelled' } : item
      )
    );
    showToast(`Irrigation schedule "${schedule.title}" marked as Cancelled`);
  };

  // Delete schedule
  const handleDeleteSchedule = (schedule) => {
    if (schedule.status === 'Completed') {
      const confirmHistory = window.confirm(
        `This schedule "${schedule.title}" is already Completed. Deleting historical delivery data is not recommended. Are you sure you wish to delete this record?`
      );
      if (!confirmHistory) return;
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to permanently delete schedule "${schedule.title}" (${schedule.id})?`
      );
      if (!confirmed) return;
    }

    setSchedules((prev) => prev.filter((item) => item.id !== schedule.id));
    if (selectedScheduleForDetails?.id === schedule.id) {
      setSelectedScheduleForDetails(null);
    }
    showToast(`Schedule "${schedule.title}" deleted`);
  };

  return (
    <div className="agri-irrigation-page">
      {/* 1. Page Header with Schedule Action */}
      <IrrigationHeader onScheduleIrrigation={handleOpenAddModal} />

      {/* 2. Interactive KPI Summary Cards */}
      <IrrigationSummaryCards
        summary={summaryMetrics}
        activeStatusFilter={filters.status}
        onStatusFilterChange={(status) => handleFilterChange({ status })}
      />

      {/* 3. Weather-Aware Irrigation Advisory Section */}
      <IrrigationAdvisory
        selectedFarmId={filters.farmId}
        farmsMap={farmsMap}
      />

      {/* 4. Today's & Upcoming Irrigation Highlight Section */}
      <UpcomingIrrigation
        schedules={schedules}
        onViewSchedule={handleViewSchedule}
        fieldsMap={fieldsMap}
      />

      {/* 5. Multi-Criteria Filter Toolbar */}
      <IrrigationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        farms={farms}
        fields={fields}
        crops={crops}
        totalResultsCount={filteredSchedules.length}
      />

      {/* 6. Irrigation Schedule List: Desktop Table + Mobile Cards */}
      {filteredSchedules.length > 0 ? (
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
          <h3 className="agri-irrigation-empty__title">No Irrigation Schedules Found</h3>
          <p className="agri-irrigation-empty__text">
            {Object.values(filters).some(Boolean)
              ? 'No schedules match the selected filter criteria. Try adjusting or resetting your search filters.'
              : 'No irrigation delivery cycles have been scheduled yet. Plan your first precision water run to get started.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {Object.values(filters).some(Boolean) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <Plus size={14} aria-hidden="true" />
              <span>Schedule Irrigation</span>
            </Button>
          </div>
        </div>
      )}

      {/* 7. Irrigation Details Modal */}
      {selectedScheduleForDetails && (
        <IrrigationDetailsModal
          schedule={selectedScheduleForDetails}
          onClose={handleCloseDetailsModal}
          onEdit={handleOpenEditModal}
          farmsMap={farmsMap}
          fieldsMap={fieldsMap}
        />
      )}

      {/* 8. Add / Edit Irrigation Modal */}
      {isAddEditModalOpen && (
        <AddIrrigationModal
          isOpen={isAddEditModalOpen}
          onClose={handleCloseAddEditModal}
          onSaveSchedule={handleSaveSchedule}
          scheduleToEdit={scheduleToEdit}
          farms={farms}
          fields={fields}
        />
      )}

      {/* 9. Action Toast Notification */}
      {toastMessage && (
        <div className="agri-irrigation-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} style={{ color: 'var(--primary-400)' }} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
