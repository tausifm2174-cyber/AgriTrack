import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { soilData } from '../data/soilData';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
import {
  SoilHeader,
  SoilSummaryCards,
  SoilFilters,
  SoilTable,
  SoilRecordCard,
  SoilDetailsModal,
  AddSoilTestModal,
} from '../components/soil';
import '../components/soil/soil.css';

/**
 * SoilPage (Phase 4 — Soil Records)
 * Tracks laboratory soil test parameters, N-P-K nutrient profiles,
 * soil pH levels, and agronomic corrective recommendations.
 */
export default function SoilPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId') || '';

  const [records, setRecords] = useState(soilData.records);
  const [farms] = useState(farmData.farms);
  const [fields] = useState(fieldData.fields);
  const [searchQuery, setSearchQuery] = useState(
    initialFieldId ? fields.find((f) => f.id === initialFieldId)?.name || '' : ''
  );
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Clear query params & all filter states
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFarmId('');
    setSelectedStatus('');
    setSearchParams({});
  };

  // Filtered records based on search and filters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesField = r.fieldName.toLowerCase().includes(q);
        const matchesFarm = r.farmName.toLowerCase().includes(q);
        const matchesSoil = r.soilType.toLowerCase().includes(q);
        const matchesSample = (r.sampleId || '').toLowerCase().includes(q);
        if (!matchesField && !matchesFarm && !matchesSoil && !matchesSample) {
          return false;
        }
      }

      // 2. Farm filter
      if (selectedFarmId && r.farmId !== selectedFarmId) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus && r.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedFarmId, selectedStatus]);

  // Dynamic summary computation
  const summary = useMemo(() => {
    const totalTested = records.length;
    const good = records.filter((r) => r.status === 'Good').length;
    const attention = records.filter((r) => r.status === 'Needs Attention').length;
    const avgPh =
      records.length > 0
        ? (records.reduce((acc, r) => acc + (parseFloat(r.ph) || 7.0), 0) / records.length).toFixed(1)
        : '6.9';

    return {
      fieldsTested: totalTested,
      goodSoil: good,
      needsAttention: attention,
      averagePh: avgPh,
    };
  }, [records]);

  const handleSoilTestAdded = (newRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="agri-soil-page">
      {/* 1. Header with Add Soil Test action */}
      <SoilHeader onAddSoilTest={() => setIsAddModalOpen(true)} />

      {/* 2. Summary KPI Cards */}
      <SoilSummaryCards summary={summary} />

      {/* 3. Toolbar with Search, Farm Filter, Status Filter, and View Mode Toggle */}
      <SoilFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFarmId={selectedFarmId}
        onFarmChange={setSelectedFarmId}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        farms={farms}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Records Presentation: Table View or Cards Grid */}
      {viewMode === 'table' ? (
        <SoilTable
          records={filteredRecords}
          onViewDetails={(rec) => setSelectedRecord(rec)}
          onResetFilters={handleClearFilters}
          isFiltered={Boolean(searchQuery || selectedFarmId || selectedStatus)}
        />
      ) : (
        <div className="agri-soil-card-grid">
          {filteredRecords.map((r) => (
            <SoilRecordCard
              key={r.id}
              record={r}
              onViewDetails={(rec) => setSelectedRecord(rec)}
            />
          ))}
        </div>
      )}

      {/* 5. Detailed Lab Analysis Modal */}
      {selectedRecord && (
        <SoilDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* 6. Add Soil Test Modal (Demo) */}
      <AddSoilTestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSoilTestAdded={handleSoilTestAdded}
        fields={fields}
      />
    </div>
  );
}
