import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '../common';
import HarvestStatusBadge from './HarvestStatusBadge';
import { formatWeight } from '../../utils/formatters';

export default function HarvestTable({ harvests, onViewDetails, onRecordSale }) {
  return (
    <div className="agri-harvest-table-container">
      <div className="agri-harvest-table-scroll">
        <table className="agri-harvest-table">
          <thead>
            <tr>
              <th>Harvest ID</th>
              <th>Crop & Variety</th>
              <th>Farm & Field</th>
              <th>Harvest Date</th>
              <th>Harvested Qty</th>
              <th>Available Qty</th>
              <th>Sold Qty</th>
              <th>Quality</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map((harvest) => {
              const gradeClass =
                harvest.qualityGrade === 'A'
                  ? 'agri-quality-pill--a'
                  : harvest.qualityGrade === 'B'
                  ? 'agri-quality-pill--b'
                  : 'agri-quality-pill--c';

              return (
                <tr key={harvest.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'monospace' }}>
                      {harvest.id}
                    </span>
                  </td>
                  <td>
                    <div className="agri-harvest-table__crop-cell">
                      <span className="agri-harvest-table__crop-name">{harvest.cropName}</span>
                      <span className="agri-harvest-table__crop-variety">
                        {harvest.variety} • {harvest.season}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="agri-harvest-table__farm-cell">
                      <span className="agri-harvest-table__farm-name">{harvest.farmName}</span>
                      <span className="agri-harvest-table__field-name">{harvest.fieldName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--slate-600)' }}>
                      {harvest.harvestDate}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {formatWeight(harvest.harvestedQuantityKg, 'kg')}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {(harvest.harvestedQuantityKg / 100).toFixed(1)} q
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: harvest.availableQuantityKg > 0 ? 'var(--primary-700)' : 'var(--slate-400)',
                      }}
                    >
                      {formatWeight(harvest.availableQuantityKg, 'kg')}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--slate-600)' }}>
                      {formatWeight(harvest.soldQuantityKg, 'kg')}
                    </span>
                  </td>
                  <td>
                    <span className={`agri-quality-pill ${gradeClass}`}>
                      Grade {harvest.qualityGrade} ({harvest.qualityScore})
                    </span>
                  </td>
                  <td>
                    <HarvestStatusBadge status={harvest.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(harvest)}
                        aria-label={`View details for ${harvest.id}`}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Button>
                      {harvest.availableQuantityKg > 0 && onRecordSale && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onRecordSale(harvest)}
                          aria-label={`Record sale for ${harvest.id}`}
                        >
                          <PlusCircle size={14} />
                          <span>Sell</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
