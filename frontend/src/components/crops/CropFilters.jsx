import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../common';
import { cropLifecycleStages } from '../../data/cropData';

/**
 * CropFilters component
 * Provides interactive search, farm, field, season, lifecycle stage, and status filtering.
 */
export default function CropFilters({
  searchQuery,
  onSearchChange,
  selectedFarmId,
  onFarmChange,
  selectedFieldId,
  onFieldChange,
  selectedSeason,
  onSeasonChange,
  selectedStage,
  onStageChange,
  selectedStatus,
  onStatusChange,
  farms = [],
  fields = [],
  onClearFilters,
  isFiltered = false,
}) {
  // Filter fields dropdown based on selectedFarmId if any
  const availableFields = selectedFarmId
    ? fields.filter((f) => f.farmId === selectedFarmId)
    : fields;

  return (
    <div className="agri-crop-toolbar" role="search" aria-label="Filter crops">
      {/* Search Input */}
      <div className="agri-crop-search-box">
        <Search size={16} className="agri-crop-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="agri-crop-search-input"
          placeholder="Search crop, variety, or field..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search crop name or variety"
        />
      </div>

      {/* Filter Select Controls */}
      <div className="agri-crop-filters-group">
        {/* Farm Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-farm-filter" className="sr-only">Farm</label>
          <select
            id="crop-farm-filter"
            className="agri-crop-filter-select"
            value={selectedFarmId}
            onChange={(e) => onFarmChange(e.target.value)}
          >
            <option value="">All Farms</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Field Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-field-filter" className="sr-only">Field</label>
          <select
            id="crop-field-filter"
            className="agri-crop-filter-select"
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            <option value="">All Fields</option>
            {availableFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        {/* Season Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-season-filter" className="sr-only">Season</label>
          <select
            id="crop-season-filter"
            className="agri-crop-filter-select"
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
          >
            <option value="">All Seasons</option>
            <option value="Rabi">Rabi</option>
            <option value="Kharif">Kharif</option>
            <option value="Zaid">Zaid</option>
          </select>
        </div>

        {/* Lifecycle Stage Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-stage-filter" className="sr-only">Stage</label>
          <select
            id="crop-stage-filter"
            className="agri-crop-filter-select"
            value={selectedStage}
            onChange={(e) => onStageChange(e.target.value)}
          >
            <option value="">All Stages</option>
            {cropLifecycleStages.map((stage) => (
              <option key={stage.id} value={stage.name}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-status-filter" className="sr-only">Status</label>
          <select
            id="crop-status-filter"
            className="agri-crop-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Near Harvest">Near Harvest</option>
            <option value="Ready for Harvest">Ready for Harvest</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} aria-hidden="true" />}
            onClick={onClearFilters}
            aria-label="Reset all filters"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
