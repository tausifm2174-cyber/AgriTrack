import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ClipboardList, Plus, AlertCircle, RefreshCw } from 'lucide-react';
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
import { getActivitySummary } from '../data/activityData';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import activityService from '../services/activityService';
import { adaptActivity, adaptField, adaptFarm } from '../utils/adapters';
import '../components/activities/activities.css';

/**
 * ActivitiesPage Component
 * Full-featured agricultural operations and activity management module.
 * Integrates live Spring Boot backend APIs for Farms, Fields, Crops, and Activities.
 */
export default function ActivitiesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId') || '';
  const urlFarmId = searchParams.get('farmId') || '';

  // Data states
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state initialized from query parameters if present
  const [filters, setFilters] = useState(() => ({
    search: '',
    farmId: urlFarmId,
    fieldId: urlFieldId,
    cropName: '',
    activityType: '',
    status: '',
    date: '',
  }));

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [selectedActivityForDetails, setSelectedActivityForDetails] = useState(null);

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

        // 1. Fetch farms, fields, crops, and activities in parallel
        const [farmsRes, fieldsRes, cropsRes, activitiesRes] = await Promise.all([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
          activityService.getAllActivities(),
        ]);

        if (!isMounted) return;

        const rawFarms = Array.isArray(farmsRes)
          ? farmsRes
          : (farmsRes?.data?.data || farmsRes?.data || []);
        const rawFields = Array.isArray(fieldsRes)
          ? fieldsRes
          : (fieldsRes?.data?.data || fieldsRes?.data || []);
        const rawCrops = Array.isArray(cropsRes)
          ? cropsRes
          : (cropsRes?.data?.data || cropsRes?.data || []);
        const rawActivities = Array.isArray(activitiesRes)
          ? activitiesRes
          : (activitiesRes?.data?.data || activitiesRes?.data || []);

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

        const adaptedActivities = rawActivities.map((a) => adaptActivity(a, flMap, fMap)).filter(Boolean);

        setFarms(adaptedFarms);
        setFields(adaptedFields);
        setCrops(rawCrops);
        setActivities(adaptedActivities);
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err.response?.data?.message || err.message || t('activities.loadError', 'Failed to load agricultural activities.'));
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
      activityType: '',
      status: '',
      date: '',
    });
  };

  const handleRetry = () => {
    setRefreshKey((k) => k + 1);
  };

  // Summary counts based on live activities
  const summaryMetrics = useMemo(() => {
    return getActivitySummary(activities);
  }, [activities]);

  // Filtered activities computation
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search text match
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const farmName = (activity.farmName || farmsMap[activity.farmId]?.name || '').toLowerCase();
        const fieldName = (activity.fieldName || fieldsMap[activity.fieldId]?.name || '').toLowerCase();
        const matchesTitle = (activity.title || '').toLowerCase().includes(query);
        const matchesDesc = (activity.description || '').toLowerCase().includes(query);
        const matchesNotes = (activity.notes || '').toLowerCase().includes(query);
        const matchesCrop = (activity.cropName || '').toLowerCase().includes(query);
        const matchesType = (activity.activityType || '').toLowerCase().includes(query);
        const matchesOperator = (activity.operator || '').toLowerCase().includes(query);
        const matchesLocation = farmName.includes(query) || fieldName.includes(query);

        if (!matchesTitle && !matchesDesc && !matchesNotes && !matchesCrop && !matchesType && !matchesOperator && !matchesLocation) {
          return false;
        }
      }

      // Farm filter
      if (filters.farmId && String(activity.farmId) !== String(filters.farmId)) {
        return false;
      }

      // Field filter
      if (filters.fieldId && String(activity.fieldId) !== String(filters.fieldId)) {
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
    if (selectedActivityForDetails) {
      setSelectedActivityForDetails(null);
    }
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setActivityToEdit(null);
  };

  const handleSaveActivity = (savedActivity, isEdit) => {
    const adapted = adaptActivity(savedActivity, fieldsMap, farmsMap);
    if (isEdit) {
      setActivities((prev) =>
        prev.map((item) => (String(item.id) === String(adapted.id) ? adapted : item))
      );
      showToast(`${t('alerts.activityUpdated', 'Activity updated')}: ${adapted.title}`);
    } else {
      setActivities((prev) => [adapted, ...prev]);
      showToast(`${t('alerts.activityAdded', 'Activity scheduled')}: ${adapted.title}`);
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
  const handleDeleteActivity = async (activity) => {
    const confirmed = window.confirm(
      `${t('activities.deleteWarning', 'Are you sure you want to delete this activity? This action cannot be undone.')}\n\n"${activity.title}"`
    );
    if (!confirmed) return;

    try {
      await activityService.deleteActivity(activity.id);
      setActivities((prev) => prev.filter((item) => String(item.id) !== String(activity.id)));
      if (selectedActivityForDetails && String(selectedActivityForDetails.id) === String(activity.id)) {
        setSelectedActivityForDetails(null);
      }
      showToast(`${t('alerts.itemDeleted', 'Item deleted')}: ${activity.title}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || t('common.error'));
    }
  };

  return (
    <div className="agri-activities-page">
      {/* 1. Header with Add Activity Action */}
      <ActivityHeader onAddActivity={handleOpenAddModal} />

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
      <ActivitySummaryCards
        summary={summaryMetrics}
        activeStatusFilter={filters.status}
        onStatusFilterChange={(status) => handleFilterChange({ status })}
      />

      {/* 4. Multi-Criteria Filters Toolbar */}
      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        farms={farms}
        fields={fields}
        crops={crops}
        totalResultsCount={filteredActivities.length}
      />

      {/* 5. Loading Skeletons */}
      {isLoading ? (
        <div className="agri-activity-cards-grid" style={{ width: '100%' }}>
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
      ) : filteredActivities.length > 0 ? (
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
          <h3 className="agri-activity-empty__title">{t('activities.noActivities', t('common.noData'))}</h3>
          <p className="agri-activity-empty__text">
            {Object.values(filters).some(Boolean)
              ? t('common.noData')
              : t('activities.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {Object.values(filters).some(Boolean) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                {t('common.clear')}
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <Plus size={14} aria-hidden="true" />
              <span>{t('activities.addActivity')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* 6. Activity Details Modal */}
      {selectedActivityForDetails && (
        <ActivityDetailsModal
          activity={selectedActivityForDetails}
          onClose={handleCloseDetailsModal}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteActivity}
          farmsMap={farmsMap}
          fieldsMap={fieldsMap}
        />
      )}

      {/* 7. Add / Edit Activity Modal */}
      {isAddEditModalOpen && (
        <AddActivityModal
          isOpen={isAddEditModalOpen}
          onClose={handleCloseAddEditModal}
          onSaveActivity={handleSaveActivity}
          activityToEdit={activityToEdit}
          farms={farms}
          fields={fields}
          crops={crops}
        />
      )}

      {/* 8. Action Toast Feedback */}
      {toastMessage && (
        <div className="agri-activity-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} style={{ color: 'var(--primary-400)' }} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
