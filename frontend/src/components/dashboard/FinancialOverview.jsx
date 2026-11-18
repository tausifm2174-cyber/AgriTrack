import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

/**
 * Custom Tooltip for Financial Chart
 */
function FinancialTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="agri-chart-tooltip">
        <p className="agri-chart-tooltip__title">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="agri-chart-tooltip__item">
            <span
              className="agri-chart-tooltip__dot"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <strong style={{ color: 'var(--slate-800)' }}>
              {formatCurrency(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * FinancialOverview Component
 * @param {Object} props
 * @param {Object} props.financialSummary
 * @param {Array} props.monthlyFinancials
 */
export default function FinancialOverview({ financialSummary, monthlyFinancials = [] }) {
  const { t, i18n } = useTranslation();
  const {
    expenses = 0,
    revenue = 0,
    netProfit = 0,
    netMargin = 0,
    costPerQuintal = null,
    harvestYieldKg = null,
    averageMandiRatePerKg = null,
    period = 'Current Season',
  } = financialSummary || {};

  const localizedFinancials = (monthlyFinancials || []).map((m) => {
    let label = m.month || '';
    const isCurrent = label.includes('Current');
    const rawMonth = label.replace(/\s*\(Current\)/, '').trim();
    const monthIndex = { Oct: 9, Nov: 10, Dec: 11, Jan: 0, Feb: 1, Mar: 2 }[rawMonth];
    if (monthIndex !== undefined) {
      try {
        const localizedMonth = new Intl.DateTimeFormat(i18n.language || 'en-IN', { month: 'short' }).format(new Date(2026, monthIndex, 1));
        label = isCurrent ? `${localizedMonth} (${t('dashboard.current', 'Current')})` : localizedMonth;
      } catch {
        // fallback
      }
    }
    return {
      ...m,
      monthDisplay: label,
    };
  });

  return (
    <div className="agri-finance-card">
      <div className="agri-card__header" style={{ padding: 0 }}>
        <div>
          <h3 className="agri-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} className="text-primary" aria-hidden="true" />
            {t('dashboard.financialOverview', 'Financial Performance Overview')}
          </h3>
          <p className="agri-card__subtitle">{t('dashboard.currentSeasonRabi', period)}</p>
        </div>
        <Link to="/profit-loss" className="agri-card-action-link">
          <span>{t('navigation.profitLoss', 'Profit & Loss statement')}</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Primary 4 Metric Tiles */}
      <div className="agri-finance-stats-grid">
        <Link to="/revenue" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">{t('revenue.totalRevenue', 'Total Revenue')}</span>
          <div className="agri-finance-stat__val" style={{ color: '#16a34a' }}>
            {formatCurrency(revenue)}
          </div>
          <span className="agri-finance-stat__sub">{t('revenue.title', 'Farm Revenue')} →</span>
        </Link>

        <Link to="/expenses" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">{t('expenses.totalExpenses', 'Total Expenses')}</span>
          <div className="agri-finance-stat__val" style={{ color: '#b45309' }}>
            {formatCurrency(expenses)}
          </div>
          <span className="agri-finance-stat__sub">{t('expenses.title', 'Farm Expenses')} →</span>
        </Link>

        <Link to="/profit-loss" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">{t('profitLoss.netProfit', 'Net Profit')}</span>
          <div className="agri-finance-stat__val agri-finance-stat__val--profit">
            +{formatCurrency(netProfit)}
          </div>
          <span className="agri-finance-stat__sub">{t('profitLoss.title', 'Profit & Loss')} →</span>
        </Link>

        <Link to="/profit-loss" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">{t('dashboard.netMargin', 'Net Margin')}</span>
          <div className="agri-finance-stat__val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>{netMargin}%</span>
          </div>
          <span className="agri-finance-stat__sub">{t('profitLoss.margin', 'Margin')} →</span>
        </Link>
      </div>

      {/* Recharts Bar Chart: Revenue vs Expenses */}
      <div className="agri-chart-wrapper" aria-label={t('profitLoss.financialComparison', 'Revenue versus Expenses Chart')}>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={localizedFinancials}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="monthDisplay"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip content={<FinancialTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Bar
              name={t('navigation.revenue', 'Revenue')}
              dataKey="revenue"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              name={t('navigation.expenses', 'Expenses')}
              dataKey="expenses"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reference Metrics Strip */}
      {(costPerQuintal != null || harvestYieldKg != null || averageMandiRatePerKg != null) && (
        <div className="agri-finance-metrics-strip">
          {costPerQuintal != null && (
            <span>
              {t('profitLoss.costPerQuintal', 'Cost per Quintal')}: <strong>{formatCurrency(costPerQuintal)}/{t('units.q', 'q')}</strong>
            </span>
          )}
          {harvestYieldKg != null && (
            <>
              {costPerQuintal != null && <span>•</span>}
              <span>
                {t('harvests.harvestQuantity', 'Harvest Yield')}: <strong>{harvestYieldKg.toLocaleString('en-IN')} {t('units.kg', 'kg')}</strong>
              </span>
            </>
          )}
          {averageMandiRatePerKg != null && (
            <>
              {(costPerQuintal != null || harvestYieldKg != null) && <span>•</span>}
              <span>
                {t('marketPrices.modalPrice', 'Average Mandi Rate')}: <strong>₹{averageMandiRatePerKg}/{t('units.kg', 'kg')}</strong>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
