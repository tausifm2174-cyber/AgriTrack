import { Search, LayoutGrid, Table, X } from 'lucide-react';

export default function HarvestFilters({
  searchQuery,
  onSearchChange,
  selectedFarm,
  onFarmChange,
  selectedCrop,
  onCropChange,
  selectedStatus,
  onStatusChange,
  selectedGrade,
  onGradeChange,
  selectedDateRange,
  onDateRangeChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  cropList = [],
  farmList = [],
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedFarm !== 'ALL' ||
    selectedCrop !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedGrade !== 'ALL' ||
    selectedDateRange !== 'ALL';

  return (
    <div className="agri-harvest-filters">
      <div className="agri-harvest-filters__row">
        {/* Search */}
        <div className="agri-harvest-filters__search">
          <Search size={16} className="agri-harvest-filters__search-icon" />
          <input
            type="text"
            className="agri-harvest-filters__search-input"
            placeholder="Search by crop, farm, field..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search harvests"
          />
        </div>

        {/* Farm Select */}
        <select
          className="agri-harvest-filters__select"
          value={selectedFarm}
          onChange={(e) => onFarmChange(e.target.value)}
          aria-label="Filter by farm"
        >
          <option value="ALL">All Farms</option>
          {farmList.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>

        {/* Crop Select */}
        <select
          className="agri-harvest-filters__select"
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

        {/* Status Select */}
        <select
          className="agri-harvest-filters__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="HARVESTED">Harvested</option>
          <option value="PARTIALLY_SOLD">Partially Sold</option>
          <option value="SOLD_OUT">Sold Out</option>
        </select>

        {/* Grade Select */}
        <select
          className="agri-harvest-filters__select"
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          aria-label="Filter by quality grade"
        >
          <option value="ALL">All Grades</option>
          <option value="A">Grade A (Premium)</option>
          <option value="B">Grade B (Standard)</option>
          <option value="C">Grade C (Commercial)</option>
        </select>

        {/* Date Range Select */}
        <select
          className="agri-harvest-filters__select"
          value={selectedDateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          aria-label="Filter by date range"
        >
          <option value="ALL">All Dates</option>
          <option value="RECENT">Recent (Last 7 Days)</option>
          <option value="THIS_MONTH">This Month (Oct 2026)</option>
          <option value="OLDER">Past Months (Sep 2026)</option>
        </select>

        {/* Clear Filters */}
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
        <div className="agri-harvest-filters__view-toggles" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`agri-harvest-filters__view-btn ${
              viewMode === 'table' ? 'agri-harvest-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-harvest-filters__view-btn ${
              viewMode === 'cards' ? 'agri-harvest-filters__view-btn--active' : ''
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
