import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertTriangle } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import {
  ProfitLossHeader,
  ProfitLossSummaryCards,
  ProfitLossOverview,
  ProfitLossChart,
  ProfitLossByCrop,
  ProfitLossByFarm,
  ProfitLossFilters,
  ProfitLossDetailsModal,
} from '../components/profitLoss';
import financialService from '../services/financialService';
import farmService from '../services/farmService';
import cropService from '../services/cropService';
import {
  adaptProfitLossSummary,
  adaptFarm,
  adaptCropCycle,
} from '../utils/adapters';
import '../components/profitLoss/profitLoss.css';

export default function ProfitLossPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryCropCycleId = searchParams.get('cropCycleId') || searchParams.get('crop') || 'ALL';
  const queryPeriod = searchParams.get('period') || 'ALL';

  // Filters state
  const [selectedPeriod, setSelectedPeriod] = useState(queryPeriod);
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedCrop, setSelectedCrop] = useState(queryCropCycleId);

  // Reference lists
  const [farms, setFarms] = useState([]);
  const [cropCycles, setCropCycles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Data & Loading State
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [activeDetailItem, setActiveDetailItem] = useState(null);

  // Helper to compute date range for period filter
  const getPeriodDates = useCallback((period) => {
    const now = new Date();
    if (period === 'THIS_MONTH') {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return {
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-${day}`,
      };
    }
    if (period === 'PREVIOUS_MONTH') {
      const prevDate = new Date(now.getFullYear(), now.getMonth(), 0);
      const year = prevDate.getFullYear();
      const month = String(prevDate.getMonth() + 1).padStart(2, '0');
      const lastDay = String(prevDate.getDate()).padStart(2, '0');
      return {
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-${lastDay}`,
      };
    }
    return {};
  }, []);

  // Fetch reference entities (farms and crop cycles)
  useEffect(() => {
    let isMounted = true;
    async function loadReferences() {
      try {
        const [rawFarms, rawCrops] = await Promise.all([
          farmService.getAllFarms().catch(() => []),
          cropService.getAllCropCycles().catch(() => []),
        ]);
        if (isMounted) {
          setFarms(Array.isArray(rawFarms) ? rawFarms.map((f) => adaptFarm(f)) : []);
          setCropCycles(Array.isArray(rawCrops) ? rawCrops.map((c) => adaptCropCycle(c)) : []);
        }
      } catch {
        // Handled silently; dropdowns will fall back to empty
      }
    }
    loadReferences();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch authoritative P&L summary from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedFarm !== 'ALL') {
          params.farmId = Number(selectedFarm);
        }
        if (selectedCrop !== 'ALL') {
          const numCrop = Number(selectedCrop);
          if (!isNaN(numCrop)) {
            params.cropCycleId = numCrop;
          }
        }

        const { startDate, endDate } = getPeriodDates(selectedPeriod);
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const rawSummary = await financialService.getProfitLossSummary(params);
        if (isMounted) {
          setSummary(adaptProfitLossSummary(rawSummary));
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load Profit & Loss financial summary. Please retry.');
        }
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
  }, [refreshKey, selectedFarm, selectedCrop, selectedPeriod, getPeriodDates]);

  // Filter option lists
  const farmList = useMemo(() => {
    return farms.map((f) => ({ id: f.id, name: f.name }));
  }, [farms]);

  const cropList = useMemo(() => {
    const list = [];
    const seen = new Set();
    for (const c of cropCycles) {
      if (selectedFarm !== 'ALL' && String(c.farmId) !== String(selectedFarm)) {
        continue;
      }
      const label = `${c.cropName}${c.variety ? ` (${c.variety})` : ''}`;
      if (!seen.has(String(c.id))) {
        seen.add(String(c.id));
        list.push({ id: c.id, name: label });
      }
    }
    return list;
  }, [cropCycles, selectedFarm]);

  // Derived display metrics from backend-authoritative crop summaries
  const totalHarvestYieldKg = useMemo(() => {
    return (summary?.cropSummaries || []).reduce(
      (acc, curr) => acc + (curr.harvestYieldKg || 0),
      0
    );
  }, [summary]);

  const costPerQuintal = useMemo(() => {
    if (totalHarvestYieldKg > 0 && summary?.totalExpenses > 0) {
      return Math.round((summary.totalExpenses / (totalHarvestYieldKg / 100)) * 100) / 100;
    }
    const firstWithCost = (summary?.cropSummaries || []).find((c) => c.costPerQuintal > 0);
    return firstWithCost ? firstWithCost.costPerQuintal : 0;
  }, [summary, totalHarvestYieldKg]);

  const handleResetFilters = () => {
    setSelectedPeriod('ALL');
    setSelectedFarm('ALL');
    setSelectedCrop('ALL');
  };

  return (
    <div className="agri-pl-page">
      {/* Header */}
      <ProfitLossHeader />

      {/* Loading State */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-600)' }} />
          <p>{t('common.loading', 'Loading authoritative Profit & Loss ledger statements...')}</p>
        </div>
      ) : error ? (
        <div className="agri-alert agri-alert--error" style={{ margin: '2rem 0' }}>
          <AlertTriangle size={20} />
          <div>
            <strong>{t('common.error', 'Error loading financial summary')}:</strong> {error}
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)} style={{ marginLeft: 'auto' }}>
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : farms.length === 0 ? (
        <EmptyState
          title={t('farms.noFarms', 'No farms registered yet')}
          message={t('profitLoss.createFarmFirst', 'To view profit & loss financial analysis, please register your first farm holding and log harvest sales or expenses.')}
          actionText={t('farms.addFarm', 'Create Farm Holding')}
          onAction={() => navigate('/farms')}
        />
      ) : (
        <>
          {/* Summary KPI Cards */}
          <ProfitLossSummaryCards
            totalRevenue={summary?.totalRevenue || 0}
            totalExpenses={summary?.totalExpenses || 0}
            netProfit={summary?.netProfit || 0}
            netMargin={summary?.profitMarginPercent || 0}
            costPerQuintal={costPerQuintal}
            harvestYieldKg={totalHarvestYieldKg}
            averageMandiRate={3993}
          />

          {/* Executive Overview Banner */}
          <ProfitLossOverview
            totalRevenue={summary?.totalRevenue || 0}
            totalExpenses={summary?.totalExpenses || 0}
            netProfit={summary?.netProfit || 0}
            netMargin={summary?.profitMarginPercent || 0}
          />

          {/* Filter Controls */}
          <ProfitLossFilters
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            selectedFarm={selectedFarm}
            onFarmChange={(val) => {
              setSelectedFarm(val);
              setSelectedCrop('ALL');
            }}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            onResetFilters={handleResetFilters}
            farmList={farmList}
            cropList={cropList}
          />

          {/* Financial Comparison Chart */}
          <ProfitLossChart trendData={summary?.monthlyTrends || []} />

          {/* Crop and Farm Level Breakdowns */}
          <div className="agri-pl-breakdown-grid">
            <ProfitLossByCrop
              cropSummaries={summary?.cropSummaries || []}
              onSelectCrop={setActiveDetailItem}
            />
            <ProfitLossByFarm
              farmSummaries={summary?.farmSummaries || []}
              onSelectFarm={setActiveDetailItem}
            />
          </div>
        </>
      )}

      {/* Details Modal */}
      {activeDetailItem && (
        <ProfitLossDetailsModal
          detailItem={activeDetailItem}
          onClose={() => setActiveDetailItem(null)}
        />
      )}
    </div>
  );
}
