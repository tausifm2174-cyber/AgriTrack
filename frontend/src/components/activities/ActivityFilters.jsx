import { useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { ACTIVITY_TYPES, ACTIVITY_STATUSES } from '../../data/activityData';

/**
 * ActivityFilters Component
 * Multi-criteria filter toolbar: Search, Farm, Field (dependent on Farm),
 * Crop, Activity Type, Status, and Date. Includes Clear Filters.
 */
export default function ActivityFilters({
  filters,
  onFilterChange,
  onResetFilters,
  farms = [],
  fields = [],
  crops = [],
  totalResultsCount = 0,
}) {
  // Farm-dependent fields list
  const availableFields = useMemo(() => {
    if (!filters.farmId) return fields;
    return fields.filter((f) => f.farmId === filters.farmId);
  }, [fields, filters.farmId]);

  // Distinct crops available based on filtered fields or all
  const availableCrops = useMemo(() => {
    let relevantCropNames = new Set();
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

    // Default to unique crop names from crops dataset
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

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.farmId ||
    filters.fieldId ||
    filters.cropName ||
    filters.activityType ||
    filters.status ||
    filters.date
  );

  const activeFilterCount = [
    Boolean(filters.search),
    Boolean(filters.farmId),
    Boolean(filters.fieldId),
    Boolean(filters.cropName),
    Boolean(filters.activityType),
    Boolean(filters.status),
    Boolean(filters.date),
  ].filter(Boolean).length;

  return (
    <div className="agri-activity-filter-toolbar" role="search" aria-label="Filter Activities">
      {/* Top Row: Search and primary selects */}
      <div className="agri-activity-filter-row-top">
        {/* Search Input */}
        <div className="agri-activity-search-box">
          <Search size={16} className="agri-activity-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="agri-activity-search-input"
            placeholder="Search activities, crops, fields, notes..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            aria-label="Search activities"
          />
        </div>

        {/* Filter dropdowns group */}
        <div className="agri-activity-select-group">
          {/* Farm filter */}
          <select
            className="agri-activity-select"
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
            className="agri-activity-select"
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
            className="agri-activity-select"
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

          {/* Activity Type filter */}
          <select
            className="agri-activity-select"
            value={filters.activityType || ''}
            onChange={(e) => onFilterChange({ activityType: e.target.value })}
            aria-label="Filter by Activity Type"
          >
            <option value="">All Types</option>
            {ACTIVITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            className="agri-activity-select"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            {ACTIVITY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Date filter */}
          <input
            type="date"
            className="agri-activity-select"
            style={{ paddingRight: '0.75rem', backgroundImage: 'none' }}
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            aria-label="Filter by Date"
            title="Filter by Activity Date"
          />
        </div>
      </div>

      {/* Status Bar / Active Filters & Clear button */}
      <div className="agri-activity-filter-status-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>
            Showing <strong>{totalResultsCount}</strong> {totalResultsCount === 1 ? 'activity' : 'activities'}
          </span>

          {hasActiveFilters && (
            <span className="agri-activity-active-filter-badge">
              <Filter size={12} aria-hidden="true" />
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}

          {filters.fieldId && (
            <span className="agri-activity-active-filter-badge" style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}>
              Field: {fields.find((f) => f.id === filters.fieldId)?.name || filters.fieldId}
            </span>
          )}

          {filters.farmId && (
            <span className="agri-activity-active-filter-badge" style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}>
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
