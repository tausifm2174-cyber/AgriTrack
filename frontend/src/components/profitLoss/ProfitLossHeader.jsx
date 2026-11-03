import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PieChart, CreditCard, Wallet, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../common';
import { FINANCIAL_DATA_DISCLAIMER } from '../../data/profitLossData';

export default function ProfitLossHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="agri-pl-header">
      <div className="agri-pl-header__left">
        <div className="agri-pl-header__badge">
          <PieChart size={14} />
          <span>{t('profitLoss.badge', 'Financial Performance • Profit & Loss Analysis')}</span>
        </div>
        <h1 className="agri-pl-header__title">{t('profitLoss.title', 'Profit & Loss Analysis')}</h1>
        <p className="agri-pl-header__desc">
          {t('profitLoss.subtitle', 'Evaluate net operational margins, production cost per quintal, and revenue realization across farms and standing crops.')}
        </p>

        {/* Demo Data Disclaimer */}
        <div className="agri-pl-disclaimer-banner" style={{ marginTop: '0.75rem' }}>
          <AlertCircle size={16} style={{ color: '#64748b', flexShrink: 0 }} />
          <span>{FINANCIAL_DATA_DISCLAIMER}</span>
        </div>
      </div>

      <div className="agri-pl-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/expenses')}
          aria-label={t('navigation.expenses', 'Expenses')}
        >
          <CreditCard size={16} />
          <span>{t('navigation.expenses', 'Expenses')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/revenue')}
          aria-label={t('navigation.revenue', 'Revenue')}
        >
          <Wallet size={16} />
          <span>{t('navigation.revenue', 'Revenue')}</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/sales')}
          aria-label={t('sales.addSale', 'Record Sale')}
        >
          <Plus size={18} />
          <span>{t('sales.addSale', 'Record Sale')}</span>
        </Button>
      </div>
    </div>
  );
}

