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
            placeholder="Search sale ID, buyer, crop, harvest..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search revenue"
          />
        </div>

        {/* Crop */}
        <select
          className="agri-revenue-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label="Filter by crop"
        >
          <option value="ALL">All Crops</option>
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
          aria-label="Filter by farm"
        >
          <option value="ALL">All Farms</option>
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
          aria-label="Filter by mandi"
        >
          <option value="ALL">All Mandis</option>
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
          aria-label="Filter by sale status"
        >
          <option value="ALL">All Sale Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
        </select>

        {/* Reset */}
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
        <div className="agri-revenue-filters__view-toggles" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`agri-revenue-filters__view-btn ${
              viewMode === 'table' ? 'agri-revenue-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-revenue-filters__view-btn ${
              viewMode === 'cards' ? 'agri-revenue-filters__view-btn--active' : ''
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
