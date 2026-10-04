import { useState } from 'react';
import { farmData } from '../data/farmData';
import {
  FarmHeader,
  FarmSummaryCards,
  FarmGrid,
  FarmDetailsModal,
  AddFarmModal,
} from '../components/farms';
import '../components/farms/farms.css';

/**
 * FarmsPage (Phase 4 — Farm Management)
 * Displays farm holdings directory, acreage statistics, field counts,
 * primary crops, and cross-navigation to fields.
 */
export default function FarmsPage() {
  const [farms, setFarms] = useState(farmData.farms);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute live summary from state
  const summary = {
    totalHoldings: farms.length,
    totalFields: farms.reduce((acc, f) => acc + (f.fieldsCount || 0), 0),
    totalAreaAcres: farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0),
    activeHoldings: farms.filter((f) => f.status === 'Active').length,
  };

  const handleFarmAdded = (newFarm) => {
    setFarms((prev) => [newFarm, ...prev]);
  };

  return (
    <div className="agri-farms-page">
      {/* 1. Header with Add Farm action */}
      <FarmHeader onAddFarm={() => setIsAddModalOpen(true)} />

      {/* 2. Summary KPI Cards */}
      <FarmSummaryCards summary={summary} />

      {/* 3. Farm Cards Grid */}
      <FarmGrid
        farms={farms}
        onViewDetails={(farm) => setSelectedFarm(farm)}
        onAddFarm={() => setIsAddModalOpen(true)}
      />

      {/* 4. Details Modal */}
      {selectedFarm && (
        <FarmDetailsModal
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
        />
      )}

      {/* 5. Add Farm Modal (Demo) */}
      <AddFarmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFarmAdded={handleFarmAdded}
      />
    </div>
  );
}
