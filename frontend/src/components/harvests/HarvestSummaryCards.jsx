import { PackageCheck, Scale, ShoppingBag, Award, CheckCircle2 } from 'lucide-react';
import { formatWeight } from '../../utils/formatters';

export default function HarvestSummaryCards({ harvests = [] }) {
  const totalHarvests = harvests.length;

  const totalHarvestedKg = harvests.reduce(
    (acc, curr) => acc + (curr.harvestedQuantityKg || 0),
    0
  );

  const availableQuantityKg = harvests.reduce(
    (acc, curr) => acc + (curr.availableQuantityKg || 0),
    0
  );

  const soldQuantityKg = harvests.reduce(
    (acc, curr) => acc + (curr.soldQuantityKg || 0),
    0
  );

  const harvestedRecordsWithScore = harvests.filter((h) => h.qualityScore > 0);
  const avgQualityScore =
    harvestedRecordsWithScore.length > 0
      ? Math.round(
          harvestedRecordsWithScore.reduce((acc, curr) => acc + curr.qualityScore, 0) /
            harvestedRecordsWithScore.length
        )
      : 0;

  return (
    <div className="agri-harvest-summary-grid">
      {/* 1. Total Harvests */}
      <div className="agri-harvest-summary-card">
        <div className="agri-harvest-summary-card__icon-box agri-harvest-summary-card__icon-box--green">
          <PackageCheck size={22} />
        </div>
        <div className="agri-harvest-summary-card__content">
          <span className="agri-harvest-summary-card__label">Total Harvests</span>
          <span className="agri-harvest-summary-card__value">{totalHarvests}</span>
          <span className="agri-harvest-summary-card__subtext">Across 3 active farms</span>
        </div>
      </div>

      {/* 2. Total Harvested */}
      <div className="agri-harvest-summary-card">
        <div className="agri-harvest-summary-card__icon-box agri-harvest-summary-card__icon-box--blue">
          <Scale size={22} />
        </div>
        <div className="agri-harvest-summary-card__content">
          <span className="agri-harvest-summary-card__label">Total Harvested</span>
          <span className="agri-harvest-summary-card__value">
            {formatWeight(totalHarvestedKg, 'kg')}
          </span>
          <span className="agri-harvest-summary-card__subtext">
            {(totalHarvestedKg / 100).toFixed(1)} quintals produced
          </span>
        </div>
      </div>

      {/* 3. Available for Sale */}
      <div className="agri-harvest-summary-card">
        <div className="agri-harvest-summary-card__icon-box agri-harvest-summary-card__icon-box--amber">
          <ShoppingBag size={22} />
        </div>
        <div className="agri-harvest-summary-card__content">
          <span className="agri-harvest-summary-card__label">Available For Sale</span>
          <span className="agri-harvest-summary-card__value">
            {formatWeight(availableQuantityKg, 'kg')}
          </span>
          <span className="agri-harvest-summary-card__subtext">
            {totalHarvestedKg > 0
              ? `${Math.round((availableQuantityKg / totalHarvestedKg) * 100)}% stock available`
              : '0% in storage'}
          </span>
        </div>
      </div>

      {/* 4. Sold Quantity */}
      <div className="agri-harvest-summary-card">
        <div className="agri-harvest-summary-card__icon-box agri-harvest-summary-card__icon-box--purple">
          <CheckCircle2 size={22} />
        </div>
        <div className="agri-harvest-summary-card__content">
          <span className="agri-harvest-summary-card__label">Sold Quantity</span>
          <span className="agri-harvest-summary-card__value">
            {formatWeight(soldQuantityKg, 'kg')}
          </span>
          <span className="agri-harvest-summary-card__subtext">
            {(soldQuantityKg / 100).toFixed(1)} quintals offloaded
          </span>
        </div>
      </div>

      {/* 5. Average Quality */}
      <div className="agri-harvest-summary-card">
        <div className="agri-harvest-summary-card__icon-box agri-harvest-summary-card__icon-box--slate">
          <Award size={22} />
        </div>
        <div className="agri-harvest-summary-card__content">
          <span className="agri-harvest-summary-card__label">Average Quality</span>
          <span className="agri-harvest-summary-card__value">{avgQualityScore} / 100</span>
          <span className="agri-harvest-summary-card__subtext">Grade A benchmark quality</span>
        </div>
      </div>
    </div>
  );
}
