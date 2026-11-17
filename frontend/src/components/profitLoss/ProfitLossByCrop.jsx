import { useTranslation } from 'react-i18next';
import { Sprout, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { calculateProfitByCrop } from '../../utils/financialCalculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Button } from '../common';
import { translateCrop } from '../../utils/displayLabels';

export default function ProfitLossByCrop({ cropSummaries = [], sales = [], expenses = [], onSelectCrop }) {
  const { t } = useTranslation();
  const cropList = Array.isArray(cropSummaries) && cropSummaries.length > 0
    ? cropSummaries
    : calculateProfitByCrop(sales, expenses);

  return (
    <div className="agri-pl-panel">
      <div className="agri-pl-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sprout size={18} style={{ color: 'var(--primary-700)' }} />
          <h3 className="agri-pl-panel__title">{t('profitLoss.profitByCrop', 'Crop-Wise Financial Performance')}</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          {t('profitLoss.activeCropsCount', '{{count}} Active Crops', { count: cropList.length })}
        </span>
      </div>

      <div className="agri-pl-panel__body">
        {cropList.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            {t('profitLoss.noCropsRecorded', 'No crop financial records found for the selected filter criteria.')}
          </div>
        ) : (
          <table className="agri-pl-table">
            <thead>
              <tr>
                <th>{t('crops.crop', 'Crop')}</th>
                <th>{t('revenue.totalRevenue', 'Revenue')}</th>
                <th>{t('expenses.title', 'Expenses')}</th>
                <th>{t('profitLoss.netProfit', 'Net Profit / Loss')}</th>
                <th>{t('profitLoss.margin', 'Margin')}</th>
                <th style={{ textAlign: 'right' }}>{t('common.actions', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {cropList.map((item) => {
                const isProfit = (item.netProfit != null ? item.netProfit : item.profit) >= 0;
                const cropName = item.cropName || item.crop || 'Unknown';
                const revenueVal = item.revenue != null ? item.revenue : 0;
                const expenseVal = item.expenses != null ? item.expenses : (item.expense != null ? item.expense : 0);
                const profitVal = item.netProfit != null ? item.netProfit : (item.profit != null ? item.profit : 0);
                const marginVal = item.netMarginPercent != null ? item.netMarginPercent : (item.margin != null ? item.margin : 0);

                return (
                  <tr key={item.cropCycleId || cropName}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {translateCrop(cropName, t)} {item.variety ? `(${item.variety})` : ''}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                        {item.costPerQuintal > 0 ? (
                          <span>{formatCurrency(item.costPerQuintal)}/q • {(item.harvestYieldKg / 100).toFixed(1)} q yield</span>
                        ) : item.salesCount != null ? (
                          t('profitLoss.salesVouchersCount', '{{sales}} sales • {{expenses}} vouchers', { sales: item.salesCount, expenses: item.expenseCount })
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(revenueVal)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#dc2626' }}>
                        {formatCurrency(expenseVal)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 800, color: isProfit ? '#059669' : '#dc2626' }}>
                        {isProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{isProfit ? '+' : ''}{formatCurrency(profitVal)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`agri-margin-badge ${isProfit ? 'agri-margin-badge--positive' : 'agri-margin-badge--negative'}`}>
                        {formatPercentage(marginVal)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCrop && onSelectCrop(item)}
                        aria-label={`${t('common.viewDetails', 'View details')} ${cropName}`}
                      >
                        <Eye size={13} />
                        <span>{t('common.details', 'Details')}</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

