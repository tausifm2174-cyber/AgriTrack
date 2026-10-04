import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fieldData } from '../data/fieldData';
import { farmData } from '../data/farmData';
import {
  FieldHeader,
  FieldSummaryCards,
  FieldFilters,
  FieldGrid,
  FieldDetailsModal,
  AddFieldModal,
} from '../components/fields';
import '../components/fields/fields.css';

/**
 * FieldsPage (Phase 4 — Field Management)
 * Organizes individual parcels, irrigation configurations, standing crops,
 * and enables filtering and cross-navigation to soil test records.
 */
export default function FieldsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farmId') || '';

  const [fields, setFields] = useState(fieldData.fields);
  const [farms] = useState(farmData.farms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState(initialFarmId);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Distinct crops list for the filter
  const distinctCrops = useMemo(() => {
    const cropSet = new Set(fields.map((f) => f.currentCrop).filter(Boolean));
    return Array.from(cropSet);
  }, [fields]);

  // Handle farm filter change and sync URL search param cleanly
  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    if (farmId) {
      setSearchParams({ farmId });
    } else {
      setSearchParams({});
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFarmId('');
    setSelectedCrop('');
    setSearchParams({});
  };

  // Filtered fields based on search & dropdowns
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      // 1. Search Query filter (matches field name, crop, soil, or last activity)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesCode = (f.code || '').toLowerCase().includes(q);
        const matchesCrop = (f.currentCrop || '').toLowerCase().includes(q);
        const matchesSoil = (f.soilType || '').toLowerCase().includes(q);
        const matchesActivity = (f.lastActivity || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCrop && !matchesSoil && !matchesActivity) {
          return false;
        }
      }

      // 2. Farm Holding filter
      if (selectedFarmId && f.farmId !== selectedFarmId) {
        return false;
      }

      // 3. Crop filter
      if (selectedCrop && f.currentCrop !== selectedCrop) {
        return false;
      }

      return true;
    });
  }, [fields, searchQuery, selectedFarmId, selectedCrop]);

  // Dynamic KPI summary based on fields dataset
  const summary = useMemo(() => {
    return {
      totalFields: fields.length,
      totalAreaAcres: fields.reduce((acc, f) => acc + (f.areaAcres || 0), 0),
      irrigatedFields: fields.filter((f) => f.isIrrigated).length,
      activeCropFields: fields.filter((f) => f.currentCrop && !f.currentCrop.includes('Green Manure')).length,
    };
  }, [fields]);

  const handleFieldAdded = (newField) => {
    setFields((prev) => [newField, ...prev]);
  };

  return (
    <div className="agri-fields-page">
      {/* 1. Header with Add Field button */}
      <FieldHeader onAddField={() => setIsAddModalOpen(true)} />

      {/* 2. Summary KPI Cards */}
      <FieldSummaryCards summary={summary} />

      {/* 3. Toolbar with Search, Farm Filter, Crop Filter */}
      <FieldFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFarmId={selectedFarmId}
        onFarmChange={handleFarmChange}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        farms={farms}
        crops={distinctCrops}
        onClearFilters={handleResetFilters}
      />

      {/* 4. Responsive Fields Grid */}
      <FieldGrid
        fields={filteredFields}
        onViewDetails={(field) => setSelectedField(field)}
        onResetFilters={handleResetFilters}
        isFiltered={Boolean(searchQuery || selectedFarmId || selectedCrop)}
      />

      {/* 5. Field Specifications Modal */}
      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}

      {/* 6. Add Field Modal (Demo) */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFieldAdded={handleFieldAdded}
        farms={farms}
        defaultFarmId={selectedFarmId}
      />
    </div>
  );
}
