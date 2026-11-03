import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const isFiltered = Boolean(searchQuery || selectedFarmId || selectedStatus);

  return (
    <div className="agri-soil-toolbar" role="search" aria-label={t('common.filter', 'Filter Soil Records')}>
      {/* Search Input */}
      <div className="agri-soil-search-box">
        <Search size={16} className="agri-soil-search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder={t('common.search', 'Search by field, farm, or soil type...')}
          className="agri-soil-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('common.search', 'Search soil records')}
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

      {/* Filter Dropdowns and View Mode */}
      <div className="agri-soil-filters-group">
        {/* Farm Filter */}
        <select
          value={selectedFarmId}
          onChange={(e) => onFarmChange(e.target.value)}
          className="agri-soil-filter-select"
          aria-label={t('fields.farm', 'Filter by farm')}
        >
          <option value="">{t('common.all', 'All Holdings')}</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {t(`farms.demoNames.${f.id}`, f.name)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="agri-soil-filter-select"
          aria-label={t('common.status', 'Filter by health status')}
        >
          <option value="">{t('soil.soilStatus', 'All Soil Statuses')}</option>
          <option value="Good">{t('status.good', 'Good')}</option>
          <option value="Moderate">{t('status.moderate', 'Moderate')}</option>
          <option value="Needs Attention">{t('status.needsAttention', 'Needs Attention')}</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="agri-field-filter-clear-btn"
          >
            {t('common.clear', 'Reset')}
          </button>
        )}

        {/* View Mode Toggle: Table / Grid */}
        <div className="agri-soil-view-toggle" role="group" aria-label={t('common.filter', 'View format')}>
          <button
            type="button"
            className={`agri-soil-toggle-btn ${viewMode === 'table' ? 'agri-soil-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
            aria-pressed={viewMode === 'table'}
          >
            <TableIcon size={14} aria-hidden="true" />
            <span>{t('common.tableView', 'Table')}</span>
          </button>
          <button
            type="button"
            className={`agri-soil-toggle-btn ${viewMode === 'cards' ? 'agri-soil-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            aria-pressed={viewMode === 'cards'}
          >
            <LayoutGrid size={14} aria-hidden="true" />
            <span>{t('common.cardsView', 'Cards')}</span>
          </button>

        </div>
      </div>
    </div>
  );
}
