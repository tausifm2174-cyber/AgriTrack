import { Receipt, Scale, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function SalesSummaryCards({ sales = [] }) {
  const totalSales = sales.length;

  const totalQuantityKg = sales.reduce(
    (acc, curr) => acc + (curr.quantityKg || 0),
    0
  );

  const totalRevenue = sales.reduce(
    (acc, curr) => acc + (curr.totalAmount || 0),
    0
  );

  const pendingPayments = sales.reduce(
    (acc, curr) => acc + (curr.balanceDue || 0),
    0
  );

  // Average price per quintal (total revenue / (total kg / 100))
  const avgPricePerQuintal =
    totalQuantityKg > 0 ? Math.round(totalRevenue / (totalQuantityKg / 100)) : 0;

  return (
    <div className="agri-sales-summary-grid">
      {/* 1. Total Sales */}
      <div className="agri-sales-summary-card">
        <div className="agri-sales-summary-card__icon-box agri-sales-summary-card__icon-box--blue">
          <Receipt size={22} />
        </div>
        <div className="agri-sales-summary-card__content">
          <span className="agri-sales-summary-card__label">Total Invoices</span>
          <span className="agri-sales-summary-card__value">{totalSales}</span>
          <span className="agri-sales-summary-card__subtext">Active trade records</span>
        </div>
      </div>

      {/* 2. Quantity Sold */}
      <div className="agri-sales-summary-card">
        <div className="agri-sales-summary-card__icon-box agri-sales-summary-card__icon-box--green">
          <Scale size={22} />
        </div>
        <div className="agri-sales-summary-card__content">
          <span className="agri-sales-summary-card__label">Quantity Sold</span>
          <span className="agri-sales-summary-card__value">
            {formatWeight(totalQuantityKg, 'kg')}
          </span>
          <span className="agri-sales-summary-card__subtext">
            {(totalQuantityKg / 100).toFixed(1)} quintals traded
          </span>
        </div>
      </div>

      {/* 3. Total Revenue */}
      <div className="agri-sales-summary-card">
        <div className="agri-sales-summary-card__icon-box agri-sales-summary-card__icon-box--emerald">
          <Wallet size={22} />
        </div>
        <div className="agri-sales-summary-card__content">
          <span className="agri-sales-summary-card__label">Total Revenue</span>
          <span className="agri-sales-summary-card__value">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="agri-sales-summary-card__subtext">
            Gross invoiced value
          </span>
        </div>
      </div>

      {/* 4. Average Sale Price */}
      <div className="agri-sales-summary-card">
        <div className="agri-sales-summary-card__icon-box agri-sales-summary-card__icon-box--purple">
          <TrendingUp size={22} />
        </div>
        <div className="agri-sales-summary-card__content">
          <span className="agri-sales-summary-card__label">Avg Realized Price</span>
          <span className="agri-sales-summary-card__value">
            {formatCurrency(avgPricePerQuintal)}/q
          </span>
          <span className="agri-sales-summary-card__subtext">
            ₹{(avgPricePerQuintal / 100).toFixed(2)}/kg blended
          </span>
        </div>
      </div>

      {/* 5. Pending Payments */}
      <div className="agri-sales-summary-card">
        <div className="agri-sales-summary-card__icon-box agri-sales-summary-card__icon-box--amber">
          <AlertCircle size={22} />
        </div>
        <div className="agri-sales-summary-card__content">
          <span className="agri-sales-summary-card__label">Pending Balance</span>
          <span
            className="agri-sales-summary-card__value"
            style={{ color: pendingPayments > 0 ? '#b45309' : 'var(--slate-900)' }}
          >
            {formatCurrency(pendingPayments)}
          </span>
          <span className="agri-sales-summary-card__subtext">
            {pendingPayments > 0 ? 'Awaiting buyer settlement' : 'All accounts settled'}
          </span>
        </div>
      </div>
    </div>
  );
}
