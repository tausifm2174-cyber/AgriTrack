import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cropCycles } from '../data/cropData';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
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
 * CropsPage (Phase 5 — Crop Management & Lifecycle)
 * Manages crop cycles assigned to farm field parcels, 5-stage agronomic lifecycle progress,
 * seasonal varieties, and cross-navigation to fields and soil records.
 */
export default function CropsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFieldId = searchParams.get('fieldId') || '';
  const selectedFarmParam = searchParams.get('farmId') || '';

  // Local state for crop cycles, farms and fields
  const [crops, setCrops] = useState(cropCycles);
  const [farms] = useState(farmData.farms);
  const [fields] = useState(fieldData.fields);

  // Auto-resolve farm if field is selected
  const selectedFarmId = useMemo(() => {
    if (selectedFarmParam) return selectedFarmParam;
    if (selectedFieldId) {
      const match = fields.find((f) => f.id === selectedFieldId);
      return match ? match.farmId : '';
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
    if (farmId) newParams.farmId = farmId;
    setSearchParams(newParams);
  };

  // Handle field filter change and sync query params
  const handleFieldChange = (fieldId) => {
    const newParams = {};
    if (fieldId) {
      newParams.fieldId = fieldId;
      const matched = fields.find((f) => f.id === fieldId);
      if (matched) {
        newParams.farmId = matched.farmId;
      }
    } else if (selectedFarmId) {
      newParams.farmId = selectedFarmId;
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
      if (selectedFarmId && crop.farmId !== selectedFarmId) {
        return false;
      }

      // 3. Field Parcel
      if (selectedFieldId && crop.fieldId !== selectedFieldId) {
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
    const activeCycles = crops.filter((c) => c.status === 'Active' || c.status === 'Near Harvest' || c.status === 'Ready for Harvest').length;
    const uniqueFields = new Set(crops.map((c) => c.fieldId));
    const totalAreaAcres = crops.reduce((acc, c) => acc + (c.areaAcres || 0), 0);
    const cropsNearHarvest = crops.filter(
      (c) => c.status === 'Near Harvest' || c.status === 'Ready for Harvest' || c.currentStage === 'Ripening' || c.currentStage === 'Harvest Readiness'
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
  const handleCropSaved = (savedCrop, isEdit) => {
    if (isEdit) {
      setCrops((prev) => prev.map((c) => (c.id === savedCrop.id ? savedCrop : c)));
    } else {
      setCrops((prev) => [savedCrop, ...prev]);
    }
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

      {/* 5. Crop Details & 5-Stage Lifecycle Modal */}
      {selectedCropForDetails && (
        <CropDetailsModal
          crop={selectedCropForDetails}
          onClose={() => setSelectedCropForDetails(null)}
          onEdit={handleOpenEdit}
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
