import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Loader2, Warehouse, Plus } from 'lucide-react';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import { adaptFarm, adaptField } from '../utils/adapters';
import { Button } from '../components/common';
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
 * FieldsPage (Phase 22.2 — Live Field Management)
 * Organizes individual parcels, irrigation configurations, standing crops,
 * and enables filtering and cross-navigation backed by backend REST APIs.
 */
export default function FieldsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFarmId = searchParams.get('farmId') || '';

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load farms and fields
  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const farmList = await farmService.getAllFarms();
        if (ignore) return;
        const adaptedFarms = Array.isArray(farmList) ? farmList.map((f) => adaptFarm(f)) : [];
        setFarms(adaptedFarms);

        if (adaptedFarms.length === 0) {
          setFields([]);
          setIsLoading(false);
          return;
        }

        // Check if selectedFarmId exists in user's farms
        const activeFarmId = selectedFarmId && adaptedFarms.some((f) => String(f.id) === String(selectedFarmId))
          ? selectedFarmId
          : '';

        let rawFields = [];
        if (activeFarmId) {
          try {
            rawFields = await fieldService.getFieldsByFarm(activeFarmId);
          } catch (fetchErr) {
            if (fetchErr.status === 404) {
              // Farm not found or unauthorized -> fallback to all farms
              setSearchParams({});
              const allResults = await Promise.all(
                adaptedFarms.map((f) => fieldService.getFieldsByFarm(f.id).catch(() => []))
              );
              rawFields = allResults.flat();
            } else {
              throw fetchErr;
            }
          }
        } else {
          const allResults = await Promise.all(
            adaptedFarms.map((f) => fieldService.getFieldsByFarm(f.id).catch(() => []))
          );
          rawFields = allResults.flat();
        }

        if (!ignore) {
          const adaptedFields = rawFields.map((f) => adaptField(f));
          setFields(adaptedFields);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('common.error', 'Failed to load fields. Please try again.'));
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
  }, [refreshKey, selectedFarmId, setSearchParams, t]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  // Distinct crops list for the filter
  const distinctCrops = useMemo(() => {
    const cropSet = new Set(fields.map((f) => f.currentCrop).filter(Boolean));
    return Array.from(cropSet);
  }, [fields]);

  // Handle farm filter change and sync URL search param cleanly
  const handleFarmChange = (farmId) => {
    if (farmId) {
      setSearchParams({ farmId: String(farmId) });
    } else {
      setSearchParams({});
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCrop('');
    setSearchParams({});
  };

  // Filtered fields based on search & dropdowns
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (f.name || '').toLowerCase().includes(q);
        const matchesCode = (f.code || '').toLowerCase().includes(q);
        const matchesCrop = (f.currentCrop || '').toLowerCase().includes(q);
        const matchesSoil = (f.soilType || '').toLowerCase().includes(q);
        const matchesActivity = (f.notes || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCrop && !matchesSoil && !matchesActivity) {
          return false;
        }
      }

      // 2. Farm Holding filter
      if (selectedFarmId && String(f.farmId) !== String(selectedFarmId)) {
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

  const handleFieldDeleted = (deletedFieldId) => {
    setFields((prev) => prev.filter((f) => String(f.id) !== String(deletedFieldId)));
    setSelectedField(null);
  };

  return (
    <div className="agri-fields-page">
      {/* 1. Header with Add Field button */}
      <FieldHeader onAddField={() => setIsAddModalOpen(true)} />

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

      {/* Empty State when user has 0 farms */}
      {!isLoading && farms.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '2rem auto',
          }}
        >
          <Warehouse size={48} className="text-muted" style={{ margin: '0 auto 1.25rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {t('fields.noFarmsTitle', 'No Farm Holdings Found')}
          </h3>
          <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {t(
              'fields.noFarmsDesc',
              'Fields must be associated with a farm holding. Please register your first farm holding before mapping field plots.'
            )}
          </p>
          <Button
            variant="primary"
            icon={<Plus size={16} aria-hidden="true" />}
            onClick={() => navigate('/farms')}
          >
            {t('farms.addFarm', 'Register Your First Farm')}
          </Button>
        </div>
      ) : (
        <>
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

          {/* 4. Responsive Fields Grid or Loading Indicator */}
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
                {t('common.loading', 'Loading field parcels...')}
              </p>
            </div>
          ) : (
            <FieldGrid
              fields={filteredFields}
              onViewDetails={(field) => setSelectedField(field)}
              onResetFilters={handleResetFilters}
              isFiltered={Boolean(searchQuery || selectedFarmId || selectedCrop)}
            />
          )}

          {/* 5. Field Specifications Modal */}
          {selectedField && (
            <FieldDetailsModal
              field={selectedField}
              onClose={() => setSelectedField(null)}
              onDeleteField={handleFieldDeleted}
            />
          )}

          {/* 6. Add Field Modal */}
          <AddFieldModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onFieldAdded={handleFieldAdded}
            farms={farms}
            defaultFarmId={selectedFarmId}
          />
        </>
      )}
    </div>
  );
}
