import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { PPT_FINANCIAL_REFERENCE } from '../../data/profitLossData';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function ProfitLossOverview({
  totalRevenue = 0,
  totalExpenses = 0,
  netProfit = 0,
  netMargin = 0,
}) {
  const { t } = useTranslation();
  const isProfitable = netProfit >= 0;

  // Percentage of revenue consumed by expenses
  const expenseRatio = totalRevenue > 0 ? Math.min(100, Math.round((totalExpenses / totalRevenue) * 100)) : 0;
  const profitRatio = totalRevenue > 0 ? Math.max(0, 100 - expenseRatio) : 0;

  return (
    <div className="agri-pl-overview-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            {t('profitLoss.executiveBalance', 'Executive Operating Balance')}
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            {t('profitLoss.syncDesc', 'Real-time synchronization between crop sales inflows and field expenditure vouchers')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--slate-600)', backgroundColor: 'var(--slate-100)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
          <Info size={13} />
          <span>PPT Benchmark: {formatCurrency(PPT_FINANCIAL_REFERENCE.revenue)} Rev | {formatCurrency(PPT_FINANCIAL_REFERENCE.expenses)} Exp | {PPT_FINANCIAL_REFERENCE.netMargin}% Margin</span>
        </div>
      </div>

      {/* 4 Executive KPI Blocks */}
      <div className="agri-pl-overview-grid">
        <div className="agri-pl-overview-stat">
          <span className="agri-pl-overview-stat__label">{t('revenue.totalRevenue', 'Total Revenue')}</span>
          <span className="agri-pl-overview-stat__value" style={{ color: '#059669' }}>
            {formatCurrency(totalRevenue)}
          </span>
          <span className="agri-pl-overview-stat__sub">
            {t('profitLoss.grossInvoicedSales', 'Gross invoiced sales from harvests')}
          </span>
        </div>

        <div className="agri-pl-overview-stat">
          <span className="agri-pl-overview-stat__label">{t('profitLoss.totalExpenses', 'Total Expenses')}</span>
          <span className="agri-pl-overview-stat__value" style={{ color: '#dc2626' }}>
            {formatCurrency(totalExpenses)}
          </span>
          <span className="agri-pl-overview-stat__sub">
            {t('profitLoss.revenueConsumed', '{{pct}}% of revenue consumed', { pct: expenseRatio })}
          </span>
        </div>

        <div className="agri-pl-overview-stat">
          <span className="agri-pl-overview-stat__label">{t('profitLoss.netProfit', 'Net Operating Profit')}</span>
          <span
            className="agri-pl-overview-stat__value"
            style={{ color: isProfitable ? '#059669' : '#dc2626' }}
          >
            {isProfitable ? `+${formatCurrency(netProfit)}` : formatCurrency(netProfit)}
          </span>
          <span className="agri-pl-overview-stat__sub" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {isProfitable ? (
              <>
                <ArrowUpRight size={14} style={{ color: '#059669' }} />
                <span style={{ color: '#059669', fontWeight: 600 }}>{t('profitLoss.positiveReturn', 'Positive Farm Return')}</span>
              </>
            ) : (
              <>
                <ArrowDownRight size={14} style={{ color: '#dc2626' }} />
                <span style={{ color: '#dc2626', fontWeight: 600 }}>{t('profitLoss.operatingDeficit', 'Operating Deficit')}</span>
              </>
            )}
          </span>
        </div>

        <div className="agri-pl-overview-stat">
          <span className="agri-pl-overview-stat__label">{t('profitLoss.netMargin', 'Net Margin Ratio')}</span>
          <span
            className="agri-pl-overview-stat__value"
            style={{ color: isProfitable ? '#2563eb' : '#dc2626' }}
          >
            {formatPercentage(netMargin)}
          </span>
          <span className="agri-pl-overview-stat__sub">
            {isProfitable ? t('profitLoss.healthyMargin', 'Healthy agricultural margin') : t('profitLoss.marginAlert', 'Margin contraction alert')}
          </span>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          <span>{t('profitLoss.inputExpenditures', 'Input Expenditures ({{pct}}%)', { pct: expenseRatio })}</span>
          <span>{t('profitLoss.retainedProfit', 'Retained Net Profit ({{pct}}%)', { pct: profitRatio })}</span>
        </div>
        <div className="agri-pl-balance-bar">
          <div
            className="agri-pl-balance-bar__expense"
            style={{ width: `${expenseRatio}%` }}
            title={`Expenses: ${expenseRatio}%`}
          />
          <div
            className="agri-pl-balance-bar__profit"
            style={{ width: `${profitRatio}%` }}
            title={`Net Profit: ${profitRatio}%`}
          />
        </div>
      </div>
    </div>
  );
}

