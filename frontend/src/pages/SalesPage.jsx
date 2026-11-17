import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import {
  SalesHeader,
  SalesSummaryCards,
  SalesFilters,
  SalesTable,
  SaleCard,
  SaleDetailsModal,
  AddSaleModal,
} from '../components/sales';
import '../components/sales/sales.css';
import saleService from '../services/saleService';
import harvestService from '../services/harvestService';
import marketService from '../services/marketService';
import { adaptSale, adaptHarvest, adaptMarketPrice } from '../utils/adapters';

export default function SalesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryHarvestId = searchParams.get('harvestId');
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const querySaleId = searchParams.get('id');

  // Live state
  const [sales, setSales] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(queryHarvestId || '');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [activeSaleDetails, setActiveSaleDetails] = useState(null);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(Boolean(queryHarvestId && !querySaleId));
  const [notification, setNotification] = useState(null);

  // Fetch all live data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [salesRes, harvestRes, marketRes] = await Promise.allSettled([
          saleService.getAllSales(),
          harvestService.getAllHarvests(),
          marketService.getMarketPrices(),
        ]);

        if (!isMounted) return;

        const rawSales = salesRes.status === 'fulfilled' && Array.isArray(salesRes.value) ? salesRes.value : [];
        const rawHarvests = harvestRes.status === 'fulfilled' && Array.isArray(harvestRes.value) ? harvestRes.value : [];
        const rawMarkets = marketRes.status === 'fulfilled' && Array.isArray(marketRes.value) ? marketRes.value : [];

        if (salesRes.status === 'rejected') {
          setLoadError(
            salesRes.reason?.response?.data?.message ||
            salesRes.reason?.message ||
            t('sales.loadError', 'Failed to load sales records. Please check connection and try again.')
          );
        }

        const hMap = {};
        rawHarvests.forEach((h) => {
          if (h && h.id) hMap[h.id] = h;
        });

        const adaptedSales = rawSales.map((s) => adaptSale(s, hMap));
        const adaptedHarvests = rawHarvests.map((h) => adaptHarvest(h));
        const adaptedMarkets = rawMarkets.map((m) => adaptMarketPrice(m));

        setSales(adaptedSales);
        setHarvests(adaptedHarvests);
        setMarketPrices(adaptedMarkets);

        // Preselect sale if querySaleId provided
        if (querySaleId) {
          const matched = adaptedSales.find((s) => String(s.id) === String(querySaleId));
          if (matched) {
            setActiveSaleDetails(matched);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err.response?.data?.message || err.message || t('sales.loadError', 'Failed to load sales records.'));
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
  }, [refreshKey, querySaleId, t]);

  const showToast = (message) => {
    setNotification({ type: 'success', message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Lookup maps
  const harvestsMap = useMemo(() => {
    const map = {};
    harvests.forEach((h) => {
      if (h && h.id) map[h.id] = h;
    });
    return map;
  }, [harvests]);

  // Derived filter options
  const cropList = useMemo(() => {
    const crops = new Set(sales.map((s) => s.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [sales]);

  const marketList = useMemo(() => {
    const markets = new Set(sales.map((s) => s.market).filter(Boolean));
    return Array.from(markets).sort();
  }, [sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = String(sale.id).toLowerCase().includes(q);
        const matchesBuyer = sale.buyerName?.toLowerCase().includes(q);
        const matchesCrop = sale.cropName?.toLowerCase().includes(q);
        const matchesHarvest = String(sale.harvestId).toLowerCase().includes(q);
        const matchesInvoice = sale.invoiceNumber?.toLowerCase().includes(q);
        if (!matchesId && !matchesBuyer && !matchesCrop && !matchesHarvest && !matchesInvoice) {
          return false;
        }
      }

      // Crop
      if (selectedCrop !== 'ALL' && sale.cropName?.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // Sale Status
      if (selectedStatus !== 'ALL' && sale.status !== selectedStatus) {
        return false;
      }

      // Payment Status
      if (selectedPaymentStatus !== 'ALL' && sale.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      // Market
      if (selectedMarket !== 'ALL' && sale.market !== selectedMarket) {
        return false;
      }

      return true;
    });
  }, [
    sales,
    searchQuery,
    selectedCrop,
    selectedStatus,
    selectedPaymentStatus,
    selectedMarket,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCrop('ALL');
    setSelectedStatus('ALL');
    setSelectedPaymentStatus('ALL');
    setSelectedMarket('ALL');
  };

  const handleOpenAddModal = () => {
    setSaleToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (sale) => {
    setSaleToEdit(sale);
    setIsAddModalOpen(true);
    if (activeSaleDetails) {
      setActiveSaleDetails(null);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSaleToEdit(null);
  };

  const handleSaveSale = (savedSale, isEdit) => {
    const adapted = adaptSale(savedSale, harvestsMap);
    if (isEdit) {
      setSales((prev) =>
        prev.map((item) => (String(item.id) === String(adapted.id) ? adapted : item))
      );
      showToast(`${t('alerts.saleUpdated', 'Sale updated')}: #${adapted.id}`);
    } else {
      setSales((prev) => [adapted, ...prev]);
      showToast(`${t('alerts.saleAdded', 'Sale recorded')}: #${adapted.id}`);
    }
    // Re-synchronize harvest records to reflect backend inventory deduction
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteSale = async (sale) => {
    const confirmed = window.confirm(
      `${t('sales.deleteWarning', 'Are you sure you want to delete this sale order? Quantity will be refunded to harvest stock.')}\n\n#${sale.id} (${sale.buyerName})`
    );
    if (!confirmed) return;

    try {
      await saleService.deleteSale(sale.id);
      setSales((prev) => prev.filter((item) => String(item.id) !== String(sale.id)));
      if (activeSaleDetails && String(activeSaleDetails.id) === String(sale.id)) {
        setActiveSaleDetails(null);
      }
      showToast(`${t('common.delete', 'Deleted')}: #${sale.id}`);
      // Re-synchronize harvest records to reflect refunded available stock
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || err.message || t('common.error', 'An error occurred'));
    }
  };

  return (
    <div className="agri-sales-page">
      {/* Toast Notification */}
      {notification && (
        <div
          className="agri-demo-badge-banner"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}
            aria-label={t('common.close', 'Dismiss notification')}
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Header */}
      <SalesHeader onRecordSale={handleOpenAddModal} />

      {/* Summary KPI Cards */}
      <SalesSummaryCards sales={sales} />

      {/* Filters Bar */}
      <SalesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCrop={selectedCrop}
        onCropChange={setSelectedCrop}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        cropList={cropList}
        marketList={marketList}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="agri-sales-cards-grid" style={{ opacity: 0.7 }}>
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
      ) : filteredSales.length === 0 ? (
        <EmptyState
          title={t('sales.noSales', 'No commercial sales records found')}
          message={
            sales.length === 0
              ? t('sales.noSalesDesc', 'No sales transactions have been executed yet. Record a harvest lot and execute produce trades.')
              : t('sales.noSalesFilterDesc', 'No sales match your active filter criteria. Try resetting search filters.')
          }
          actionText={
            sales.length === 0
              ? t('sales.addSale', 'Record Commercial Produce Sale')
              : t('common.clearFilters', 'Reset Filters')
          }
          onAction={sales.length === 0 ? handleOpenAddModal : handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <SalesTable
          sales={filteredSales}
          onViewDetails={setActiveSaleDetails}
        />
      ) : (
        <div className="agri-sales-cards-grid">
          {filteredSales.map((sale) => (
            <SaleCard
              key={sale.id}
              sale={sale}
              onViewDetails={setActiveSaleDetails}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeSaleDetails && (
        <SaleDetailsModal
          key={activeSaleDetails.id}
          sale={activeSaleDetails}
          onClose={() => setActiveSaleDetails(null)}
          onDelete={handleDeleteSale}
          onEdit={handleOpenEditModal}
        />
      )}

      {/* Add / Edit Sale Modal */}
      {isAddModalOpen && (
        <AddSaleModal
          key={saleToEdit ? saleToEdit.id : 'add-sale-modal'}
          harvests={harvests}
          marketPrices={marketPrices}
          preselectedHarvestId={queryHarvestId}
          preselectedCrop={queryCrop !== 'ALL' ? queryCrop : ''}
          preselectedMarket={queryMarket !== 'ALL' ? queryMarket : ''}
          onClose={handleCloseModal}
          onSave={handleSaveSale}
          saleToEdit={saleToEdit}
        />
      )}
    </div>
  );
}
