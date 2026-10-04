import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { marketPriceRecords as initialMarketPrices } from '../data/marketPriceData';
import { EmptyState } from '../components/common';
import {
  MarketPriceHeader,
  MarketPriceSummaryCards,
  MarketPriceFilters,
  MarketPriceTable,
  MarketPriceCard,
  MarketPriceDetailsModal,
} from '../components/marketPrices';
import '../components/marketPrices/marketPrices.css';

export default function MarketPricesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const queryId = searchParams.get('id');

  // State
  const [marketPrices] = useState(initialMarketPrices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedVariety, setSelectedVariety] = useState('ALL');
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [activeMarketPriceDetails, setActiveMarketPriceDetails] = useState(() => {
    if (queryId) {
      return initialMarketPrices.find((m) => m.id === queryId) || null;
    }
    return null;
  });

  // Filter option lists
  const cropList = useMemo(() => {
    const crops = new Set(marketPrices.map((m) => m.crop));
    return Array.from(crops).sort();
  }, [marketPrices]);

  const varietyList = useMemo(() => {
    const list = selectedCrop === 'ALL'
      ? marketPrices.map((m) => m.variety)
      : marketPrices.filter((m) => m.crop.toLowerCase() === selectedCrop.toLowerCase()).map((m) => m.variety);
    return Array.from(new Set(list)).sort();
  }, [marketPrices, selectedCrop]);

  const marketList = useMemo(() => {
    const markets = new Set(marketPrices.map((m) => m.market));
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
        const matchesId = item.id?.toLowerCase().includes(q);
        if (!matchesCrop && !matchesVariety && !matchesMarket && !matchesLocation && !matchesId) {
          return false;
        }
      }

      // Crop
      if (selectedCrop !== 'ALL' && item.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // Variety
      if (selectedVariety !== 'ALL' && item.variety.toLowerCase() !== selectedVariety.toLowerCase()) {
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
      {filteredPrices.length === 0 ? (
        <EmptyState
          title="No market prices found"
          message="No APMC market records match your filter criteria. Try resetting or adjusting your search parameters."
          actionText="Reset Filters"
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

      {/* Details Modal with Historical Recharts Chart */}
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
