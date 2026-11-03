import { useTranslation } from 'react-i18next';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../common';
import { cropTypes } from '../../data/cropData';
import { translateCrop, formatFieldName } from '../../utils/displayLabels';

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
  const { t } = useTranslation();

  return (
    <div className="agri-cal-toolbar" role="search" aria-label={t('common.filter', 'Filter calendar milestones')}>
      {/* Search Input */}
      <div className="agri-cal-search-box">
        <Search size={16} className="agri-cal-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="agri-cal-search-input"
          placeholder={t('common.search', 'Search milestone, crop, or field...')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('common.search', 'Search milestone title')}
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="agri-cal-filters-group">
        {/* Crop Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-crop-filter" className="sr-only">{t('crops.cropName', 'Crop')}</label>
          <select
            id="cal-crop-filter"
            className="agri-cal-filter-select"
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
          >
            <option value="">{t('common.all', 'All Crops')}</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {translateCrop(crop, t)}
              </option>
            ))}
          </select>
        </div>

        {/* Field Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-field-filter" className="sr-only">{t('fields.fieldName', 'Field')}</label>
          <select
            id="cal-field-filter"
            className="agri-cal-filter-select"
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            <option value="">{t('fields.title', 'All Fields')}</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {formatFieldName(field.name, t)}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-type-filter" className="sr-only">{t('activities.type', 'Event Type')}</label>
          <select
            id="cal-type-filter"
            className="agri-cal-filter-select"
            value={selectedEventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
          >
            <option value="">{t('common.all', 'All Event Types')}</option>
            <option value="lifecycle">{t('crops.lifecycleProgress', 'Crop Lifecycle Stage')}</option>
            <option value="fertilizer">{t('activityTypes.fertilization', 'Fertilizer & Nutrition')}</option>
            <option value="irrigation">{t('irrigation.title', 'Irrigation Pulse')}</option>
            <option value="crop_protection">{t('activityTypes.spraying', 'Crop Protection & Weeding')}</option>
            <option value="harvest">{t('stages.harvestReadiness', 'Harvest Window')}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="agri-cal-filter-item">
          <label htmlFor="cal-status-filter" className="sr-only">{t('common.status', 'Status')}</label>
          <select
            id="cal-status-filter"
            className="agri-cal-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">{t('common.status', 'All Statuses')}</option>
            <option value="Scheduled">{t('status.scheduled', 'Scheduled')}</option>
            <option value="Upcoming">{t('status.planned', 'Upcoming')}</option>
            <option value="Ready">{t('status.optimal', 'Ready')}</option>
            <option value="Completed">{t('status.completed', 'Completed')}</option>
          </select>
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} aria-hidden="true" />}
            onClick={onClearFilters}
            aria-label={t('common.clear', 'Clear all calendar filters')}
          >
            {t('common.clear', 'Reset')}
          </Button>
        )}
      </div>
    </div>
  );
}
