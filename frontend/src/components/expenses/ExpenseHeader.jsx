import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus, Wallet, PieChart } from 'lucide-react';
import { Button } from '../common';

export default function ExpenseHeader({ onRecordExpense }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="agri-expense-header">
      <div className="agri-expense-header__left">
        <div className="agri-expense-header__badge">
          <CreditCard size={14} />
          <span>{t('expenses.costAccounting', 'Finance & Cost Accounting • Farm Outflows')}</span>
        </div>
        <h1 className="agri-expense-header__title">{t('expenses.title', 'Expense Management')}</h1>
        <p className="agri-expense-header__desc">
          {t('expenses.subtitle', 'Track operational input costs across seeds, fertilizer, fuel, labor, machinery, and utilities to evaluate field-level production cost.')}
        </p>
      </div>
      <div className="agri-expense-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/revenue')}
          aria-label={t('navigation.revenue', 'View Revenue')}
        >
          <Wallet size={16} />
          <span>{t('navigation.revenue', 'View Revenue')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/profit-loss')}
          aria-label={t('navigation.profitLoss', 'View Profit & Loss')}
        >
          <PieChart size={16} />
          <span>{t('navigation.profitLoss', 'Profit & Loss')}</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onRecordExpense}
          aria-label={t('expenses.addExpense', 'Record New Expense')}
        >
          <Plus size={18} />
          <span>{t('expenses.addExpense', 'Record Expense')}</span>
        </Button>
      </div>
    </div>
  );
}
