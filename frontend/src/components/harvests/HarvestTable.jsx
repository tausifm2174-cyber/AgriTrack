import { useTranslation } from 'react-i18next';
import { Eye, PlusCircle } from 'lucide-react';
import { Button } from '../common';
import HarvestStatusBadge from './HarvestStatusBadge';
import { formatWeight } from '../../utils/formatters';
import {
  translateCrop,
  translateVariety,
  translateSeason,
  formatFieldName,
} from '../../utils/displayLabels';

export default function HarvestTable({ harvests, onViewDetails, onRecordSale }) {
  const { t } = useTranslation();

  return (
    <div className="agri-harvest-table-container">
      <div className="agri-harvest-table-scroll">
        <table className="agri-harvest-table">
          <thead>
            <tr>
              <th>{t('harvests.harvestId', 'Harvest ID')}</th>
              <th>{t('crops.cropVariety', 'Crop & Variety')}</th>
              <th>{t('fields.farmAndField', 'Farm & Field')}</th>
              <th>{t('harvests.harvestDate', 'Harvest Date')}</th>
              <th>{t('harvests.harvestQuantity', 'Harvested Qty')}</th>
              <th>{t('harvests.availableQuantity', 'Available Qty')}</th>
              <th>{t('harvests.soldQuantity', 'Sold Qty')}</th>
              <th>{t('harvests.quality', 'Quality')}</th>
              <th>{t('common.status', 'Status')}</th>
              <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
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
                      <span className="agri-harvest-table__crop-name">{translateCrop(harvest.cropName, t)}</span>
                      <span className="agri-harvest-table__crop-variety">
                        {translateVariety(harvest.variety, t)} • {translateSeason(harvest.season, t)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="agri-harvest-table__farm-cell">
                      <span className="agri-harvest-table__farm-name">{t(`farms.demoNames.${harvest.farmId}`, harvest.farmName)}</span>
                      <span className="agri-harvest-table__field-name">{formatFieldName(harvest.fieldName, t)}</span>
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
                        {(harvest.harvestedQuantityKg / 100).toFixed(1)} {t('units.q', 'q')}
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
                      {t('harvests.grade', 'Grade')} {harvest.qualityGrade} ({harvest.qualityScore})
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
                        aria-label={`${t('common.viewDetails', 'View details')} ${harvest.id}`}
                      >
                        <Eye size={14} />
                        <span>{t('common.view', 'View')}</span>
                      </Button>
                      {harvest.availableQuantityKg > 0 && onRecordSale && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onRecordSale(harvest)}
                          aria-label={`${t('sales.addSale', 'Record sale')} ${harvest.id}`}
                        >
                          <PlusCircle size={14} />
                          <span>{t('sales.addSale', 'Sell')}</span>
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
