import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import { adaptFarm, adaptField, adaptCropCycle } from '../utils/adapters';
import {
  CropHeader,
  CropSummaryCards,
  CropFilters,
  CropGrid,
  CropDetailsModal,
  AddCropModal,
} from '../components/crops';
import '../components/crops/crops.css';

/**
 * CropsPage (Phase 22.3 — Live Crop Management & Lifecycle)
 * Manages crop cycles assigned to farm field parcels, 5-stage agronomic lifecycle progress,
 * seasonal varieties, and cross-navigation backed by backend REST APIs.
 */
export default function CropsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFieldId = searchParams.get('fieldId') || '';
  const selectedFarmParam = searchParams.get('farmId') || '';

  // Live state for crops, farms and fields
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load farms, fields, and crop cycles
  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [farmList, cropList] = await Promise.all([
          farmService.getAllFarms().catch(() => []),
          cropService.getAllCropCycles().catch(() => []),
        ]);

        if (ignore) return;

        const adaptedFarms = Array.isArray(farmList) ? farmList.map((f) => adaptFarm(f)) : [];
        setFarms(adaptedFarms);

        // Fetch fields across all user farms
        let rawFields = [];
        if (adaptedFarms.length > 0) {
          const fieldsArrays = await Promise.all(
            adaptedFarms.map((f) => fieldService.getFieldsByFarm(f.id).catch(() => []))
          );
          rawFields = fieldsArrays.flat();
        }

        if (ignore) return;

        const adaptedFields = rawFields.map((f) => adaptField(f, cropList));
        setFields(adaptedFields);

        // Adapt crop cycles with matching field properties
        const adaptedCrops = Array.isArray(cropList)
          ? cropList.map((c) => {
              const matchedField = adaptedFields.find((f) => String(f.id) === String(c.fieldId));
              return adaptCropCycle(c, matchedField);
            })
          : [];

        setCrops(adaptedCrops);
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('crops.loadError', 'Failed to load crop cycles. Please try again.'));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [refreshKey, t]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  // Auto-resolve farm if field is selected
  const selectedFarmId = useMemo(() => {
    if (selectedFarmParam) return selectedFarmParam;
    if (selectedFieldId) {
      const match = fields.find((f) => String(f.id) === String(selectedFieldId));
      return match ? String(match.farmId) : '';
    }
    return '';
  }, [selectedFarmParam, selectedFieldId, fields]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [selectedCropForDetails, setSelectedCropForDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cropToEdit, setCropToEdit] = useState(null);

  // Handle farm filter change and sync query params cleanly
  const handleFarmChange = (farmId) => {
    const newParams = {};
    if (farmId) newParams.farmId = String(farmId);
    setSearchParams(newParams);
  };

  // Handle field filter change and sync query params
  const handleFieldChange = (fieldId) => {
    const newParams = {};
    if (fieldId) {
      newParams.fieldId = String(fieldId);
      const matched = fields.find((f) => String(f.id) === String(fieldId));
      if (matched) {
        newParams.farmId = String(matched.farmId);
      }
    } else if (selectedFarmId) {
      newParams.farmId = String(selectedFarmId);
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSeason('');
    setSelectedStage('');
    setSelectedStatus('');
    setSearchParams({});
  };

  // Check if any filter is active
  const isFiltered = Boolean(
    searchQuery ||
    selectedFarmId ||
    selectedFieldId ||
    selectedSeason ||
    selectedStage ||
    selectedStatus
  );

  // Filtered crops based on criteria
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (crop.cropName || '').toLowerCase().includes(q);
        const matchesVariety = (crop.variety || '').toLowerCase().includes(q);
        const matchesField = (crop.fieldName || '').toLowerCase().includes(q);
        const matchesFarm = (crop.farmName || '').toLowerCase().includes(q);
        const matchesStage = (crop.currentStage || '').toLowerCase().includes(q);
        if (!matchesName && !matchesVariety && !matchesField && !matchesFarm && !matchesStage) {
          return false;
        }
      }

      // 2. Farm Holding
      if (selectedFarmId && String(crop.farmId) !== String(selectedFarmId)) {
        return false;
      }

      // 3. Field Parcel
      if (selectedFieldId && String(crop.fieldId) !== String(selectedFieldId)) {
        return false;
      }

      // 4. Season
      if (selectedSeason && crop.season !== selectedSeason) {
        return false;
      }

      // 5. Stage
      if (selectedStage && crop.currentStage !== selectedStage) {
        return false;
      }

      // 6. Status
      if (selectedStatus && crop.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    crops,
    searchQuery,
    selectedFarmId,
    selectedFieldId,
    selectedSeason,
    selectedStage,
    selectedStatus,
  ]);

  // Dynamic KPI summary based on current crop dataset
  const summary = useMemo(() => {
    const activeCycles = crops.filter(
      (c) => c.status === 'Active' || c.status === 'Near Harvest' || c.status === 'Ready for Harvest'
    ).length;
    const uniqueFields = new Set(crops.map((c) => String(c.fieldId)));
    const totalAreaAcres = crops.reduce((acc, c) => acc + (c.areaAcres || 0), 0);
    const cropsNearHarvest = crops.filter(
      (c) =>
        c.status === 'Near Harvest' ||
        c.status === 'Ready for Harvest' ||
        c.currentStage === 'Ripening' ||
        c.currentStage === 'Harvest Readiness'
    ).length;
    const uniqueCropTypes = new Set(crops.map((c) => c.cropName));

    return {
      activeCycles,
      fieldsUnderCultivation: uniqueFields.size,
      totalAreaAcres: Number(totalAreaAcres.toFixed(1)),
      cropsNearHarvest,
      differentCropTypes: uniqueCropTypes.size,
    };
  }, [crops]);

  // Add / Edit crop callback
  const handleCropSaved = (savedCycle, isEdit) => {
    const matchedField = fields.find((f) => String(f.id) === String(savedCycle.fieldId));
    const adapted = adaptCropCycle(savedCycle, matchedField);
    if (isEdit) {
      setCrops((prev) => prev.map((c) => (String(c.id) === String(adapted.id) ? adapted : c)));
    } else {
      setCrops((prev) => [adapted, ...prev]);
    }
  };

  // Delete crop callback
  const handleCropDeleted = (deletedCropId) => {
    setCrops((prev) => prev.filter((c) => String(c.id) !== String(deletedCropId)));
    setSelectedCropForDetails(null);
  };

  // Open Edit modal
  const handleOpenEdit = (crop) => {
    setCropToEdit(crop);
    setIsAddModalOpen(true);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setCropToEdit(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="agri-crops-page">
      {/* 1. Page Header */}
      <CropHeader onAddCrop={handleOpenAdd} />

      {/* Error Alert with Retry */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.925rem', fontWeight: 500 }}>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ffffff',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{t('common.retry', 'Retry')}</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 2rem',
            color: '#64748b',
          }}
        >
          <Loader2 size={36} className="animate-spin text-primary" style={{ marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
            {t('common.loading', 'Loading crop cycles...')}
          </p>
        </div>
      ) : (
        <>
          {/* 2. 4 Agronomic Summary KPI Cards */}
          <CropSummaryCards summary={summary} />

          {/* 3. Search and Multi-criteria Filtering Toolbar */}
          <CropFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFarmId={selectedFarmId}
            onFarmChange={handleFarmChange}
            selectedFieldId={selectedFieldId}
            onFieldChange={handleFieldChange}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            farms={farms}
            fields={fields}
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />

          {/* 4. Responsive Crop Cards Grid */}
          <CropGrid
            crops={filteredCrops}
            onViewDetails={(crop) => setSelectedCropForDetails(crop)}
            onViewLifecycle={(crop) => setSelectedCropForDetails(crop)}
            onEdit={handleOpenEdit}
            onResetFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        </>
      )}

      {/* 5. Crop Details & 5-Stage Lifecycle Modal */}
      {selectedCropForDetails && (
        <CropDetailsModal
          crop={selectedCropForDetails}
          onClose={() => setSelectedCropForDetails(null)}
          onEdit={handleOpenEdit}
          onDelete={handleCropDeleted}
        />
      )}

      {/* 6. Add / Edit Crop Modal */}
      <AddCropModal
        key={cropToEdit ? cropToEdit.id : (isAddModalOpen ? 'modal-open' : 'modal-closed')}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCropToEdit(null);
        }}
        onCropSaved={handleCropSaved}
        farms={farms}
        fields={fields}
        cropToEdit={cropToEdit}
        defaultFarmId={selectedFarmId}
        defaultFieldId={selectedFieldId}
      />
    </div>
  );
}
