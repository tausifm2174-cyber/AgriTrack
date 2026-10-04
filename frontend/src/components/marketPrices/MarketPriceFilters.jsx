import { Search, LayoutGrid, Table, X } from 'lucide-react';

export default function MarketPriceFilters({
  searchQuery,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedVariety,
  onVarietyChange,
  selectedMarket,
  onMarketChange,
  selectedTrend,
  onTrendChange,
  selectedGrade,
  onGradeChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  cropList = [],
  varietyList = [],
  marketList = [],
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCrop !== 'ALL' ||
    selectedVariety !== 'ALL' ||
    selectedMarket !== 'ALL' ||
    selectedTrend !== 'ALL' ||
    selectedGrade !== 'ALL';

  return (
    <div className="agri-market-filters">
      <div className="agri-market-filters__row">
        {/* Search */}
        <div className="agri-market-filters__search">
          <Search size={16} className="agri-market-filters__search-icon" />
          <input
            type="text"
            className="agri-market-filters__search-input"
            placeholder="Search by crop, variety, mandi or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search market prices"
          />
        </div>

        {/* Crop Select */}
        <select
          className="agri-market-filters__select"
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

        {/* Variety Select */}
        <select
          className="agri-market-filters__select"
          value={selectedVariety}
          onChange={(e) => onVarietyChange(e.target.value)}
          aria-label="Filter by variety"
        >
          <option value="ALL">All Varieties</option>
          {varietyList.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {/* Market Select */}
        <select
          className="agri-market-filters__select"
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          aria-label="Filter by mandi market"
        >
          <option value="ALL">All Markets</option>
          {marketList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Trend Select */}
        <select
          className="agri-market-filters__select"
          value={selectedTrend}
          onChange={(e) => onTrendChange(e.target.value)}
          aria-label="Filter by trend"
        >
          <option value="ALL">All Trends</option>
          <option value="RISING">Rising</option>
          <option value="FALLING">Falling</option>
          <option value="STABLE">Stable</option>
        </select>

        {/* Quality Grade */}
        <select
          className="agri-market-filters__select"
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          aria-label="Filter by quality grade"
        >
          <option value="ALL">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
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
        <div className="agri-market-filters__view-toggles" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`agri-market-filters__view-btn ${
              viewMode === 'table' ? 'agri-market-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-market-filters__view-btn ${
              viewMode === 'cards' ? 'agri-market-filters__view-btn--active' : ''
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
