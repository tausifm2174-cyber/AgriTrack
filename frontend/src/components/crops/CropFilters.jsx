import { useTranslation } from 'react-i18next';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../common';
import { cropLifecycleStages } from '../../data/cropData';
import { formatFieldName, translateStage } from '../../utils/displayLabels';

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
  const { t } = useTranslation();
  // Filter fields dropdown based on selectedFarmId if any
  const availableFields = selectedFarmId
    ? fields.filter((f) => f.farmId === selectedFarmId)
    : fields;

  return (
    <div className="agri-crop-toolbar" role="search" aria-label={t('common.filter', 'Filter crops')}>
      {/* Search Input */}
      <div className="agri-crop-search-box">
        <Search size={16} className="agri-crop-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="agri-crop-search-input"
          placeholder={t('common.search', 'Search crop, variety, or field...')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('common.search', 'Search crop name or variety')}
        />
      </div>

      {/* Filter Select Controls */}
      <div className="agri-crop-filters-group">
        {/* Farm Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-farm-filter" className="sr-only">{t('fields.farm', 'Farm')}</label>
          <select
            id="crop-farm-filter"
            className="agri-crop-filter-select"
            value={selectedFarmId}
            onChange={(e) => onFarmChange(e.target.value)}
          >
            <option value="">{t('common.all', 'All Holdings')}</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {t(`farms.demoNames.${farm.id}`, farm.name)}
              </option>
            ))}
          </select>
        </div>

        {/* Field Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-field-filter" className="sr-only">{t('fields.fieldName', 'Field')}</label>
          <select
            id="crop-field-filter"
            className="agri-crop-filter-select"
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            <option value="">{t('fields.title', 'All Fields')}</option>
            {availableFields.map((field) => (
              <option key={field.id} value={field.id}>
                {formatFieldName(field.name, t)}
              </option>
            ))}
          </select>
        </div>

        {/* Season Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-season-filter" className="sr-only">{t('crops.season', 'Season')}</label>
          <select
            id="crop-season-filter"
            className="agri-crop-filter-select"
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
          >
            <option value="">{t('crops.season', 'All Seasons')}</option>
            <option value="Rabi">{t('crops.rabi', 'Rabi')}</option>
            <option value="Kharif">{t('crops.kharif', 'Kharif')}</option>
            <option value="Zaid">{t('crops.zaid', 'Zaid')}</option>
          </select>
        </div>

        {/* Lifecycle Stage Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-stage-filter" className="sr-only">{t('crops.currentStage', 'Stage')}</label>
          <select
            id="crop-stage-filter"
            className="agri-crop-filter-select"
            value={selectedStage}
            onChange={(e) => onStageChange(e.target.value)}
          >
            <option value="">{t('crops.currentStage', 'All Stages')}</option>
            {cropLifecycleStages.map((stage) => (
              <option key={stage.id} value={stage.name}>
                {translateStage(stage.name, t)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="agri-crop-filter-item">
          <label htmlFor="crop-status-filter" className="sr-only">{t('common.status', 'Status')}</label>
          <select
            id="crop-status-filter"
            className="agri-crop-filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">{t('common.status', 'All Statuses')}</option>
            <option value="Active">{t('status.active', 'Active')}</option>
            <option value="Near Harvest">{t('stages.ripening', 'Near Harvest')}</option>
            <option value="Ready for Harvest">{t('stages.harvestReadiness', 'Ready for Harvest')}</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} aria-hidden="true" />}
            onClick={onClearFilters}
            aria-label={t('common.clear', 'Reset all filters')}
          >
            {t('common.clear', 'Reset')}
          </Button>
        )}
      </div>
    </div>
  );
}
