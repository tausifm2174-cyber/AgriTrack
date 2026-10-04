import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { salesRecords } from '../data/salesData';
import { expenseRecords } from '../data/expenseData';
import { harvestRecords } from '../data/harvestData';
import { monthlyProfitTrend } from '../data/profitLossData';
import { farmData } from '../data/farmData';
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
import {
  filterSales,
  filterExpenses,
  calculateTotalRevenue,
  calculateTotalExpenses,
  calculateNetProfit,
  calculateNetMargin,
  calculateCostPerQuintal,
} from '../utils/financialCalculations';
import '../components/profitLoss/profitLoss.css';

export default function ProfitLossPage() {
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryPeriod = searchParams.get('period') || 'ALL';

  // Filters state
  const [selectedPeriod, setSelectedPeriod] = useState(queryPeriod);
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);

  // Modal state
  const [activeDetailItem, setActiveDetailItem] = useState(null);

  // Filter option lists
  const farmList = useMemo(() => {
    return (farmData.farms || []).map((f) => ({ id: f.id, name: f.name }));
  }, []);

  const cropList = useMemo(() => {
    const crops = new Set([
      ...salesRecords.map((s) => s.cropName),
      ...expenseRecords.map((e) => e.cropName),
    ].filter(Boolean));
    return Array.from(crops).sort();
  }, []);

  // Filtered sales and expenses
  const filteredSales = useMemo(() => {
    return filterSales(salesRecords, {
      farmId: selectedFarm,
      crop: selectedCrop,
      period: selectedPeriod,
    });
  }, [selectedFarm, selectedCrop, selectedPeriod]);

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenseRecords, {
      farmId: selectedFarm,
      crop: selectedCrop,
      period: selectedPeriod,
    });
  }, [selectedFarm, selectedCrop, selectedPeriod]);

  // Dynamically calculated financial metrics
  const totalRevenue = useMemo(() => {
    return calculateTotalRevenue(filteredSales);
  }, [filteredSales]);

  const totalExpenses = useMemo(() => {
    return calculateTotalExpenses(filteredExpenses);
  }, [filteredExpenses]);

  const netProfit = useMemo(() => {
    return calculateNetProfit(totalRevenue, totalExpenses);
  }, [totalRevenue, totalExpenses]);

  const netMargin = useMemo(() => {
    return calculateNetMargin(totalRevenue, netProfit);
  }, [totalRevenue, netProfit]);

  // Harvest yield for cost per quintal
  const harvestYieldKg = useMemo(() => {
    const relevantHarvests = harvestRecords.filter((h) => {
      if (selectedFarm !== 'ALL' && h.farmId !== selectedFarm) return false;
      if (selectedCrop !== 'ALL' && h.cropName?.toLowerCase() !== selectedCrop.toLowerCase()) return false;
      return true;
    });
    return relevantHarvests.reduce((acc, curr) => acc + (curr.harvestedQuantityKg || 0), 0);
  }, [selectedFarm, selectedCrop]);

  const costPerQuintal = useMemo(() => {
    return calculateCostPerQuintal(totalExpenses, harvestYieldKg || 15000);
  }, [totalExpenses, harvestYieldKg]);

  const handleResetFilters = () => {
    setSelectedPeriod('ALL');
    setSelectedFarm('ALL');
    setSelectedCrop('ALL');
  };

  return (
    <div className="agri-pl-page">
      {/* Header */}
      <ProfitLossHeader />

      {/* Summary KPI Cards */}
      <ProfitLossSummaryCards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        netMargin={netMargin}
        costPerQuintal={costPerQuintal}
        harvestYieldKg={harvestYieldKg || 15000}
        averageMandiRate={3993}
      />

      {/* Executive Overview Banner */}
      <ProfitLossOverview
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        netMargin={netMargin}
      />

      {/* Filter Controls */}
      <ProfitLossFilters
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedFarm={selectedFarm}
        onFarmChange={setSelectedFarm}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        onResetFilters={handleResetFilters}
        farmList={farmList}
        cropList={cropList}
      />

      {/* Financial Comparison Chart */}
      <ProfitLossChart trendData={monthlyProfitTrend} />

      {/* Crop and Farm Level Breakdowns */}
      <div className="agri-pl-breakdown-grid">
        <ProfitLossByCrop
          sales={filteredSales}
          expenses={filteredExpenses}
          onSelectCrop={setActiveDetailItem}
        />
        <ProfitLossByFarm
          sales={filteredSales}
          expenses={filteredExpenses}
          onSelectFarm={setActiveDetailItem}
        />
      </div>

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
