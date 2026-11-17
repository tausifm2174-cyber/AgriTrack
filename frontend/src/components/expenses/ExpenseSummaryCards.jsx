import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle2, Clock, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseSummaryCards({ expenses = [], summary = null }) {
  const { t } = useTranslation();
  const totalAmount = summary?.totalExpenses != null
    ? Number(summary.totalExpenses)
    : expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const paidAmount = summary?.paidExpenses != null
    ? Number(summary.paidExpenses)
    : expenses
        .filter((e) => e.status === 'PAID' || e.paymentStatus === 'PAID')
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingAmount = summary?.pendingExpenses != null
    ? Number(summary.pendingExpenses)
    : expenses
        .filter((e) => e.status === 'PENDING' || e.paymentStatus === 'PENDING')
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = expenses
    .filter((e) => {
      const d = e.expenseDate || e.date || '';
      return d.startsWith(currentMonthPrefix) || d.startsWith('2026-10');
    })
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalCount = summary?.expenseCount != null ? Number(summary.expenseCount) : expenses.length;
  const avgExpense = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

  return (
    <div className="agri-expense-summary-grid">
      {/* 1. Total Expenses */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--red">
          <CreditCard size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">{t('expenses.totalExpenses', 'Total Expenses')}</span>
          <span className="agri-expense-summary-card__value">
            {formatCurrency(totalAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {totalCount} {t('expenses.vouchersLogged', 'input vouchers logged')}
          </span>
        </div>
      </div>

      {/* 2. Paid Outflows */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--emerald">
          <CheckCircle2 size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">{t('expenses.paidOutflows', 'Paid Outflows')}</span>
          <span className="agri-expense-summary-card__value" style={{ color: '#059669' }}>
            {formatCurrency(paidAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {totalAmount > 0 ? `${Math.round((paidAmount / totalAmount) * 100)}% ${t('expenses.settled', 'settled')}` : `100% ${t('expenses.settled', 'settled')}`}
          </span>
        </div>
      </div>

      {/* 3. Pending Payables */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--amber">
          <Clock size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">{t('expenses.pendingPayables', 'Pending Payables')}</span>
          <span
            className="agri-expense-summary-card__value"
            style={{ color: pendingAmount > 0 ? '#b45309' : 'var(--slate-800)' }}
          >
            {formatCurrency(pendingAmount)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {pendingAmount > 0 ? t('expenses.vendorCreditPending', 'Vendor credit pending') : t('expenses.zeroDebt', 'Zero outstanding debt')}
          </span>
        </div>
      </div>

      {/* 4. This Month */}
      <div className="agri-expense-summary-card">
        <div className="agri-expense-summary-card__icon-box agri-expense-summary-card__icon-box--blue">
          <Calendar size={22} />
        </div>
        <div className="agri-expense-summary-card__content">
          <span className="agri-expense-summary-card__label">{t('expenses.thisMonth', 'This Month')}</span>
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
          <span className="agri-expense-summary-card__label">{t('expenses.avgExpense', 'Avg Expense')}</span>
          <span className="agri-expense-summary-card__value">
            {formatCurrency(avgExpense)}
          </span>
          <span className="agri-expense-summary-card__subtext">
            {t('expenses.perVoucher', 'Per voucher entry')}
          </span>
        </div>
      </div>
    </div>
  );
}
