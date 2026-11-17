import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function ProfitLossFilters({
  selectedPeriod,
  onPeriodChange,
  selectedFarm,
  onFarmChange,
  selectedCrop,
  onCropChange,
  onResetFilters,
  farmList = [],
  cropList = [],
}) {
  const { t } = useTranslation();
  const isFiltered =
    selectedPeriod !== 'ALL' || selectedFarm !== 'ALL' || selectedCrop !== 'ALL';

  return (
    <div className="agri-pl-filters">
      <div className="agri-pl-filters__row">
        {/* Period Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            {t('common.date', 'Period')}:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            aria-label="Filter by financial period"
          >
            <option value="ALL">{t('profitLoss.allTime', 'All Time (Full Cycle)')}</option>
            <option value="THIS_MONTH">{t('profitLoss.thisMonth', 'This Month (Oct 2026)')}</option>
            <option value="PREVIOUS_MONTH">{t('profitLoss.prevMonth', 'Previous Month (Sep 2026)')}</option>
          </select>
        </div>

        {/* Farm Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            {t('farms.farm', 'Holding')}:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedFarm}
            onChange={(e) => onFarmChange(e.target.value)}
            aria-label="Filter by farm holding"
          >
            <option value="ALL">{t('farms.allFarms', 'All Holdings')}</option>
            {farmList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            {t('crops.crop', 'Crop')}:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            aria-label="Filter by agronomic crop"
          >
            <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
            {cropList.map((c) => {
              const val = typeof c === 'object' && c !== null ? c.id : c;
              const label = typeof c === 'object' && c !== null ? c.name : c;
              return (
                <option key={val} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label={t('common.clearFilters', 'Reset Filters')}
          >
            <X size={14} />
            <span>{t('common.clearFilters', 'Reset Filters')}</span>
          </button>
        )}
      </div>
    </div>
  );
}

