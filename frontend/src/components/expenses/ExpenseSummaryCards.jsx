import { CreditCard, CheckCircle2, Clock, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseSummaryCards({ expenses = [] }) {
  const totalAmount = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const paidAmount = expenses
    .filter((e) => e.status === 'PAID')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingAmount = expenses
    .filter((e) => e.status === 'PENDING')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const thisMonthExpenses = expenses
    .filter((e) => e.date && e.date.startsWith('2026-10'))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const avgExpense = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;

  return (
    <div className="agri-expense-summary-grid">
      {/* 1. Total Expenses */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--red">
          <CreditCard size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">Total Expenses</span>
          <span className="agri-expense-summary-card__value">
            {formatCurrency(totalAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {expenses.length} input vouchers logged
          </span>
        </div>
      </div>

      {/* 2. Paid Outflows */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--emerald">
          <CheckCircle2 size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">Paid Outflows</span>
          <span className="agri-expense-summary-card__value" style={{ color: '#059669' }}>
            {formatCurrency(paidAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {totalAmount > 0 ? `${Math.round((paidAmount / totalAmount) * 100)}% settled` : '100% settled'}
          </span>
        </div>
      </div>

      {/* 3. Pending Payables */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--amber">
          <Clock size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">Pending Payables</span>
          <span
            className="agri-expense-summary-card__value"
            style={{ color: pendingAmount > 0 ? '#b45309' : 'var(--slate-800)' }}
          >
            {formatCurrency(pendingAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {pendingAmount > 0 ? 'Vendor credit pending' : 'Zero outstanding debt'}
          </span>
        </div>
      </div>

      {/* 4. This Month */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--blue">
          <Calendar size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">This Month</span>
          <span className="agri-expense-summary-card__value">
            {formatCurrency(thisMonthExpenses)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            October 2026 cycle
          </span>
        </div>
      </div>

      {/* 5. Average Expense */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--purple">
          <BarChart3 size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">Avg Expense</span>
          <span className="agri-expense-summary-card__value">
            {formatCurrency(avgExpense)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            Per voucher entry
          </span>
        </div>
      </div>
    </div>
  );
}
