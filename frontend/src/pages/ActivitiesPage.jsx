import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Plus } from 'lucide-react';
import {
  ActivityHeader,
  ActivitySummaryCards,
  ActivityFilters,
  ActivityTable,
  ActivityCard,
  ActivityDetailsModal,
  AddActivityModal,
} from '../components/activities';
import { Button } from '../components/common';
import {
  initialActivities,
  getActivitySummary,
} from '../data/activityData';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
import { cropCycles } from '../data/cropData';
import '../components/activities/activities.css';

/**
 * ActivitiesPage Component
 * Full-featured agricultural operations and activity management module.
 * Supports scheduling, tracking, filtering, details inspection, and responsive layouts.
 */
export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId') || '';
  const urlFarmId = searchParams.get('farmId') || '';

  const farms = useMemo(() => farmData.farms || [], []);
  const fields = useMemo(() => fieldData.fields || [], []);
  const crops = useMemo(() => cropCycles || [], []);

  // Local activity state (initialized from realistic demo records)
  const [activities, setActivities] = useState(initialActivities);

  // Filter state initialized from query parameters if present
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
      activityType: '',
      status: '',
      date: '',
    };
  });

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [selectedActivityForDetails, setSelectedActivityForDetails] = useState(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Lookup maps for fast indexing
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
      activityType: '',
      status: '',
      date: '',
    });
  };

  // Summary counts based on all activities
  const summaryMetrics = useMemo(() => {
    return getActivitySummary(activities);
  }, [activities]);

  // Filtered activities computation
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search text match
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const farmName = (farmsMap[activity.farmId]?.name || '').toLowerCase();
        const fieldName = (fieldsMap[activity.fieldId]?.name || '').toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(query);
        const matchesDesc = (activity.description || '').toLowerCase().includes(query);
        const matchesNotes = (activity.notes || '').toLowerCase().includes(query);
        const matchesCrop = (activity.cropName || '').toLowerCase().includes(query);
        const matchesType = activity.activityType.toLowerCase().includes(query);
        const matchesOperator = (activity.operator || '').toLowerCase().includes(query);
        const matchesLocation = farmName.includes(query) || fieldName.includes(query);

        if (!matchesTitle && !matchesDesc && !matchesNotes && !matchesCrop && !matchesType && !matchesOperator && !matchesLocation) {
          return false;
        }
      }

      // Farm filter
      if (filters.farmId && activity.farmId !== filters.farmId) {
        return false;
      }

      // Field filter
      if (filters.fieldId && activity.fieldId !== filters.fieldId) {
        return false;
      }

      // Crop filter
      if (filters.cropName && activity.cropName !== filters.cropName) {
        return false;
      }

      // Activity type filter
      if (filters.activityType && activity.activityType !== filters.activityType) {
        return false;
      }

      // Status filter
      if (filters.status && activity.status !== filters.status) {
        return false;
      }

      // Date filter
      if (filters.date && activity.date !== filters.date) {
        return false;
      }

      return true;
    });
  }, [activities, filters, farmsMap, fieldsMap]);

  // Add / Edit Modal handlers
  const handleOpenAddModal = () => {
    setActivityToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (activity) => {
    setActivityToEdit(activity);
    setIsAddEditModalOpen(true);
    // If details modal was open, close it
    if (selectedActivityForDetails) {
      setSelectedActivityForDetails(null);
    }
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setActivityToEdit(null);
  };

  const handleSaveActivity = (savedActivity, isEdit) => {
    if (isEdit) {
      setActivities((prev) =>
        prev.map((item) => (item.id === savedActivity.id ? savedActivity : item))
      );
      showToast(`Activity "${savedActivity.title}" successfully updated`);
    } else {
      setActivities((prev) => [savedActivity, ...prev]);
      showToast(`New activity "${savedActivity.title}" scheduled`);
    }
  };

  // View details modal
  const handleViewActivity = (activity) => {
    setSelectedActivityForDetails(activity);
  };

  const handleCloseDetailsModal = () => {
    setSelectedActivityForDetails(null);
  };

  // Delete activity
  const handleDeleteActivity = (activity) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete activity "${activity.title}" (${activity.id})?`
    );
    if (!confirmed) return;

    setActivities((prev) => prev.filter((item) => item.id !== activity.id));
    if (selectedActivityForDetails?.id === activity.id) {
      setSelectedActivityForDetails(null);
    }
    showToast(`Activity "${activity.title}" removed`);
  };

  return (
    <div className="agri-activities-page">
      {/* 1. Header with Add Activity Action */}
      <ActivityHeader onAddActivity={handleOpenAddModal} />

      {/* 2. Interactive KPI Summary Cards */}
      <ActivitySummaryCards
        summary={summaryMetrics}
        activeStatusFilter={filters.status}
        onStatusFilterChange={(status) => handleFilterChange({ status })}
      />

      {/* 3. Multi-Criteria Filters Toolbar */}
      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        farms={farms}
        fields={fields}
        crops={crops}
        totalResultsCount={filteredActivities.length}
      />

      {/* 4. Activity List: Desktop Table + Mobile Cards */}
      {filteredActivities.length > 0 ? (
        <>
          {/* Desktop & Tablet Table */}
          <div className="agri-desktop-table-only">
            <ActivityTable
              activities={filteredActivities}
              onViewActivity={handleViewActivity}
              onEditActivity={handleOpenEditModal}
              onDeleteActivity={handleDeleteActivity}
              farmsMap={farmsMap}
              fieldsMap={fieldsMap}
            />
          </div>

          {/* Mobile Cards */}
          <div className="agri-mobile-cards-only">
            <div className="agri-activity-cards-grid" style={{ width: '100%' }}>
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onViewActivity={handleViewActivity}
                  onEditActivity={handleOpenEditModal}
                  onDeleteActivity={handleDeleteActivity}
                  farmsMap={farmsMap}
                  fieldsMap={fieldsMap}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="agri-activity-empty">
          <div className="agri-activity-empty__icon" aria-hidden="true">
            <ClipboardList size={28} />
          </div>
          <h3 className="agri-activity-empty__title">No Activities Found</h3>
          <p className="agri-activity-empty__text">
            {Object.values(filters).some(Boolean)
              ? 'No activities match the selected filter criteria. Try adjusting or resetting your search filters.'
              : 'No agricultural activities have been recorded yet. Schedule your first field operation to get started.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {Object.values(filters).some(Boolean) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <Plus size={14} aria-hidden="true" />
              <span>Schedule New Activity</span>
            </Button>
          </div>
        </div>
      )}

      {/* 5. Activity Details Modal */}
      {selectedActivityForDetails && (
        <ActivityDetailsModal
          activity={selectedActivityForDetails}
          onClose={handleCloseDetailsModal}
          onEdit={handleOpenEditModal}
          farmsMap={farmsMap}
          fieldsMap={fieldsMap}
        />
      )}

      {/* 6. Add / Edit Activity Modal */}
      {isAddEditModalOpen && (
        <AddActivityModal
          isOpen={isAddEditModalOpen}
          onClose={handleCloseAddEditModal}
          onSaveActivity={handleSaveActivity}
          activityToEdit={activityToEdit}
          farms={farms}
          fields={fields}
        />
      )}

      {/* 7. Action Toast Feedback */}
      {toastMessage && (
        <div className="agri-activity-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} style={{ color: 'var(--primary-400)' }} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
