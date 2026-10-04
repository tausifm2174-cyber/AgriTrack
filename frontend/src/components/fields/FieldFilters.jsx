import { Search, X } from 'lucide-react';

/**
 * FieldFilters component
 * Provides search and categorical filters for farm holdings and crops.
 */
export default function FieldFilters({
  searchQuery,
  onSearchChange,
  selectedFarmId,
  onFarmChange,
  selectedCrop,
  onCropChange,
  farms = [],
  crops = [],
  onClearFilters,
}) {
  const isFiltered = Boolean(searchQuery || selectedFarmId || selectedCrop);

  return (
    <div className="agri-field-toolbar" role="search" aria-label="Filter Fields">
      {/* Search Bar */}
      <div className="agri-field-search-box">
        <Search size={16} className="agri-field-search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by field name (e.g. Field 2B) or activity..."
          className="agri-field-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search fields"
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

      {/* Dropdown Filters */}
      <div className="agri-field-filters-group">
        {/* Farm Filter */}
        <select
          value={selectedFarmId}
          onChange={(e) => onFarmChange(e.target.value)}
          className="agri-field-filter-select"
          aria-label="Filter by farm holding"
        >
          <option value="">All Holdings</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Crop Filter */}
        <select
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          className="agri-field-filter-select"
          aria-label="Filter by crop"
        >
          <option value="">All Crops</option>
          {crops.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="agri-field-filter-clear-btn"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
