import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../common';
import { cropTypes } from '../../data/cropData';

/**
 * CalendarFilters component
 * Provides search and multi-criteria filtering for agronomic milestones.
 */
export default function CalendarFilters({
  searchQuery,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedFieldId,
  onFieldChange,
  selectedEventType,
  onEventTypeChange,
  selectedStatus,
  onStatusChange,
  fields = [],
  onClearFilters,
  isFiltered = false,
}) {
  return (
    <div className="agri-cal-toolbar" role="search" aria-label="Filter calendar milestones">
      {/* Search Input */}
      <div className="agri-cal-search-box">
        <Search size={16} className="agri-cal-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="agri-cal-search-input"
          placeholder="Search milestone, crop, or field..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search milestone title"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="agri-cal-filters-group">
        {/* Crop Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-crop-filter" className="sr-only">Crop</label>
          <select
            id="cal-crop-filter"
            className="agri-cal-filter-select"
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
          >
            <option value="">All Crops</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* Field Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-field-filter" className="sr-only">Field</label>
          <select
            id="cal-field-filter"
            className="agri-cal-filter-select"
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            <option value="">All Fields</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-type-filter" className="sr-only">Event Type</label>
          <select
            id="cal-type-filter"
            className="agri-cal-filter-select"
            value={selectedEventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
          >
            <option value="">All Event Types</option>
            <option value="lifecycle">Crop Lifecycle Stage</option>
            <option value="fertilizer">Fertilizer & Nutrition</option>
            <option value="irrigation">Irrigation Pulse</option>
            <option value="crop_protection">Crop Protection & Weeding</option>
            <option value="harvest">Harvest Window</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-status-filter" className="sr-only">Status</label>
          <select
            id="cal-status-filter"
            className="agri-cal-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} aria-hidden="true" />}
            onClick={onClearFilters}
            aria-label="Clear all calendar filters"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
