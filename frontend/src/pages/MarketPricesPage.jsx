import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import {
  MarketPriceHeader,
  MarketPriceSummaryCards,
  MarketPriceFilters,
  MarketPriceTable,
  MarketPriceCard,
  MarketPriceDetailsModal,
  MarketTrendChart,
} from '../components/marketPrices';
import '../components/marketPrices/marketPrices.css';
import marketService from '../services/marketService';
import { adaptMarketPrice } from '../utils/adapters';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Rajasthan',
  'Uttar Pradesh',
  'Gujarat',
  'Madhya Pradesh',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'West Bengal',
  'Bihar',
  'Odisha',
];

const DEFAULT_CROPS = [
  'Tomato',
  'Onion',
  'Potato',
  'Wheat',
  'Rice',
  'Maize',
  'Soybean',
  'Cotton',
  'Mustard',
  'Gram',
  'Chilli',
  'Garlic',
  'Ginger',
  'Turmeric',
  'Apple',
  'Banana',
  'Mango',
];

function getDateRange(range, baseDateStr) {
  const base = baseDateStr ? new Date(baseDateStr) : new Date();
  const to = base.toISOString().slice(0, 10);
  const fromDate = new Date(base);
  if (range === '30d') {
    fromDate.setDate(fromDate.getDate() - 30);
  } else {
    fromDate.setDate(fromDate.getDate() - 5);
  }
  const from = fromDate.toISOString().slice(0, 10);
  return { from, to };
}

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters from URL if any
  const queryState = searchParams.get('state') || 'Karnataka';
  const queryDistrict = searchParams.get('district') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryDate = searchParams.get('date') || '';
  const queryId = searchParams.get('id');

  // Filter state
  const [selectedState, setSelectedState] = useState(queryState);
  const [selectedDistrict, setSelectedDistrict] = useState(queryDistrict);
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Live markets fetched from backend for the selected state
  const [availableMarkets, setAvailableMarkets] = useState([]);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);

  // Live price records fetched from backend
  const [marketPrices, setMarketPrices] = useState([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Historical price records for APMC Trend Chart
  const [priceHistory, setPriceHistory] = useState([]);
  const [historyRange, setHistoryRange] = useState('5d');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [activeMarketPriceDetails, setActiveMarketPriceDetails] = useState(null);

  // 1. Fetch available APMC markets when state changes
  useEffect(() => {
    let isMounted = true;

    async function loadMarkets() {
      setIsLoadingMarkets(true);
      try {
        const raw = await marketService.getMarkets(selectedState);
        if (!isMounted) return;
        const list = Array.isArray(raw) ? raw : [];
        setAvailableMarkets(list);

        // If currently selected market is not in this state's markets, reset market
        setSelectedMarket((prev) => {
          if (prev !== 'ALL' && !list.some((m) => m.market === prev)) {
            return list[0]?.market || 'ALL';
          }
          return prev;
        });
      } catch {
        if (!isMounted) return;
        setAvailableMarkets([]);
      } finally {
        if (isMounted) {
          setIsLoadingMarkets(false);
        }
      }
    }

    loadMarkets();

    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  // Derive districts and markets based on selections
  const districtList = useMemo(() => {
    const districts = new Set(availableMarkets.map((m) => m.district).filter(Boolean));
    return Array.from(districts).sort();
  }, [availableMarkets]);

  const marketList = useMemo(() => {
    const filtered = selectedDistrict === 'ALL'
      ? availableMarkets
      : availableMarkets.filter((m) => m.district === selectedDistrict);
    return Array.from(new Set(filtered.map((m) => m.market).filter(Boolean))).sort();
  }, [availableMarkets, selectedDistrict]);

  // Handle State change: clear downstream filters
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setSelectedDistrict('ALL');
    setSelectedMarket('ALL');
  };

  // Handle District change: reset market
  const handleDistrictChange = (newDistrict) => {
    setSelectedDistrict(newDistrict);
    setSelectedMarket('ALL');
  };

  // 2. Fetch live market benchmark prices
  useEffect(() => {
    let isMounted = true;

    async function loadPrices() {
      setIsLoadingPrices(true);
      setLoadError(null);

      try {
        const params = {
          state: selectedState,
        };

        if (selectedDistrict !== 'ALL') {
          params.district = selectedDistrict;
        }

        if (selectedMarket !== 'ALL') {
          params.market = selectedMarket;
        }

        if (selectedCrop !== 'ALL') {
          params.crop = selectedCrop;
        }

        if (selectedDate) {
          params.date = selectedDate;
        }

        const rawPrices = await marketService.getMarketPrices(params);

        if (!isMounted) return;

        const adapted = (Array.isArray(rawPrices) ? rawPrices : []).map((m) => adaptMarketPrice(m));
        setMarketPrices(adapted);

        if (queryId) {
          const matched = adapted.find((m) => String(m.id) === String(queryId));
          if (matched) {
            setActiveMarketPriceDetails(matched);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError(
          err.response?.data?.message ||
          err.message ||
          t('marketPrices.loadError', 'Failed to load APMC market prices. Please check connection and try again.')
        );
        setMarketPrices([]);
      } finally {
        if (isMounted) {
          setIsLoadingPrices(false);
        }
      }
    }

    loadPrices();

    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedDistrict, selectedMarket, selectedCrop, selectedDate, refreshKey, queryId, t]);

  // 3. Fetch APMC-specific historical price series for MarketTrendChart
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      // Only fetch history when an APMC market is selected
      if (selectedMarket === 'ALL') {
        setPriceHistory([]);
        return;
      }

      setIsLoadingHistory(true);
      const cropForHistory = selectedCrop !== 'ALL'
        ? selectedCrop
        : (marketPrices[0]?.crop || 'Tomato');

      const { from, to } = getDateRange(historyRange, selectedDate);

      try {
        const rawHistory = await marketService.getPriceHistory({
          state: selectedState,
          crop: cropForHistory,
          market: selectedMarket,
          from,
          to,
        });

        if (!isMounted) return;
        setPriceHistory(Array.isArray(rawHistory) ? rawHistory : []);
      } catch {
        if (!isMounted) return;
        setPriceHistory([]);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedMarket, selectedCrop, historyRange, selectedDate, marketPrices]);

  // Derive commodities list
  const cropList = useMemo(() => {
    const cropsFromPrices = marketPrices.map((m) => m.crop).filter(Boolean);
    const combined = new Set([...cropsFromPrices, ...DEFAULT_CROPS]);
    return Array.from(combined).sort();
  }, [marketPrices]);

  const varietyList = useMemo(() => {
    const list = selectedCrop === 'ALL'
      ? marketPrices.map((m) => m.variety).filter(Boolean)
      : marketPrices.filter((m) => m.crop?.toLowerCase() === selectedCrop.toLowerCase()).map((m) => m.variety).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [marketPrices, selectedCrop]);

  // Filtered market records
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCrop = item.crop?.toLowerCase().includes(q);
        const matchesVariety = item.variety?.toLowerCase().includes(q);
        const matchesMarket = item.market?.toLowerCase().includes(q);
        const matchesLocation = item.location?.toLowerCase().includes(q);
        const matchesId = String(item.id).toLowerCase().includes(q);
        if (!matchesCrop && !matchesVariety && !matchesMarket && !matchesLocation && !matchesId) {
          return false;
        }
      }

      // Crop
      if (selectedCrop !== 'ALL' && item.crop?.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // Variety
      if (selectedVariety !== 'ALL' && item.variety?.toLowerCase() !== selectedVariety.toLowerCase()) {
        return false;
      }

      // Market (Strict APMC Isolation)
      if (selectedMarket !== 'ALL' && item.market?.trim().toLowerCase() !== selectedMarket.trim().toLowerCase()) {
        return false;
      }

      // Trend
      if (selectedTrend !== 'ALL' && item.trend !== selectedTrend) {
        return false;
      }

      // Grade
      if (selectedGrade !== 'ALL' && item.qualityGrade !== selectedGrade) {
        return false;
      }

      return true;
    });
  }, [
    marketPrices,
    searchQuery,
    selectedCrop,
    selectedVariety,
    selectedMarket,
    selectedTrend,
    selectedGrade,
  ]);

  const handleResetFilters = () => {
    setSelectedState('Karnataka');
    setSelectedDistrict('ALL');
    setSelectedMarket('ALL');
    setSelectedCrop('ALL');
    setSelectedDate('');
    setSearchQuery('');
    setSelectedVariety('ALL');
    setSelectedTrend('ALL');
    setSelectedGrade('ALL');
  };

  const handleCreateSale = (marketPrice) => {
    navigate(`/sales?crop=${encodeURIComponent(marketPrice.crop)}&market=${encodeURIComponent(marketPrice.market)}`);
  };

  return (
    <div className="agri-market-page">
      {/* Header */}
      <MarketPriceHeader />

      {/* Error Banner */}
      {loadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-bg, #fef2f2)',
            border: '1px solid var(--danger-border, #fecaca)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-text, #dc2626)',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{loadError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            <RefreshCw size={14} className="mr-1" />
            <span>{t('common.retry', 'Retry')}</span>
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <MarketPriceSummaryCards marketPrices={filteredPrices} />

      {/* Filter Bar with Cascading Hierarchy: State -> District -> APMC -> Crop -> Date */}
      <MarketPriceFilters
        selectedState={selectedState}
        onStateChange={handleStateChange}
        stateList={INDIAN_STATES}
        selectedDistrict={selectedDistrict}
        onDistrictChange={handleDistrictChange}
        districtList={districtList}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        marketList={marketList}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        cropList={cropList}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedVariety={selectedVariety}
        onVarietyChange={setSelectedVariety}
        varietyList={varietyList}
        selectedTrend={selectedTrend}
        onTrendChange={setSelectedTrend}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        isLoadingMarkets={isLoadingMarkets}
      />

      {/* APMC Historical Price Trend Chart (Phase 22.9.4) */}
      {selectedMarket !== 'ALL' && (
        <MarketTrendChart
          history={priceHistory}
          crop={selectedCrop !== 'ALL' ? selectedCrop : (filteredPrices[0]?.crop || '')}
          market={selectedMarket}
          range={historyRange}
          onRangeChange={setHistoryRange}
          isLoading={isLoadingHistory}
        />
      )}

      {/* Main Content Area */}
      {isLoadingPrices ? (
        <div className="agri-market-cards-grid" style={{ opacity: 0.7 }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                height: '180px',
                backgroundColor: 'var(--slate-100)',
                borderRadius: 'var(--radius-lg)',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : filteredPrices.length === 0 ? (
        <EmptyState
          title={t('marketPrices.noPrices', 'No market prices found')}
          message={
            selectedMarket === 'ALL'
              ? t('marketPrices.selectApmcPrompt', 'Please select a specific APMC Mandi from the filters above to retrieve official benchmark rates.')
              : t('marketPrices.noPricesDesc', 'No APMC mandi benchmark rates are currently reported for the selected filters. Check back soon for live updates.')
          }
          actionText={t('common.clearFilters', 'Reset Filters')}
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <MarketPriceTable
          marketPrices={filteredPrices}
          onViewDetails={setActiveMarketPriceDetails}
          onCreateSale={handleCreateSale}
        />
      ) : (
        <div className="agri-market-cards-grid">
          {filteredPrices.map((item) => (
            <MarketPriceCard
              key={item.id}
              marketPrice={item}
              onViewDetails={setActiveMarketPriceDetails}
              onCreateSale={handleCreateSale}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeMarketPriceDetails && (
        <MarketPriceDetailsModal
          key={activeMarketPriceDetails.id}
          marketPrice={{
            ...activeMarketPriceDetails,
            history: priceHistory.length > 0 ? priceHistory : activeMarketPriceDetails.history,
          }}
          onClose={() => setActiveMarketPriceDetails(null)}
          onCreateSale={handleCreateSale}
        />
      )}
    </div>
  );
}
