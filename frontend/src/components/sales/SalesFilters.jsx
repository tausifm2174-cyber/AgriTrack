import { useTranslation } from 'react-i18next';
import { Search, LayoutGrid, Table, X } from 'lucide-react';
import { translateCrop } from '../../utils/displayLabels';

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
  const { t } = useTranslation();
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
            placeholder={t('sales.searchPlaceholder', 'Search by sale ID, buyer, crop, harvest...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('sales.searchAria', 'Search sales')}
          />
        </div>

        {/* Crop Select */}
        <select
          className="agri-sales-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label={t('common.filterBy', 'Filter by crop')}
        >
          <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
          {cropList.map((crop) => (
            <option key={crop} value={crop}>
              {translateCrop(crop, t)}
            </option>
          ))}
        </select>

        {/* Sale Status */}
        <select
          className="agri-sales-filters__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label={t('common.status', 'Filter by sale status')}
        >
          <option value="ALL">{t('sales.allSaleStatuses', 'All Sale Statuses')}</option>
          <option value="COMPLETED">{t('status.completed', 'Completed')}</option>
          <option value="CONFIRMED">{t('status.confirmed', 'Confirmed')}</option>
          <option value="PENDING">{t('status.pending', 'Pending')}</option>
          <option value="CANCELLED">{t('status.cancelled', 'Cancelled')}</option>
        </select>

        {/* Payment Status */}
        <select
          className="agri-sales-filters__select"
          value={selectedPaymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          aria-label={t('sales.paymentStatus', 'Filter by payment status')}
        >
          <option value="ALL">{t('sales.allPaymentStatuses', 'All Payment Statuses')}</option>
          <option value="PAID">{t('status.paid', 'Paid')}</option>
          <option value="PARTIAL">{t('status.partiallyPaid', 'Partial')}</option>
          <option value="PENDING">{t('status.pending', 'Pending')}</option>
        </select>

        {/* Market */}
        <select
          className="agri-sales-filters__select"
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          aria-label={t('marketPrices.mandi', 'Filter by market')}
        >
          <option value="ALL">{t('marketPrices.allMandis', 'All Markets')}</option>
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
            aria-label={t('common.clearFilters', 'Reset all filters')}
          >
            <X size={14} />
            <span>{t('common.clear', 'Reset')}</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="agri-sales-filters__view-toggles" role="group" aria-label={t('crops.viewMode', 'View toggle')}>
          <button
            type="button"
            className={`agri-sales-filters__view-btn ${
              viewMode === 'table' ? 'agri-sales-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title={t('common.tableView', 'Table View')}
            aria-label={t('common.tableView', 'Table View')}
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-sales-filters__view-btn ${
              viewMode === 'cards' ? 'agri-sales-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title={t('common.cardView', 'Card View')}
            aria-label={t('common.cardView', 'Card View')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
