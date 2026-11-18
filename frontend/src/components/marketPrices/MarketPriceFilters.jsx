import { useTranslation } from 'react-i18next';
import { Search, LayoutGrid, Table, X } from 'lucide-react';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function MarketPriceFilters({
  selectedState = 'Karnataka',
  onStateChange,
  stateList = [],
  selectedDistrict = 'ALL',
  onDistrictChange,
  districtList = [],
  selectedMarket = 'ALL',
  onMarketChange,
  marketList = [],
  selectedCrop = 'ALL',
  onCropChange,
  cropList = [],
  selectedDate = '',
  onDateChange,
  searchQuery = '',
  onSearchChange,
  selectedVariety = 'ALL',
  onVarietyChange,
  varietyList = [],
  selectedTrend = 'ALL',
  onTrendChange,
  selectedGrade = 'ALL',
  onGradeChange,
  viewMode = 'table',
  onViewModeChange,
  onResetFilters,
  isLoadingMarkets = false,
}) {
  const { t } = useTranslation();

  const isFiltered =
    Boolean(searchQuery) ||
    Boolean(selectedDate) ||
    selectedState !== 'Karnataka' ||
    selectedDistrict !== 'ALL' ||
    selectedMarket !== 'ALL' ||
    selectedCrop !== 'ALL' ||
    selectedVariety !== 'ALL' ||
    selectedTrend !== 'ALL' ||
    selectedGrade !== 'ALL';

  return (
    <div className="agri-market-filters">
      {/* Primary Cascading Hierarchy Row: State -> District -> Mandi/APMC -> Commodity -> Date */}
      <div className="agri-market-filters__row" style={{ alignItems: 'flex-end' }}>
        {/* 1. State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)' }}>
            {t('marketPrices.state', 'State')}
          </label>
          <select
            className="agri-market-filters__select"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            aria-label={t('marketPrices.state', 'Filter by state')}
            style={{ fontWeight: 600, color: 'var(--slate-900)' }}
          >
            {stateList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* 2. District */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)' }}>
            {t('marketPrices.district', 'District')}
          </label>
          <select
            className="agri-market-filters__select"
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={isLoadingMarkets}
            aria-label={t('marketPrices.district', 'Filter by district')}
          >
            <option value="ALL">{t('marketPrices.allDistricts', 'All Districts')}</option>
            {districtList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 3. APMC / Mandi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)' }}>
            {t('marketPrices.mandi', 'APMC / Mandi')}
          </label>
          <select
            className="agri-market-filters__select"
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            disabled={isLoadingMarkets || marketList.length === 0}
            aria-label={t('marketPrices.mandi', 'Filter by mandi market')}
            style={{ minWidth: '180px', fontWeight: selectedMarket !== 'ALL' ? 600 : 400 }}
          >
            <option value="ALL">
              {isLoadingMarkets ? t('marketPrices.loadingMarkets', 'Loading mandis...') : t('marketPrices.allMandis', 'Select APMC Market')}
            </option>
            {marketList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Commodity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)' }}>
            {t('marketPrices.commodity', 'Commodity')}
          </label>
          <select
            className="agri-market-filters__select"
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            aria-label={t('marketPrices.commodity', 'Filter by commodity')}
            style={{ minWidth: '140px' }}
          >
            <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
            {cropList.map((c) => (
              <option key={c} value={c}>
                {translateCrop(c, t)}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)' }}>
            {t('common.date', 'Bulletin Date')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              className="agri-market-filters__select"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              aria-label={t('common.date', 'Filter by date')}
              style={{ minWidth: '140px', padding: '0.5rem 0.65rem' }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Refinement Row: Search, Variety, Trend, Grade, View Toggles */}
      <div className="agri-market-filters__row" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
        {/* Search */}
        <div className="agri-market-filters__search">
          <Search size={16} className="agri-market-filters__search-icon" />
          <input
            type="text"
            className="agri-market-filters__search-input"
            placeholder={t('common.searchPlaceholder', 'Search by variety, grade, keyword...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('common.search', 'Search market prices')}
          />
        </div>

        {/* Variety Select (when crop selected) */}
        {varietyList.length > 0 && (
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
        )}

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
            title={t('common.grid', 'Grid View')}
            aria-label={t('common.grid', 'Grid View')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
