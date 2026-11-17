import { useTranslation } from 'react-i18next';
import { Warehouse, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { calculateProfitByFarm } from '../../utils/financialCalculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Button } from '../common';

export default function ProfitLossByFarm({ farmSummaries = [], sales = [], expenses = [], onSelectFarm }) {
  const { t } = useTranslation();
  const farmList = Array.isArray(farmSummaries) && farmSummaries.length > 0
    ? farmSummaries
    : calculateProfitByFarm(sales, expenses);

  return (
    <div className="agri-pl-panel">
      <div className="agri-pl-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Warehouse size={18} style={{ color: 'var(--primary-700)' }} />
          <h3 className="agri-pl-panel__title">{t('profitLoss.profitByFarm', 'Holding-Wise Financial Performance')}</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          {t('profitLoss.holdingsCount', '{{count}} Holdings', { count: farmList.length })}
        </span>
      </div>

      <div className="agri-pl-panel__body">
        {farmList.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            {t('profitLoss.noFarmsRecorded', 'No farm holding financial records found for the selected filter criteria.')}
          </div>
        ) : (
          <table className="agri-pl-table">
            <thead>
              <tr>
                <th>{t('farms.farm', 'Farm / Holding')}</th>
                <th>{t('revenue.totalRevenue', 'Revenue')}</th>
                <th>{t('expenses.title', 'Expenses')}</th>
                <th>{t('profitLoss.netProfit', 'Net Profit / Loss')}</th>
                <th>{t('profitLoss.margin', 'Margin')}</th>
                <th style={{ textAlign: 'right' }}>{t('common.actions', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {farmList.map((item) => {
                const isProfit = (item.netProfit != null ? item.netProfit : item.profit) >= 0;
                const farmName = item.farmName || `Farm #${item.farmId}`;
                const revenueVal = item.revenue != null ? item.revenue : 0;
                const expenseVal = item.expenses != null ? item.expenses : (item.expense != null ? item.expense : 0);
                const profitVal = item.netProfit != null ? item.netProfit : (item.profit != null ? item.profit : 0);
                const marginVal = item.netMarginPercent != null ? item.netMarginPercent : (item.margin != null ? item.margin : 0);

                return (
                  <tr key={item.farmId}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {t(`farms.demoNames.${item.farmId}`, farmName)}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                        {item.salesCount != null ? (
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
                        onClick={() => onSelectFarm && onSelectFarm(item)}
                        aria-label={`${t('common.viewDetails', 'View details')} ${farmName}`}
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

