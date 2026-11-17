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
} from '../components/marketPrices';
import '../components/marketPrices/marketPrices.css';
import marketService from '../services/marketService';
import { adaptMarketPrice } from '../utils/adapters';

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const queryId = searchParams.get('id');

  // Live state
  const [marketPrices, setMarketPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedVariety, setSelectedVariety] = useState('ALL');
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [activeMarketPriceDetails, setActiveMarketPriceDetails] = useState(null);

  // Fetch live market benchmark rates
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const rawPrices = await marketService.getMarketPrices();

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
  }, [refreshKey, queryId, t]);

  // Filter option lists
  const cropList = useMemo(() => {
    const crops = new Set(marketPrices.map((m) => m.crop).filter(Boolean));
    return Array.from(crops).sort();
  }, [marketPrices]);

  const varietyList = useMemo(() => {
    const list = selectedCrop === 'ALL'
      ? marketPrices.map((m) => m.variety).filter(Boolean)
      : marketPrices.filter((m) => m.crop?.toLowerCase() === selectedCrop.toLowerCase()).map((m) => m.variety).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [marketPrices, selectedCrop]);

  const marketList = useMemo(() => {
    const markets = new Set(marketPrices.map((m) => m.market).filter(Boolean));
    return Array.from(markets).sort();
  }, [marketPrices]);

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

      // Market
      if (selectedMarket !== 'ALL' && item.market !== selectedMarket) {
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
    setSearchQuery('');
    setSelectedCrop('ALL');
    setSelectedVariety('ALL');
    setSelectedMarket('ALL');
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
      <MarketPriceSummaryCards marketPrices={marketPrices} />

      {/* Filter Bar */}
      <MarketPriceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        selectedVariety={selectedVariety}
        onVarietyChange={setSelectedVariety}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        selectedTrend={selectedTrend}
        onTrendChange={setSelectedTrend}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        cropList={cropList}
        varietyList={varietyList}
        marketList={marketList}
      />

      {/* Main Content Area */}
      {isLoading ? (
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
            marketPrices.length === 0
              ? t('marketPrices.noPricesDesc', 'No APMC mandi benchmark rates are currently available. Check back soon for live updates.')
              : t('marketPrices.noFilterPricesDesc', 'No APMC market records match your filter criteria. Try resetting or adjusting your search parameters.')
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
          marketPrice={activeMarketPriceDetails}
          onClose={() => setActiveMarketPriceDetails(null)}
          onCreateSale={handleCreateSale}
        />
      )}
    </div>
  );
}
