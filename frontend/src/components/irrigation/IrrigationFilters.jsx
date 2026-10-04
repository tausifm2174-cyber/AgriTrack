import { useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import {
  IRRIGATION_METHODS,
  IRRIGATION_STATUSES,
  IRRIGATION_PRIORITIES,
} from '../../data/irrigationData';

/**
 * IrrigationFilters Component
 * Multi-criteria filter toolbar: Search, Farm, Field (cascading),
 * Crop, Irrigation Method, Status, Priority, Date. Includes Clear Filters.
 * 
 * @param {Object} props
 * @param {Object} props.filters
 * @param {Function} props.onFilterChange
 * @param {Function} props.onResetFilters
 * @param {Array} [props.farms]
 * @param {Array} [props.fields]
 * @param {Array} [props.crops]
 * @param {number} [props.totalResultsCount]
 */
export default function IrrigationFilters({
  filters,
  onFilterChange,
  onResetFilters,
  farms = [],
  fields = [],
  crops = [],
  totalResultsCount = 0,
}) {
  // Cascading fields based on selected farm
  const availableFields = useMemo(() => {
    if (!filters.farmId) return fields;
    return fields.filter((f) => f.farmId === filters.farmId);
  }, [fields, filters.farmId]);

  // Distinct crops available based on filtered fields or all
  const availableCrops = useMemo(() => {
    const relevantCropNames = new Set();
    if (filters.fieldId) {
      const selectedField = fields.find((f) => f.id === filters.fieldId);
      if (selectedField?.currentCrop) relevantCropNames.add(selectedField.currentCrop);
    } else if (filters.farmId) {
      availableFields.forEach((f) => {
        if (f.currentCrop) relevantCropNames.add(f.currentCrop);
      });
    }

    if (relevantCropNames.size > 0) {
      return Array.from(relevantCropNames);
    }

    const cropNames = new Set(crops.map((c) => c.name || c.cropName).filter(Boolean));
    return Array.from(cropNames);
  }, [crops, fields, availableFields, filters.farmId, filters.fieldId]);

  // Handle farm change: reset field if invalid
  const handleFarmChange = (e) => {
    const newFarmId = e.target.value;
    onFilterChange({
      farmId: newFarmId,
      fieldId: '', // Reset field when farm changes
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.farmId ||
    filters.fieldId ||
    filters.cropName ||
    filters.method ||
    filters.status ||
    filters.priority ||
    filters.date
  );

  const activeFilterCount = [
    Boolean(filters.search),
    Boolean(filters.farmId),
    Boolean(filters.fieldId),
    Boolean(filters.cropName),
    Boolean(filters.method),
    Boolean(filters.status),
    Boolean(filters.priority),
    Boolean(filters.date),
  ].filter(Boolean).length;

  return (
    <div className="agri-irrigation-filter-toolbar" role="search" aria-label="Filter Irrigation Schedules">
      {/* Top Row: Search and primary selects */}
      <div className="agri-irrigation-filter-row-top">
        {/* Search Input */}
        <div className="agri-irrigation-search-box">
          <Search size={16} className="agri-irrigation-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="agri-irrigation-search-input"
            placeholder="Search schedules, crops, methods, notes..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            aria-label="Search irrigation schedules"
          />
        </div>

        {/* Filter dropdowns group */}
        <div className="agri-irrigation-select-group">
          {/* Farm filter */}
          <select
            className="agri-irrigation-select"
            value={filters.farmId || ''}
            onChange={handleFarmChange}
            aria-label="Filter by Farm"
          >
            <option value="">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Field filter (dependent on Farm) */}
          <select
            className="agri-irrigation-select"
            value={filters.fieldId || ''}
            onChange={(e) => onFilterChange({ fieldId: e.target.value })}
            aria-label="Filter by Field"
          >
            <option value="">{filters.farmId ? 'All Farm Fields' : 'All Fields'}</option>
            {availableFields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.currentCrop || 'No Crop'})
              </option>
            ))}
          </select>

          {/* Crop filter */}
          <select
            className="agri-irrigation-select"
            value={filters.cropName || ''}
            onChange={(e) => onFilterChange({ cropName: e.target.value })}
            aria-label="Filter by Crop"
          >
            <option value="">All Crops</option>
            {availableCrops.map((cropName) => (
              <option key={cropName} value={cropName}>
                {cropName}
              </option>
            ))}
          </select>

          {/* Method filter */}
          <select
            className="agri-irrigation-select"
            value={filters.method || ''}
            onChange={(e) => onFilterChange({ method: e.target.value })}
            aria-label="Filter by Irrigation Method"
          >
            <option value="">All Methods</option>
            {IRRIGATION_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            className="agri-irrigation-select"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            {IRRIGATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            className="agri-irrigation-select"
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            aria-label="Filter by Priority"
          >
            <option value="">All Priorities</option>
            {IRRIGATION_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>

          {/* Date filter */}
          <input
            type="date"
            className="agri-irrigation-select"
            style={{ paddingRight: '0.75rem', backgroundImage: 'none' }}
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            aria-label="Filter by Date"
            title="Filter by Scheduled Date"
          />
        </div>
      </div>

      {/* Status Bar / Active Filters & Clear button */}
      <div className="agri-irrigation-filter-status-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>
            Showing <strong>{totalResultsCount}</strong> {totalResultsCount === 1 ? 'schedule' : 'schedules'}
          </span>

          {hasActiveFilters && (
            <span className="agri-irrigation-active-filter-badge">
              <Filter size={12} aria-hidden="true" />
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}

          {filters.fieldId && (
            <span
              className="agri-irrigation-active-filter-badge"
              style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}
            >
              Field: {fields.find((f) => f.id === filters.fieldId)?.name || filters.fieldId}
            </span>
          )}

          {filters.farmId && (
            <span
              className="agri-irrigation-active-filter-badge"
              style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}
            >
              Farm: {farms.find((f) => f.id === filters.farmId)?.name || filters.farmId}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="agri-btn agri-btn--outline"
            style={{ height: '30px', padding: '0 0.625rem', fontSize: '0.775rem' }}
            onClick={onResetFilters}
          >
            <X size={13} aria-hidden="true" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
