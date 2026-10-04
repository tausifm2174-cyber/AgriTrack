import { Wallet, Scale, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function RevenueSummaryCards({ sales = [] }) {
  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const totalQuantityKg = sales.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);

  const pendingRevenue = sales.reduce((acc, curr) => acc + (curr.balanceDue || 0), 0);

  const collectedRevenue = sales.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);

  const completedCount = sales.filter((s) => s.status === 'COMPLETED').length;

  const avgPricePerQuintal =
    totalQuantityKg > 0 ? Math.round(totalRevenue / (totalQuantityKg / 100)) : 0;

  return (
    <div className="agri-revenue-summary-grid">
      {/* 1. Total Revenue */}
      <div className="agri-revenue-summary-card">
        <div className="agri-revenue-summary-card__icon-box agri-revenue-summary-card__icon-box--green">
          <Wallet size={22} />
        </div>
        <div className="agri-revenue-summary-card__content">
          <span className="agri-revenue-summary-card__label">Total Revenue</span>
          <span className="agri-revenue-summary-card__value">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="agri-revenue-summary-card__subtext">
            {formatCurrency(collectedRevenue)} collected
          </span>
        </div>
      </div>

      {/* 2. Total Volume Sold */}
      <div className="agri-revenue-summary-card">
        <div className="agri-revenue-summary-card__icon-box agri-revenue-summary-card__icon-box--blue">
          <Scale size={22} />
        </div>
        <div className="agri-revenue-summary-card__content">
          <span className="agri-revenue-summary-card__label">Volume Realized</span>
          <span className="agri-revenue-summary-card__value">
            {formatWeight(totalQuantityKg, 'kg')}
          </span>
          <span className="agri-revenue-summary-card__subtext">
            {(totalQuantityKg / 100).toFixed(1)} quintals offloaded
          </span>
        </div>
      </div>

      {/* 3. Average Price */}
      <div className="agri-revenue-summary-card">
        <div className="agri-revenue-summary-card__icon-box agri-revenue-summary-card__icon-box--purple">
          <TrendingUp size={22} />
        </div>
        <div className="agri-revenue-summary-card__content">
          <span className="agri-revenue-summary-card__label">Avg Realized Price</span>
          <span className="agri-revenue-summary-card__value">
            {formatCurrency(avgPricePerQuintal)}/q
          </span>
          <span className="agri-revenue-summary-card__subtext">
            ₹{(avgPricePerQuintal / 100).toFixed(2)}/kg blended
          </span>
        </div>
      </div>

      {/* 4. Completed Invoices */}
      <div className="agri-revenue-summary-card">
        <div className="agri-revenue-summary-card__icon-box agri-revenue-summary-card__icon-box--green">
          <CheckCircle2 size={22} />
        </div>
        <div className="agri-revenue-summary-card__content">
          <span className="agri-revenue-summary-card__label">Completed Sales</span>
          <span className="agri-revenue-summary-card__value">
            {completedCount} of {sales.length}
          </span>
          <span className="agri-revenue-summary-card__subtext">
            Active trade invoices
          </span>
        </div>
      </div>

      {/* 5. Pending Receivables */}
      <div className="agri-revenue-summary-card">
        <div className="agri-revenue-summary-card__icon-box agri-revenue-summary-card__icon-box--amber">
          <Clock size={22} />
        </div>
        <div className="agri-revenue-summary-card__content">
          <span className="agri-revenue-summary-card__label">Pending Balance</span>
          <span
            className="agri-revenue-summary-card__value"
            style={{ color: pendingRevenue > 0 ? '#b45309' : 'var(--slate-800)' }}
          >
            {formatCurrency(pendingRevenue)}
          </span>
          <span className="agri-revenue-summary-card__subtext">
            {pendingRevenue > 0 ? 'Buyer balance due' : 'All sales settled'}
          </span>
        </div>
      </div>
    </div>
  );
}
