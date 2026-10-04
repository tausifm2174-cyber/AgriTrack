import { Search, X, Table as TableIcon, LayoutGrid } from 'lucide-react';

/**
 * SoilFilters component
 * Provides search, status filtering, and view mode toggling (table vs cards).
 */
export default function SoilFilters({
  searchQuery,
  onSearchChange,
  selectedFarmId,
  onFarmChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  farms = [],
  onClearFilters,
}) {
  const isFiltered = Boolean(searchQuery || selectedFarmId || selectedStatus);

  return (
    <div className="agri-soil-toolbar" role="search" aria-label="Filter Soil Records">
      {/* Search Input */}
      <div className="agri-soil-search-box">
        <Search size={16} className="agri-soil-search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by field, farm, or soil type..."
          className="agri-soil-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search soil records"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '0.65rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)',
              cursor: 'pointer',
            }}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Dropdowns and View Mode */}
      <div className="agri-soil-filters-group">
        {/* Farm Filter */}
        <select
          value={selectedFarmId}
          onChange={(e) => onFarmChange(e.target.value)}
          className="agri-soil-filter-select"
          aria-label="Filter by farm"
        >
          <option value="">All Holdings</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="agri-soil-filter-select"
          aria-label="Filter by health status"
        >
          <option value="">All Soil Statuses</option>
          <option value="Good">Good</option>
          <option value="Moderate">Moderate</option>
          <option value="Needs Attention">Needs Attention</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="agri-field-filter-clear-btn"
          >
            Reset
          </button>
        )}

        {/* View Mode Toggle: Table / Grid */}
        <div className="agri-soil-view-toggle" role="group" aria-label="View format">
          <button
            type="button"
            className={`agri-soil-toggle-btn ${viewMode === 'table' ? 'agri-soil-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
            aria-pressed={viewMode === 'table'}
          >
            <TableIcon size={14} aria-hidden="true" />
            <span>Table</span>
          </button>
          <button
            type="button"
            className={`agri-soil-toggle-btn ${viewMode === 'cards' ? 'agri-soil-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            aria-pressed={viewMode === 'cards'}
          >
            <LayoutGrid size={14} aria-hidden="true" />
            <span>Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
}
