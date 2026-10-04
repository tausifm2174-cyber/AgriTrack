import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { salesRecords as initialSales } from '../data/salesData';
import { harvestRecords as initialHarvests } from '../data/harvestData';
import { EmptyState } from '../components/common';
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

export default function SalesPage() {
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryHarvestId = searchParams.get('harvestId');
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryMarket = searchParams.get('market') || 'ALL';
  const querySaleId = searchParams.get('id');

  // Local state
  const [sales, setSales] = useState(initialSales);
  const [harvests, setHarvests] = useState(initialHarvests);

  const [searchQuery, setSearchQuery] = useState(queryHarvestId || '');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [selectedMarket, setSelectedMarket] = useState(queryMarket);
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [activeSaleDetails, setActiveSaleDetails] = useState(() => {
    if (querySaleId) {
      return initialSales.find((s) => s.id === querySaleId) || null;
    }
    return null;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(Boolean(queryHarvestId && !querySaleId));
  const [notification, setNotification] = useState(null);

  // Derived filter options
  const cropList = useMemo(() => {
    const crops = new Set(sales.map((s) => s.cropName));
    return Array.from(crops).sort();
  }, [sales]);

  const marketList = useMemo(() => {
    const markets = new Set(sales.map((s) => s.market));
    return Array.from(markets).sort();
  }, [sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = sale.id?.toLowerCase().includes(q);
        const matchesBuyer = sale.buyerName?.toLowerCase().includes(q);
        const matchesCrop = sale.cropName?.toLowerCase().includes(q);
        const matchesHarvest = sale.harvestId?.toLowerCase().includes(q);
        const matchesInvoice = sale.invoiceNumber?.toLowerCase().includes(q);
        if (!matchesId && !matchesBuyer && !matchesCrop && !matchesHarvest && !matchesInvoice) {
          return false;
        }
      }

      // Crop
      if (selectedCrop !== 'ALL' && sale.cropName.toLowerCase() !== selectedCrop.toLowerCase()) {
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

  const handleAddSale = (newSale, soldQty) => {
    // 1. Add sale to state
    setSales((prev) => [newSale, ...prev]);

    // 2. Decrement harvest stock
    setHarvests((prev) =>
      prev.map((h) => {
        if (h.id === newSale.harvestId) {
          const newAvail = Math.max(0, h.availableQuantityKg - soldQty);
          const newSold = h.soldQuantityKg + soldQty;
          const newStatus = newAvail === 0 ? 'SOLD_OUT' : 'PARTIALLY_SOLD';
          return {
            ...h,
            availableQuantityKg: newAvail,
            soldQuantityKg: newSold,
            status: newStatus,
          };
        }
        return h;
      })
    );

    // 3. Notification
    setNotification({
      type: 'success',
      message: `Sale ${newSale.id} for ${newSale.cropName} (₹${newSale.totalAmount.toLocaleString('en-IN')}) successfully executed!`,
    });
    setTimeout(() => setNotification(null), 5000);
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
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <SalesHeader onRecordSale={() => setIsAddModalOpen(true)} />

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

      {/* Content Area */}
      {filteredSales.length === 0 ? (
        <EmptyState
          title="No sales records found"
          message="No sales transactions match your selected search or filter criteria. Try adjusting your filters."
          actionText="Reset Filters"
          onAction={handleResetFilters}
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
        />
      )}

      {/* Add Sale Modal */}
      {isAddModalOpen && (
        <AddSaleModal
          key="add-sale-modal"
          harvests={harvests}
          preselectedHarvestId={queryHarvestId}
          preselectedCrop={queryCrop !== 'ALL' ? queryCrop : undefined}
          preselectedMarket={queryMarket !== 'ALL' ? queryMarket : undefined}
          onClose={() => setIsAddModalOpen(false)}
          onAddSale={handleAddSale}
        />
      )}
    </div>
  );
}
