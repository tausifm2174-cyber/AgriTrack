import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wallet, Plus, CreditCard, PieChart } from 'lucide-react';
import { Button } from '../common';

export default function RevenueHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="agri-revenue-header">
      <div className="agri-revenue-header__left">
        <div className="agri-revenue-header__badge">
          <Wallet size={14} />
          <span>{t('revenue.incomeAccounting', 'Finance & Income Accounting • Commercial Realization')}</span>
        </div>
        <h1 className="agri-revenue-header__title">{t('revenue.title', 'Revenue Management')}</h1>
        <p className="agri-revenue-header__desc">
          {t('revenue.subtitle', 'Monitor crop commercial realizations, invoiced sales receipts, buyer receivables, and historical revenue trajectories across all holdings.')}
        </p>
      </div>
      <div className="agri-revenue-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/expenses')}
          aria-label={t('navigation.expenses', 'View Expenses')}
        >
          <CreditCard size={16} />
          <span>{t('navigation.expenses', 'View Expenses')}</span>
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
          onClick={() => navigate('/sales')}
          aria-label={t('sales.addSale', 'Record Sale in Sales Ledger')}
        >
          <Plus size={18} />
          <span>{t('sales.addSale', 'Record Sale')}</span>
        </Button>
      </div>
    </div>
  );
}
