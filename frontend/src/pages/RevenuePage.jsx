import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import {
  RevenueHeader,
  RevenueSummaryCards,
  RevenueFilters,
  RevenueTable,
  RevenueCard,
  RevenueDetailsModal,
  RevenueTrendChart,
  RevenueByCropChart,
} from '../components/revenue';
import { filterSales } from '../utils/financialCalculations';
import '../components/revenue/revenue.css';

// Live services & adapters
import saleService from '../services/saleService';
import farmService from '../services/farmService';
import harvestService from '../services/harvestService';
import { adaptSale, adaptFarm, adaptHarvest } from '../utils/adapters';

export default function RevenuePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const querySaleId = searchParams.get('id');

  // Live state
  const [sales, setSales] = useState([]);
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [activeSaleDetails, setActiveSaleDetails] = useState(null);

  // Load all live data from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [salesRes, farmsRes, harvestsRes] = await Promise.allSettled([
          saleService.getAllSales(),
          farmService.getAllFarms(),
          harvestService.getAllHarvests(),
        ]);

        if (!isMounted) return;

        const rawFarms = farmsRes.status === 'fulfilled' && Array.isArray(farmsRes.value) ? farmsRes.value : [];
        const adaptedFarms = rawFarms.map(adaptFarm).filter(Boolean);
        setFarms(adaptedFarms);

        const rawHarvests = harvestsRes.status === 'fulfilled' && Array.isArray(harvestsRes.value) ? harvestsRes.value : [];
        const harvestsMap = {};
        rawHarvests.forEach((h) => {
          const adapted = adaptHarvest(h);
          if (adapted) harvestsMap[adapted.id] = adapted;
        });

        const rawSales = salesRes.status === 'fulfilled' && Array.isArray(salesRes.value) ? salesRes.value : [];
        const adaptedSales = rawSales.map((s) => adaptSale(s, harvestsMap)).filter(Boolean);
        setSales(adaptedSales);

        if (querySaleId) {
          const matched = adaptedSales.find((s) => String(s.id) === String(querySaleId));
          if (matched) setActiveSaleDetails(matched);
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err?.message || 'Failed to load revenue sales data');
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
  }, [querySaleId, refreshKey]);

  // Filter option lists
  const cropList = useMemo(() => {
    const crops = new Set(sales.map((s) => s.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [sales]);

  const farmList = useMemo(() => {
    return farms.map((f) => ({ id: f.id, name: f.name }));
  }, [farms]);

  const marketList = useMemo(() => {
    const markets = new Set(sales.map((s) => s.market).filter(Boolean));
    return Array.from(markets).sort();
  }, [sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    const baseFiltered = filterSales(sales, {
      farmId: selectedFarm,
      crop: selectedCrop,
      market: selectedMarket,
      status: selectedStatus,
    });

    if (!searchQuery.trim()) return baseFiltered;

    const q = searchQuery.toLowerCase();
    return baseFiltered.filter((sale) => {
      const matchId = String(sale.id || '').toLowerCase().includes(q);
      const matchBuyer = sale.buyerName?.toLowerCase().includes(q);
      const matchCrop = sale.cropName?.toLowerCase().includes(q);
      const matchHarvest = String(sale.harvestId || '').toLowerCase().includes(q);
      const matchInvoice = sale.invoiceNumber?.toLowerCase().includes(q);
      return matchId || matchBuyer || matchCrop || matchHarvest || matchInvoice;
    });
  }, [
    sales,
    selectedFarm,
    selectedCrop,
    selectedMarket,
    selectedStatus,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCrop('ALL');
    setSelectedFarm('ALL');
    setSelectedMarket('ALL');
    setSelectedStatus('ALL');
  };

  if (isLoading) {
    return (
      <div className="agri-revenue-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <RefreshCw size={32} className="agri-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-600)' }} aria-hidden="true" />
        <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>{t('common.loading', 'Loading revenue and sales records...')}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="agri-revenue-page" style={{ padding: '2rem' }}>
        <div className="agri-alert agri-alert--danger" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
          <div style={{ flex: 1, fontSize: '0.875rem' }}>
            <strong>{t('common.error', 'Error loading revenue')}: </strong>
            <span>{loadError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-revenue-page">
      {/* Header */}
      <RevenueHeader />

      {/* Summary KPI Cards */}
      <RevenueSummaryCards sales={filteredSales} />

      {/* Revenue Charts Row */}
      <div className="agri-revenue-charts-grid">
        <RevenueTrendChart sales={filteredSales} />
        <RevenueByCropChart sales={filteredSales} />
      </div>

      {/* Filters Bar */}
      <RevenueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        selectedFarm={selectedFarm}
        onFarmChange={setSelectedFarm}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        cropList={cropList}
        farmList={farmList}
        marketList={marketList}
      />

      {/* Content Table / Cards */}
      {filteredSales.length === 0 ? (
        <EmptyState
          title={t('revenue.noRevenue', 'No revenue records found')}
          message={t('revenue.noRevenueDesc', 'No commercial sales transactions match your current search and filter selections.')}
          actionText={t('common.clearFilters', 'Reset Filters')}
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <RevenueTable
          sales={filteredSales}
          onViewDetails={setActiveSaleDetails}
        />
      ) : (
        <div className="agri-revenue-cards-grid">
          {filteredSales.map((sale) => (
            <RevenueCard
              key={sale.id}
              sale={sale}
              onViewDetails={setActiveSaleDetails}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeSaleDetails && (
        <RevenueDetailsModal
          key={activeSaleDetails.id}
          sale={activeSaleDetails}
          onClose={() => setActiveSaleDetails(null)}
        />
      )}
    </div>
  );
}
