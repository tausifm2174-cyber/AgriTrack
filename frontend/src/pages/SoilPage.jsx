import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, Loader2, FlaskConical, Plus, MapPin } from 'lucide-react';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import soilService from '../services/soilService';
import { adaptFarm, adaptField, adaptSoilRecord } from '../utils/adapters';
import { Button } from '../components/common';
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
 * SoilPage (Phase 22.2 — Live Soil Records Management)
 * Tracks laboratory soil test parameters, N-P-K nutrient profiles,
 * soil pH levels, and agronomic corrective recommendations backed by REST APIs.
 */
export default function SoilPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId') || '';

  const [records, setRecords] = useState([]);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load farms, fields, and soil records
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
          setRecords([]);
          setIsLoading(false);
          return;
        }

        // Fetch all fields across all farms
        const fieldsArrays = await Promise.all(
          adaptedFarms.map((f) => fieldService.getFieldsByFarm(f.id).catch(() => []))
        );
        if (ignore) return;
        const allFields = fieldsArrays.flat().map((f) => adaptField(f));
        setFields(allFields);

        if (allFields.length === 0) {
          setRecords([]);
          setIsLoading(false);
          return;
        }

        // If initialFieldId exists in URL, set search filter or query that specific field
        let rawRecords = [];
        if (initialFieldId && allFields.some((f) => String(f.id) === String(initialFieldId))) {
          try {
            rawRecords = await soilService.getSoilRecordsByField(initialFieldId);
          } catch (fetchErr) {
            if (fetchErr.status === 404) {
              setSearchParams({});
              const allRecordResults = await Promise.all(
                allFields.map((f) => soilService.getSoilRecordsByField(f.id).catch(() => []))
              );
              rawRecords = allRecordResults.flat();
            } else {
              throw fetchErr;
            }
          }
        } else {
          const allRecordResults = await Promise.all(
            allFields.map((f) => soilService.getSoilRecordsByField(f.id).catch(() => []))
          );
          rawRecords = allRecordResults.flat();
        }

        if (ignore) return;

        // Attach farmId to soil records for client filtering if missing
        const adaptedRecords = rawRecords.map((r) => {
          const parentField = allFields.find((f) => String(f.id) === String(r.fieldId));
          const enrichedRecord = {
            ...r,
            farmId: r.farmId || parentField?.farmId || '',
            farmName: r.farmName || parentField?.farmName || '',
          };
          return adaptSoilRecord(enrichedRecord);
        });

        setRecords(adaptedRecords);
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('common.error', 'Failed to load soil test records. Please try again.'));
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
  }, [initialFieldId, refreshKey, setSearchParams, t]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

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
        const matchesField = (r.fieldName || '').toLowerCase().includes(q);
        const matchesFarm = (r.farmName || '').toLowerCase().includes(q);
        const matchesSoil = (r.soilType || '').toLowerCase().includes(q);
        const matchesSample = (r.sampleId || '').toLowerCase().includes(q);
        if (!matchesField && !matchesFarm && !matchesSoil && !matchesSample) {
          return false;
        }
      }

      // 2. Farm filter
      if (selectedFarmId && String(r.farmId) !== String(selectedFarmId)) {
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

  const handleSoilTestDeleted = (deletedRecordId) => {
    setRecords((prev) => prev.filter((r) => String(r.id) !== String(deletedRecordId)));
    setSelectedRecord(null);
  };

  return (
    <div className="agri-soil-page">
      {/* 1. Header with Add Soil Test action */}
      <SoilHeader onAddSoilTest={() => setIsAddModalOpen(true)} />

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

      {/* Empty State when user has 0 fields */}
      {!isLoading && fields.length === 0 ? (
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
          <MapPin size={48} className="text-muted" style={{ margin: '0 auto 1.25rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {t('soil.noFieldsTitle', 'No Fields Available for Testing')}
          </h3>
          <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {t(
              'soil.noFieldsDesc',
              'Soil lab reports must be linked to individual fields. Please map at least one field plot to log soil analyses.'
            )}
          </p>
          <Button
            variant="primary"
            icon={<Plus size={16} aria-hidden="true" />}
            onClick={() => navigate('/fields')}
          >
            {t('fields.addField', 'Map Your First Field')}
          </Button>
        </div>
      ) : (
        <>
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

          {/* 4. Records Presentation: Table View, Cards Grid, or Loading Spinner */}
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
                {t('common.loading', 'Loading laboratory test records...')}
              </p>
            </div>
          ) : records.length === 0 ? (
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
              <FlaskConical size={48} className="text-muted" style={{ margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {t('soil.noRecords', 'No Soil Test Records Logged')}
              </h3>
              <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {t(
                  'soil.noRecordsDesc',
                  'Log your laboratory soil testing certificates to monitor soil fertility, pH, and macro nutrients.'
                )}
              </p>
              <Button
                variant="primary"
                icon={<Plus size={16} aria-hidden="true" />}
                onClick={() => setIsAddModalOpen(true)}
              >
                {t('soil.addTest', 'Log First Soil Test')}
              </Button>
            </div>
          ) : viewMode === 'table' ? (
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
              onDeleteRecord={handleSoilTestDeleted}
            />
          )}

          {/* 6. Add Soil Test Modal */}
          <AddSoilTestModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSoilTestAdded={handleSoilTestAdded}
            fields={fields}
          />
        </>
      )}
    </div>
  );
}
