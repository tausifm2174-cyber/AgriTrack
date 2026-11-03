import { useTranslation } from 'react-i18next';
import { Search, LayoutGrid, Table, X } from 'lucide-react';

export default function RevenueFilters({
  searchQuery,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedFarm,
  onFarmChange,
  selectedMarket,
  onMarketChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  cropList = [],
  farmList = [],
  marketList = [],
}) {
  const { t } = useTranslation();
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCrop !== 'ALL' ||
    selectedFarm !== 'ALL' ||
    selectedMarket !== 'ALL' ||
    selectedStatus !== 'ALL';

  return (
    <div className="agri-revenue-filters">
      <div className="agri-revenue-filters__row">
        {/* Search */}
        <div className="agri-revenue-filters__search">
          <Search size={16} className="agri-revenue-filters__search-icon" />
          <input
            type="text"
            className="agri-revenue-filters__search-input"
            placeholder={t('common.searchPlaceholder', 'Search sale ID, buyer, crop, harvest...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('common.search', 'Search revenue')}
          />
        </div>

        {/* Crop */}
        <select
          className="agri-revenue-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label={t('activities.crop', 'Filter by crop')}
        >
          <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
          {cropList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Farm */}
        <select
          className="agri-revenue-filters__select"
          value={selectedFarm}
          onChange={(e) => onFarmChange(e.target.value)}
          aria-label={t('fields.farm', 'Filter by farm')}
        >
          <option value="ALL">{t('common.allFarms', 'All Farms')}</option>
          {farmList.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Market */}
        <select
          className="agri-revenue-filters__select"
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          aria-label={t('marketPrices.mandi', 'Filter by mandi')}
        >
          <option value="ALL">{t('marketPrices.allMarkets', 'All Mandis')}</option>
          {marketList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Sale Status */}
        <select
          className="agri-revenue-filters__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label={t('common.status', 'Filter by sale status')}
        >
          <option value="ALL">{t('sales.allStatuses', 'All Sale Statuses')}</option>
          <option value="COMPLETED">{t('status.completed', 'Completed')}</option>
          <option value="CONFIRMED">{t('status.confirmed', 'Confirmed')}</option>
          <option value="PENDING">{t('status.pending', 'Pending')}</option>
        </select>

        {/* Reset */}
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
        <div className="agri-revenue-filters__view-toggles" role="group" aria-label={t('common.view', 'View toggle')}>
          <button
            type="button"
            className={`agri-revenue-filters__view-btn ${
              viewMode === 'table' ? 'agri-revenue-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title={t('common.table', 'Table View')}
            aria-label={t('common.table', 'Table View')}
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-revenue-filters__view-btn ${
              viewMode === 'cards' ? 'agri-revenue-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title={t('common.grid', 'Card View')}
            aria-label={t('common.grid', 'Card View')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
