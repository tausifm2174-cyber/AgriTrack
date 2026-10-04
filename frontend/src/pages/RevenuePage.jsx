import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { salesRecords as initialSales } from '../data/salesData';
import { farmData } from '../data/farmData';
import { EmptyState } from '../components/common';
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

export default function RevenuePage() {
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const querySaleId = searchParams.get('id');

  // State
  const [sales] = useState(initialSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [activeSaleDetails, setActiveSaleDetails] = useState(() => {
    if (querySaleId) {
      return initialSales.find((s) => s.id === querySaleId) || null;
    }
    return null;
  });

  // Filter option lists
  const cropList = useMemo(() => {
    const crops = new Set(sales.map((s) => s.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [sales]);

  const farmList = useMemo(() => {
    return (farmData.farms || []).map((f) => ({ id: f.id, name: f.name }));
  }, []);

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
      const matchId = sale.id?.toLowerCase().includes(q);
      const matchBuyer = sale.buyerName?.toLowerCase().includes(q);
      const matchCrop = sale.cropName?.toLowerCase().includes(q);
      const matchHarvest = sale.harvestId?.toLowerCase().includes(q);
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
          title="No revenue records found"
          message="No commercial sales transactions match your current search and filter selections."
          actionText="Reset Filters"
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
