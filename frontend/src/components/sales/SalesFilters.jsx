import { Search, LayoutGrid, Table, X } from 'lucide-react';

export default function SalesFilters({
  searchQuery,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedStatus,
  onStatusChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  selectedMarket,
  onMarketChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  cropList = [],
  marketList = [],
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCrop !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedPaymentStatus !== 'ALL' ||
    selectedMarket !== 'ALL';

  return (
    <div className="agri-sales-filters">
      <div className="agri-sales-filters__row">
        {/* Search */}
        <div className="agri-sales-filters__search">
          <Search size={16} className="agri-sales-filters__search-icon" />
          <input
            type="text"
            className="agri-sales-filters__search-input"
            placeholder="Search by sale ID, buyer, crop, harvest..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search sales"
          />
        </div>

        {/* Crop Select */}
        <select
          className="agri-sales-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label="Filter by crop"
        >
          <option value="ALL">All Crops</option>
          {cropList.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        {/* Sale Status */}
        <select
          className="agri-sales-filters__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by sale status"
        >
          <option value="ALL">All Sale Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Payment Status */}
        <select
          className="agri-sales-filters__select"
          value={selectedPaymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          aria-label="Filter by payment status"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
        </select>

        {/* Market */}
        <select
          className="agri-sales-filters__select"
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          aria-label="Filter by market"
        >
          <option value="ALL">All Markets</option>
          {marketList.map((market) => (
            <option key={market} value={market}>
              {market}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="agri-sales-filters__view-toggles" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`agri-sales-filters__view-btn ${
              viewMode === 'table' ? 'agri-sales-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-sales-filters__view-btn ${
              viewMode === 'cards' ? 'agri-sales-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title="Card View"
            aria-label="Card View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
