import { useTranslation } from 'react-i18next';
import { Eye, FlaskConical, RotateCcw } from 'lucide-react';
import SoilStatus from './SoilStatus';
import { Button, EmptyState } from '../common';
import { formatFieldName, translateSoilType } from '../../utils/displayLabels';

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
  const { t } = useTranslation();

  if (records.length === 0) {
    return (
      <EmptyState
        icon={<FlaskConical size={32} aria-hidden="true" />}
        title={t('common.noData', 'No soil test records found')}
        description={
          isFiltered
            ? t('common.noData', 'No records match the current filter criteria.')
            : t('common.noData', 'No soil tests have been recorded yet.')
        }
        action={
          isFiltered && (
            <Button
              variant="outline"
              icon={<RotateCcw size={15} aria-hidden="true" />}
              onClick={onResetFilters}
            >
              {t('common.clear', 'Reset Filters')}
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
      <table className="agri-soil-table" aria-label={t('soil.soilReport', 'Soil Test Records Table')}>
        <thead>
          <tr>
            <th scope="col">{t('fields.fieldName', 'Field')} & {t('fields.farm', 'Holding')}</th>
            <th scope="col">{t('fields.soilType', 'Soil Type')}</th>
            <th scope="col">{t('soil.ph', 'pH Level')}</th>
            <th scope="col">N-P-K (kg/ha)</th>
            <th scope="col">{t('soil.organicCarbon', 'Organic Carbon')}</th>
            <th scope="col">{t('soil.moisture', 'Moisture')}</th>
            <th scope="col">{t('common.status', 'Condition')}</th>
            <th scope="col">{t('soil.testDate', 'Test Date')}</th>
            <th scope="col" style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="agri-soil-field-cell">
                  <span className="agri-soil-field-name">{formatFieldName(r.fieldName, t)}</span>
                  <span className="agri-soil-farm-name">{t(`farms.demoNames.${r.farmId}`, r.farmName)}</span>
                </div>
              </td>
              <td>
                <span>{translateSoilType(r.soilType, t)}</span>
              </td>
              <td>
                <span className={`agri-soil-ph-badge ${getPhBadgeClass(r.ph)}`}>
                  {r.ph != null ? `${r.ph} pH` : '-'}
                </span>
              </td>
              <td>
                <div className="agri-soil-npk-cell">
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--n" title={t('soil.nitrogen', 'Nitrogen')}>
                    N:{r.nitrogen != null ? r.nitrogen : '-'}
                  </span>
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--p" title={t('soil.phosphorus', 'Phosphorus')}>
                    P:{r.phosphorus != null ? r.phosphorus : '-'}
                  </span>
                  <span className="agri-soil-npk-pill agri-soil-npk-pill--k" title={t('soil.potassium', 'Potassium')}>
                    K:{r.potassium != null ? r.potassium : '-'}
                  </span>
                </div>

              </td>
              <td>
                <strong>{r.organicCarbon != null ? `${r.organicCarbon}%` : '-'}</strong>
              </td>
              <td>
                <span>{r.moisturePercent != null ? `${r.moisturePercent}%` : '-'}</span>
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
                  {t('soil.soilReport', 'Report')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
