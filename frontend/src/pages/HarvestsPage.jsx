import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import {
  HarvestHeader,
  HarvestSummaryCards,
  HarvestFilters,
  HarvestTable,
  HarvestCard,
  HarvestDetailsModal,
  AddHarvestModal,
} from '../components/harvests';
import '../components/harvests/harvests.css';
import harvestService from '../services/harvestService';
import cropService from '../services/cropService';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import { adaptHarvest, adaptFarm, adaptField } from '../utils/adapters';

export default function HarvestsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryStatus = searchParams.get('status') || 'ALL';
  const queryId = searchParams.get('id');

  // Live state
  const [harvests, setHarvests] = useState([]);
  const [cropCycles, setCropCycles] = useState([]);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedStatus, setSelectedStatus] = useState(queryStatus);
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [activeHarvestDetails, setActiveHarvestDetails] = useState(null);
  const [harvestToEdit, setHarvestToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all required data from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [harvestRes, cropRes, farmRes, fieldRes] = await Promise.allSettled([
          harvestService.getAllHarvests(),
          cropService.getAllCropCycles(),
          farmService.getAllFarms(),
          fieldService.getAllFields(),
        ]);

        if (!isMounted) return;

        const rawHarvests = harvestRes.status === 'fulfilled' && Array.isArray(harvestRes.value) ? harvestRes.value : [];
        const rawCrops = cropRes.status === 'fulfilled' && Array.isArray(cropRes.value) ? cropRes.value : [];
        const rawFarms = farmRes.status === 'fulfilled' && Array.isArray(farmRes.value) ? farmRes.value : [];
        const rawFields = fieldRes.status === 'fulfilled' && Array.isArray(fieldRes.value) ? fieldRes.value : [];

        if (harvestRes.status === 'rejected') {
          setLoadError(
            harvestRes.reason?.response?.data?.message ||
            harvestRes.reason?.message ||
            t('harvests.loadError', 'Failed to load harvest records. Please check connection and try again.')
          );
        }

        const cyclesMap = {};
        rawCrops.forEach((c) => {
          if (c && c.id) cyclesMap[c.id] = c;
        });

        const fMap = {};
        rawFarms.forEach((f) => {
          if (f && f.id) fMap[f.id] = f;
        });

        const flMap = {};
        rawFields.forEach((fl) => {
          if (fl && fl.id) flMap[fl.id] = fl;
        });

        const adapted = rawHarvests.map((h) => adaptHarvest(h, cyclesMap, flMap, fMap));

        const adaptedFarms = rawFarms.map((f) => adaptFarm(f, rawFields)).filter(Boolean);
        const adaptedFields = rawFields.map((fl) => adaptField(fl, rawCrops)).filter(Boolean);

        setHarvests(adapted);
        setCropCycles(rawCrops);
        setFarms(adaptedFarms);
        setFields(adaptedFields);

        // Preselect harvest if queryId present
        if (queryId) {
          const matched = adapted.find((h) => String(h.id) === String(queryId));
          if (matched) {
            setActiveHarvestDetails(matched);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err.response?.data?.message || err.message || t('harvests.loadError', 'Failed to load harvest records.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, queryId, t]);

  // Toast notification helper
  const showToast = (message) => {
    setNotification({ type: 'success', message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Lookup Maps
  const cropCyclesMap = useMemo(() => {
    const map = {};
    cropCycles.forEach((c) => {
      if (c && c.id) map[c.id] = c;
    });
    return map;
  }, [cropCycles]);

  const farmsMap = useMemo(() => {
    const map = {};
    farms.forEach((f) => {
      if (f && f.id) map[f.id] = f;
    });
    return map;
  }, [farms]);

  const fieldsMap = useMemo(() => {
    const map = {};
    fields.forEach((fl) => {
      if (fl && fl.id) map[fl.id] = fl;
    });
    return map;
  }, [fields]);

  // Derived filter options
  const cropList = useMemo(() => {
    const crops = new Set(harvests.map((h) => h.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [harvests]);

  const farmList = useMemo(() => {
    return farms.map((f) => ({ id: f.id, name: f.farmName || f.name }));
  }, [farms]);

  // Filtered harvest records
  const filteredHarvests = useMemo(() => {
    return harvests.filter((harvest) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCrop = harvest.cropName?.toLowerCase().includes(q);
        const matchesVariety = harvest.variety?.toLowerCase().includes(q);
        const matchesFarm = harvest.farmName?.toLowerCase().includes(q);
        const matchesField = harvest.fieldName?.toLowerCase().includes(q);
        const matchesId = String(harvest.id).toLowerCase().includes(q);
        if (!matchesCrop && !matchesVariety && !matchesFarm && !matchesField && !matchesId) {
          return false;
        }
      }

      // Farm
      if (selectedFarm !== 'ALL' && String(harvest.farmId) !== String(selectedFarm)) {
        return false;
      }

      // Crop
      if (selectedCrop !== 'ALL' && harvest.cropName?.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && harvest.status !== selectedStatus) {
        return false;
      }

      // Quality Grade
      if (selectedGrade !== 'ALL' && harvest.qualityGrade !== selectedGrade) {
        return false;
      }

      // Date Range
      if (selectedDateRange !== 'ALL' && harvest.harvestDate) {
        const now = new Date();
        const harvestDate = new Date(harvest.harvestDate);
        if (selectedDateRange === 'RECENT') {
          // Last 7 days
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (harvestDate < sevenDaysAgo) return false;
        } else if (selectedDateRange === 'THIS_MONTH') {
          // Current month
          if (harvestDate.getMonth() !== now.getMonth() || harvestDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (selectedDateRange === 'OLDER') {
          // Before this month
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          if (harvestDate >= firstDayOfMonth) return false;
        }
      }

      return true;
    });
  }, [
    harvests,
    searchQuery,
    selectedFarm,
    selectedCrop,
    selectedStatus,
    selectedGrade,
    selectedDateRange,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFarm('ALL');
    setSelectedCrop('ALL');
    setSelectedStatus('ALL');
    setSelectedGrade('ALL');
    setSelectedDateRange('ALL');
  };

  const handleOpenAddModal = () => {
    setHarvestToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (harvest) => {
    setHarvestToEdit(harvest);
    setIsAddModalOpen(true);
    if (activeHarvestDetails) {
      setActiveHarvestDetails(null);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setHarvestToEdit(null);
  };

  const handleSaveHarvest = (savedRecord, isEdit) => {
    const adapted = adaptHarvest(savedRecord, cropCyclesMap, fieldsMap, farmsMap);
    if (isEdit) {
      setHarvests((prev) =>
        prev.map((item) => (String(item.id) === String(adapted.id) ? adapted : item))
      );
      showToast(`${t('alerts.harvestUpdated', 'Harvest updated')}: #${adapted.id} (${adapted.cropName})`);
    } else {
      setHarvests((prev) => [adapted, ...prev]);
      showToast(`${t('alerts.harvestAdded', 'Harvest recorded')}: #${adapted.id} (${adapted.cropName})`);
    }
  };

  const handleDeleteHarvest = async (harvest) => {
    const confirmed = window.confirm(
      `${t('harvests.deleteWarning', 'Are you sure you want to delete this harvest record? This action cannot be undone.')}\n\n#${harvest.id} (${harvest.cropName})`
    );
    if (!confirmed) return;

    try {
      await harvestService.deleteHarvest(harvest.id);
      setHarvests((prev) => prev.filter((item) => String(item.id) !== String(harvest.id)));
      if (activeHarvestDetails && String(activeHarvestDetails.id) === String(harvest.id)) {
        setActiveHarvestDetails(null);
      }
      showToast(`${t('common.delete', 'Deleted')}: #${harvest.id}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || '';
      if (errMsg.toLowerCase().includes('sales')) {
        alert(t('harvests.hasSalesCannotDelete', 'Cannot delete harvest with existing sales records. Please delete associated sales first.'));
      } else {
        alert(errMsg || t('common.error', 'An error occurred'));
      }
    }
  };

  const handleRecordSale = (harvest) => {
    navigate(`/sales?harvestId=${encodeURIComponent(harvest.id)}&crop=${encodeURIComponent(harvest.cropName)}`);
  };

  return (
    <div className="agri-harvests-page">
      {/* Toast Notification */}
      {notification && (
        <div
          className="agri-demo-badge-banner"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {loadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-bg, #fef2f2)',
            border: '1px solid var(--danger-border, #fecaca)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-text, #dc2626)',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{loadError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            <RefreshCw size={14} className="mr-1" />
            <span>{t('common.retry', 'Retry')}</span>
          </Button>
        </div>
      )}

      {/* Header */}
      <HarvestHeader onRecordHarvest={handleOpenAddModal} />

      {/* Summary KPI Cards */}
      <HarvestSummaryCards harvests={harvests} />

      {/* Filters Bar */}
      <HarvestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFarm={selectedFarm}
        onFarmChange={setSelectedFarm}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        cropList={cropList}
        farmList={farmList}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="agri-harvest-cards-grid" style={{ opacity: 0.7 }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                height: '180px',
                backgroundColor: 'var(--slate-100)',
                borderRadius: 'var(--radius-lg)',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : filteredHarvests.length === 0 ? (
        <EmptyState
          title={t('harvests.noHarvestsFound', 'No harvests found')}
          message={
            harvests.length === 0
              ? t('harvests.noHarvests', 'No harvest records found. Record your first harvest intake to begin.')
              : t('harvests.noHarvestsMessage', 'No harvest records match your selected filters. Try broadening your criteria or reset the search filters.')
          }
          actionText={
            harvests.length === 0
              ? t('harvests.addHarvest', 'Record New Harvest')
              : t('common.clearFilters', 'Reset Filters')
          }
          onAction={harvests.length === 0 ? handleOpenAddModal : handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <HarvestTable
          harvests={filteredHarvests}
          onViewDetails={setActiveHarvestDetails}
          onRecordSale={handleRecordSale}
        />
      ) : (
        <div className="agri-harvest-cards-grid">
          {filteredHarvests.map((harvest) => (
            <HarvestCard
              key={harvest.id}
              harvest={harvest}
              onViewDetails={setActiveHarvestDetails}
              onRecordSale={handleRecordSale}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeHarvestDetails && (
        <HarvestDetailsModal
          key={activeHarvestDetails.id}
          harvest={activeHarvestDetails}
          onClose={() => setActiveHarvestDetails(null)}
          onRecordSale={handleRecordSale}
          onDelete={handleDeleteHarvest}
          onEdit={handleOpenEditModal}
        />
      )}

      {/* Add / Edit Harvest Modal */}
      {isAddModalOpen && (
        <AddHarvestModal
          key={harvestToEdit ? harvestToEdit.id : 'add-harvest-modal'}
          onClose={handleCloseModal}
          onSave={handleSaveHarvest}
          cropCycles={cropCycles}
          harvestToEdit={harvestToEdit}
        />
      )}
    </div>
  );
}
