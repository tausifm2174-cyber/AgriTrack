import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { harvestRecords as initialHarvests } from '../data/harvestData';
import { farmData } from '../data/farmData';
import { EmptyState } from '../components/common';
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

export default function HarvestsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryStatus = searchParams.get('status') || 'ALL';
  const queryId = searchParams.get('id');

  // Local state
  const [harvests, setHarvests] = useState(initialHarvests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedStatus, setSelectedStatus] = useState(queryStatus);
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [activeHarvestDetails, setActiveHarvestDetails] = useState(() => {
    if (queryId) {
      return initialHarvests.find((h) => h.id === queryId) || null;
    }
    return null;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Derived filters data
  const cropList = useMemo(() => {
    const crops = new Set(harvests.map((h) => h.cropName));
    return Array.from(crops).sort();
  }, [harvests]);

  const farmList = useMemo(() => {
    return (farmData.farms || []).map((f) => ({ id: f.id, name: f.name }));
  }, []);

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
        const matchesId = harvest.id?.toLowerCase().includes(q);
        if (!matchesCrop && !matchesVariety && !matchesFarm && !matchesField && !matchesId) {
          return false;
        }
      }

      // Farm
      if (selectedFarm !== 'ALL' && harvest.farmId !== selectedFarm) {
        return false;
      }

      // Crop
      if (selectedCrop !== 'ALL' && harvest.cropName.toLowerCase() !== selectedCrop.toLowerCase()) {
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
      if (selectedDateRange !== 'ALL') {
        const harvestDate = new Date(harvest.harvestDate);
        if (selectedDateRange === 'RECENT') {
          // >= 28 Sep 2026
          if (harvestDate < new Date('2026-09-28')) return false;
        } else if (selectedDateRange === 'THIS_MONTH') {
          // Oct 2026
          if (harvest.harvestDate < '2026-10-01' || harvest.harvestDate > '2026-10-31') return false;
        } else if (selectedDateRange === 'OLDER') {
          if (harvest.harvestDate >= '2026-10-01') return false;
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

  const handleAddHarvest = (newRecord) => {
    setHarvests((prev) => [newRecord, ...prev]);
    setNotification({
      type: 'success',
      message: `Harvest ${newRecord.id} for ${newRecord.cropName} (${newRecord.harvestedQuantityKg} kg) recorded successfully!`,
    });
    setTimeout(() => setNotification(null), 5000);
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

      {/* Header */}
      <HarvestHeader onRecordHarvest={() => setIsAddModalOpen(true)} />

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
      {filteredHarvests.length === 0 ? (
        <EmptyState
          title="No harvests found"
          message="No harvest records match your selected filters. Try broadening your criteria or reset the search filters."
          actionText="Reset Filters"
          onAction={handleResetFilters}
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
        />
      )}

      {/* Add Harvest Modal */}
      {isAddModalOpen && (
        <AddHarvestModal
          key="add-harvest-modal"
          onClose={() => setIsAddModalOpen(false)}
          onAddHarvest={handleAddHarvest}
        />
      )}
    </div>
  );
}
