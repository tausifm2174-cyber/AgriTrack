import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import { adaptFarm } from '../utils/adapters';
import {
  FarmHeader,
  FarmSummaryCards,
  FarmGrid,
  FarmDetailsModal,
  AddFarmModal,
} from '../components/farms';
import '../components/farms/farms.css';

/**
 * FarmsPage (Phase 22.2 — Live Farm Management)
 * Displays farm holdings directory, acreage statistics, field counts,
 * and cross-navigation to fields backed by backend REST APIs.
 */
export default function FarmsPage() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch farms and their associated fields to compute accurate field counts
  useEffect(() => {
    let ignore = false;

    const loadFarms = async () => {
      try {
        const farmList = await farmService.getAllFarms();
        if (ignore) return;
        if (!Array.isArray(farmList) || farmList.length === 0) {
          setFarms([]);
          setIsLoading(false);
          return;
        }

        // Fetch child fields for each farm in parallel to resolve accurate counts
        const fieldResults = await Promise.all(
          farmList.map((f) => fieldService.getFieldsByFarm(f.id).catch(() => []))
        );
        if (ignore) return;
        const allFields = fieldResults.flat();

        const adapted = farmList.map((f) => adaptFarm(f, allFields));
        setFarms(adapted);
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('common.error', 'Failed to load farms. Please try again.'));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadFarms();

    return () => {
      ignore = true;
    };
  }, [refreshKey, t]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  // Compute live summary from state
  const summary = useMemo(
    () => ({
      totalHoldings: farms.length,
      totalFields: farms.reduce((acc, f) => acc + (f.fieldsCount || 0), 0),
      totalAreaAcres: farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0),
      activeHoldings: farms.filter((f) => f.status === 'Active').length,
    }),
    [farms]
  );

  const handleFarmAdded = (newFarm) => {
    setFarms((prev) => [newFarm, ...prev]);
  };

  const handleFarmDeleted = (deletedFarmId) => {
    setFarms((prev) => prev.filter((f) => String(f.id) !== String(deletedFarmId)));
    setSelectedFarm(null);
  };

  return (
    <div className="agri-farms-page">
      {/* 1. Header with Add Farm action */}
      <FarmHeader onAddFarm={() => setIsAddModalOpen(true)} />

      {/* Error Banner with Retry */}
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

      {/* 2. Summary KPI Cards */}
      <FarmSummaryCards summary={summary} />

      {/* 3. Farm Cards Grid or Loading Skeleton */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            gap: '1rem',
            color: '#64748b',
          }}
        >
          <Loader2 size={36} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
            {t('common.loading', 'Loading farm holdings...')}
          </p>
        </div>
      ) : (
        <FarmGrid
          farms={farms}
          onViewDetails={(farm) => setSelectedFarm(farm)}
          onAddFarm={() => setIsAddModalOpen(true)}
        />
      )}

      {/* 4. Details Modal */}
      {selectedFarm && (
        <FarmDetailsModal
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
          onDeleteFarm={handleFarmDeleted}
        />
      )}

      {/* 5. Add Farm Modal */}
      <AddFarmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFarmAdded={handleFarmAdded}
      />
    </div>
  );
}
