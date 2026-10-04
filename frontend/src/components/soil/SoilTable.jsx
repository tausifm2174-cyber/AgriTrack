import { Eye, FlaskConical, RotateCcw } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button, EmptyState } from '../common';

/**
 * SoilTable component
 * Renders laboratory soil test records in a structured tabular presentation.
 */
export default function SoilTable({
  records = [],
  onViewDetails,
  onResetFilters,
  isFiltered = false,
}) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={<FlaskConical size={32} aria-hidden="true" />}
        title="No soil test records found"
        description={
          isFiltered
            ? "No records match the current filter criteria."
            : "No soil tests have been recorded yet."
        }
        action={
          isFiltered && (
            <Button
              variant="outline"
              icon={<RotateCcw size={15} aria-hidden="true" />}
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          )
        }
      />
    );
  }

  const getPhBadgeClass = (ph) => {
    if (ph < 6.0) return 'agri-soil-ph-badge--acidic';
    if (ph > 7.5) return 'agri-soil-ph-badge--alkaline';
    return 'agri-soil-ph-badge--neutral';
  };

  return (
    <div className="agri-soil-table-container">
      <table className="agri-soil-table" aria-label="Soil Test Records Table">
        <thead>
          <tr>
            <th scope="col">Field & Holding</th>
            <th scope="col">Soil Type</th>
            <th scope="col">pH Level</th>
            <th scope="col">N-P-K (kg/ha)</th>
            <th scope="col">Organic Carbon</th>
            <th scope="col">Moisture</th>
            <th scope="col">Condition</th>
            <th scope="col">Test Date</th>
            <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="agri-soil-field-cell">
                  <span className="agri-soil-field-name">{r.fieldName}</span>
                  <span className="agri-soil-farm-name">{r.farmName}</span>
                </div>
              </td>
              <td>
                <span>{r.soilType}</span>
              </td>
              <td>
                <span className={`agri-soil-ph-badge ${getPhBadgeClass(r.ph)}`}>
                  {r.ph} pH
                </span>
              </td>
              <td>
                <div className="agri-soil-npk-cell">
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--n" title="Nitrogen">
                    N:{r.nitrogen}
                  </span>
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--p" title="Phosphorus">
                    P:{r.phosphorus}
                  </span>
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--k" title="Potassium">
                    K:{r.potassium}
                  </span>
                </div>
              </td>
              <td>
                <strong>{r.organicCarbon}%</strong>
              </td>
              <td>
                <span>{r.moisturePercent}%</span>
              </td>
              <td>
                <SoilStatus status={r.status} variant={r.statusVariant} />
              </td>
              <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {r.testDate}
              </td>
              <td style={{ textAlign: 'right' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Eye size={14} aria-hidden="true" />}
                  onClick={() => onViewDetails(r)}
                >
                  Report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
