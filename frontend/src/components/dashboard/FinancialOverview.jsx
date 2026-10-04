import { Link } from 'react-router-dom';
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
import { ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';
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
  const {
    expenses = 32000,
    revenue = 50000,
    netProfit = 18000,
    netMargin = 36.0,
    costPerQuintal = 1280,
    harvestYieldKg = 2500,
    averageMandiRatePerKg = 20,
    period = 'Current Season (Rabi 2025-26)',
  } = financialSummary || {};

  return (
    <div className="agri-finance-card">
      <div className="agri-card__header" style={{ padding: 0 }}>
        <div>
          <h3 className="agri-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} className="text-primary" aria-hidden="true" />
            Financial Performance Overview
          </h3>
          <p className="agri-card__subtitle">{period} • PPT Operational Benchmark</p>
        </div>
        <Link to="/profit-loss" className="agri-card-action-link">
          <span>Profit & Loss statement</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Primary 4 Metric Tiles */}
      <div className="agri-finance-stats-grid">
        <Link to="/revenue" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">Total Revenue</span>
          <div className="agri-finance-stat__val" style={{ color: '#16a34a' }}>
            {formatCurrency(revenue)}
          </div>
          <span className="agri-finance-stat__sub">Gross farm receipts →</span>
        </Link>

        <Link to="/expenses" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">Total Expenses</span>
          <div className="agri-finance-stat__val" style={{ color: '#b45309' }}>
            {formatCurrency(expenses)}
          </div>
          <span className="agri-finance-stat__sub">Inputs, labor, power →</span>
        </Link>

        <Link to="/profit-loss" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">Net Profit</span>
          <div className="agri-finance-stat__val agri-finance-stat__val--profit">
            +{formatCurrency(netProfit)}
          </div>
          <span className="agri-finance-stat__sub">Surplus before tax →</span>
        </Link>

        <Link to="/profit-loss" className="agri-finance-stat" style={{ textDecoration: 'none', display: 'block' }}>
          <span className="agri-finance-stat__label">Net Margin</span>
          <div className="agri-finance-stat__val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>{netMargin}%</span>
            <TrendingUp size={16} className="text-success" aria-hidden="true" />
          </div>
          <span className="agri-finance-stat__sub">Profitability ratio →</span>
        </Link>
      </div>

      {/* Recharts Bar Chart: Revenue vs Expenses */}
      <div className="agri-chart-wrapper" aria-label="Revenue versus Expenses Chart">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={monthlyFinancials}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
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
              name="Revenue (₹)"
              dataKey="revenue"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              name="Expenses (₹)"
              dataKey="expenses"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PPT Financial Reference Metrics Strip */}
      <div className="agri-finance-metrics-strip">
        <span>
          Cost per Quintal: <strong>{formatCurrency(costPerQuintal)}/q</strong>
        </span>
        <span>•</span>
        <span>
          Harvest Yield: <strong>{harvestYieldKg.toLocaleString('en-IN')} kg</strong>
        </span>
        <span>•</span>
        <span>
          Average Mandi Rate: <strong>₹{averageMandiRatePerKg}/kg</strong>
        </span>
        <span>•</span>
        <span style={{ color: 'var(--slate-400)' }}>Deterministic PPT Reference</span>
      </div>
    </div>
  );
}
