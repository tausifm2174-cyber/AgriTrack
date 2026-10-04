import { Wallet, CreditCard, TrendingUp, TrendingDown, Percent, Scale, Tag } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function ProfitLossSummaryCards({
  totalRevenue = 0,
  totalExpenses = 0,
  netProfit = 0,
  netMargin = 0,
  costPerQuintal = 0,
  harvestYieldKg = 15000,
  averageMandiRate = 3993,
}) {
  const isProfitable = netProfit >= 0;

  return (
    <div className="agri-pl-summary-grid">
      {/* 1. Total Revenue */}
      <div className="agri-pl-summary-card">
        <div className="agri-pl-summary-card__icon-box agri-pl-summary-card__icon-box--green">
          <Wallet size={22} />
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Total Revenue</span>
          <span className="agri-pl-summary-card__value" style={{ color: '#059669' }}>
            {formatCurrency(totalRevenue)}
          </span>
          <span className="agri-pl-summary-card__subtext">
            Recognized gross sales
          </span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="agri-pl-summary-card">
        <div className="agri-pl-summary-card__icon-box agri-pl-summary-card__icon-box--red">
          <CreditCard size={22} />
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Total Expenses</span>
          <span className="agri-pl-summary-card__value" style={{ color: '#dc2626' }}>
            {formatCurrency(totalExpenses)}
          </span>
          <span className="agri-pl-summary-card__subtext">
            Operational input costs
          </span>
        </div>
      </div>

      {/* 3. Net Profit / Loss */}
      <div className="agri-pl-summary-card">
        <div
          className={`agri-pl-summary-card__icon-box ${
            isProfitable ? 'agri-pl-summary-card__icon-box--green' : 'agri-pl-summary-card__icon-box--red'
          }`}
        >
          {isProfitable ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Net Profit</span>
          <span
            className="agri-pl-summary-card__value"
            style={{ color: isProfitable ? '#059669' : '#dc2626' }}
          >
            {isProfitable ? `+${formatCurrency(netProfit)}` : formatCurrency(netProfit)}
          </span>
          <span className="agri-pl-summary-card__subtext">
            {isProfitable ? 'Profit ↑ Realized' : 'Loss ↓ Incurred'}
          </span>
        </div>
      </div>

      {/* 4. Net Margin */}
      <div className="agri-pl-summary-card">
        <div className="agri-pl-summary-card__icon-box agri-pl-summary-card__icon-box--blue">
          <Percent size={22} />
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Net Margin</span>
          <span
            className="agri-pl-summary-card__value"
            style={{ color: isProfitable ? '#2563eb' : '#dc2626' }}
          >
            {formatPercentage(netMargin)}
          </span>
          <span className="agri-pl-summary-card__subtext">
            Profit margin on sales
          </span>
        </div>
      </div>

      {/* 5. Cost per Quintal */}
      <div className="agri-pl-summary-card">
        <div className="agri-pl-summary-card__icon-box agri-pl-summary-card__icon-box--purple">
          <Scale size={22} />
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Cost per Quintal</span>
          <span className="agri-pl-summary-card__value">
            {formatCurrency(costPerQuintal)}/q
          </span>
          <span className="agri-pl-summary-card__subtext">
            ₹{(costPerQuintal / 100).toFixed(2)}/kg production cost
          </span>
        </div>
      </div>

      {/* 6. Harvest Yield & Mandi Benchmark */}
      <div className="agri-pl-summary-card">
        <div className="agri-pl-summary-card__icon-box agri-pl-summary-card__icon-box--slate">
          <Tag size={22} />
        </div>
        <div className="agri-pl-summary-card__content">
          <span className="agri-pl-summary-card__label">Mandi Benchmark</span>
          <span className="agri-pl-summary-card__value" style={{ fontSize: '1.2rem' }}>
            {formatCurrency(averageMandiRate)}/q
          </span>
          <span className="agri-pl-summary-card__subtext">
            {(harvestYieldKg / 100).toFixed(1)} q total harvest
          </span>
        </div>
      </div>
    </div>
  );
}
