import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { translateCrop } from '../../utils/displayLabels';

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
  const { t } = useTranslation();
  const isFiltered = Boolean(searchQuery || selectedFarmId || selectedCrop);

  return (
    <div className="agri-field-toolbar" role="search" aria-label={t('common.filter', 'Filter Fields')}>
      {/* Search Bar */}
      <div className="agri-field-search-box">
        <Search size={16} className="agri-field-search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder={t('common.search', 'Search by field name or activity...')}
          className="agri-field-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('common.search', 'Search fields')}
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
            aria-label={t('common.clear', 'Clear search')}
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
          aria-label={t('fields.farm', 'Filter by farm holding')}
        >
          <option value="">{t('farms.allFarms', 'All Holdings')}</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {t(`farms.demoNames.${f.id}`, f.name)}
            </option>
          ))}
        </select>

        {/* Crop Filter */}
        <select
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          className="agri-field-filter-select"
          aria-label={t('fields.currentCrop', 'Filter by crop')}
        >
          <option value="">{t('crops.allCrops', 'All Crops')}</option>
          {crops.map((c) => (
            <option key={c} value={c}>
              {translateCrop(c, t)}
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
            {t('common.clear', 'Reset Filters')}
          </button>
        )}
      </div>
    </div>
  );
}
