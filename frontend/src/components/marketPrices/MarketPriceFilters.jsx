import { useTranslation } from 'react-i18next';
import { Search, LayoutGrid, Table, X } from 'lucide-react';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function MarketPriceFilters({
  searchQuery,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedVariety,
  onVarietyChange,
  selectedMarket,
  onMarketChange,
  selectedTrend,
  onTrendChange,
  selectedGrade,
  onGradeChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  cropList = [],
  varietyList = [],
  marketList = [],
}) {
  const { t } = useTranslation();
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCrop !== 'ALL' ||
    selectedVariety !== 'ALL' ||
    selectedMarket !== 'ALL' ||
    selectedTrend !== 'ALL' ||
    selectedGrade !== 'ALL';

  return (
    <div className="agri-market-filters">
      <div className="agri-market-filters__row">
        {/* Search */}
        <div className="agri-market-filters__search">
          <Search size={16} className="agri-market-filters__search-icon" />
          <input
            type="text"
            className="agri-market-filters__search-input"
            placeholder={t('common.searchPlaceholder', 'Search by crop, variety, mandi or location...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('common.search', 'Search market prices')}
          />
        </div>

        {/* Crop Select */}
        <select
          className="agri-market-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label={t('common.filterBy', 'Filter by crop')}
        >
          <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
          {cropList.map((c) => (
            <option key={c} value={c}>
              {translateCrop(c, t)}
            </option>
          ))}
        </select>

        {/* Variety Select */}
        <select
          className="agri-market-filters__select"
          value={selectedVariety}
          onChange={(e) => onVarietyChange(e.target.value)}
          aria-label={t('crops.variety', 'Filter by variety')}
        >
          <option value="ALL">{t('crops.allVarieties', 'All Varieties')}</option>
          {varietyList.map((v) => (
            <option key={v} value={v}>
              {translateVariety(v, t)}
            </option>
          ))}
        </select>

        {/* Market Select */}
        <select
          className="agri-market-filters__select"
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          aria-label={t('marketPrices.mandi', 'Filter by mandi market')}
        >
          <option value="ALL">{t('marketPrices.allMarkets', 'All Markets')}</option>
          {marketList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Trend Select */}
        <select
          className="agri-market-filters__select"
          value={selectedTrend}
          onChange={(e) => onTrendChange(e.target.value)}
          aria-label={t('marketPrices.priceTrend', 'Filter by trend')}
        >
          <option value="ALL">{t('marketPrices.allTrends', 'All Trends')}</option>
          <option value="RISING">{t('marketPrices.rising', 'Rising')}</option>
          <option value="FALLING">{t('marketPrices.falling', 'Falling')}</option>
          <option value="STABLE">{t('marketPrices.stable', 'Stable')}</option>
        </select>

        {/* Quality Grade */}
        <select
          className="agri-market-filters__select"
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          aria-label={t('harvests.quality', 'Filter by quality grade')}
        >
          <option value="ALL">{t('marketPrices.allGrades', 'All Grades')}</option>
          <option value="A">{t('harvests.gradeA', 'Grade A')}</option>
          <option value="B">{t('harvests.gradeB', 'Grade B')}</option>
        </select>

        {/* Reset Button */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label={t('common.clearFilters', 'Reset all filters')}
          >
            <X size={14} />
            <span>{t('common.clear', 'Reset')}</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="agri-market-filters__view-toggles" role="group" aria-label={t('common.view', 'View toggle')}>
          <button
            type="button"
            className={`agri-market-filters__view-btn ${
              viewMode === 'table' ? 'agri-market-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title={t('common.table', 'Table View')}
            aria-label={t('common.table', 'Table View')}
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-market-filters__view-btn ${
              viewMode === 'cards' ? 'agri-market-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title={t('common.grid', 'Card View')}
            aria-label={t('common.grid', 'Card View')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
