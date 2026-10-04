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
  const isFiltered =
    selectedPeriod !== 'ALL' || selectedFarm !== 'ALL' || selectedCrop !== 'ALL';

  return (
    <div className="agri-pl-filters">
      <div className="agri-pl-filters__row">
        {/* Period Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Period:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            aria-label="Filter by financial period"
          >
            <option value="ALL">All Time (Full Cycle)</option>
            <option value="THIS_MONTH">This Month (Oct 2026)</option>
            <option value="PREVIOUS_MONTH">Previous Month (Sep 2026)</option>
          </select>
        </div>

        {/* Farm Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Holding:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedFarm}
            onChange={(e) => onFarmChange(e.target.value)}
            aria-label="Filter by farm holding"
          >
            <option value="ALL">All Holdings</option>
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
            Crop:
          </span>
          <select
            className="agri-pl-filters__select"
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            aria-label="Filter by agronomic crop"
          >
            <option value="ALL">All Crops</option>
            {cropList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label="Reset all financial filters"
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
