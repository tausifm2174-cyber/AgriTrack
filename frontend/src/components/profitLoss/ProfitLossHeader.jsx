import { useNavigate } from 'react-router-dom';
import { PieChart, CreditCard, Wallet, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../common';
import { FINANCIAL_DATA_DISCLAIMER } from '../../data/profitLossData';

export default function ProfitLossHeader() {
  const navigate = useNavigate();

  return (
    <div className="agri-pl-header">
      <div className="agri-pl-header__left">
        <div className="agri-pl-header__badge">
          <PieChart size={14} />
          <span>Financial Performance • Profit & Loss Analysis</span>
        </div>
        <h1 className="agri-pl-header__title">Profit & Loss Analysis</h1>
        <p className="agri-pl-header__desc">
          Evaluate net operational margins, production cost per quintal, and revenue realization across farms and standing crops.
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
          aria-label="View Expenses"
        >
          <CreditCard size={16} />
          <span>Expenses</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/revenue')}
          aria-label="View Revenue"
        >
          <Wallet size={16} />
          <span>Revenue</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/sales')}
          aria-label="Record Sale in Sales Ledger"
        >
          <Plus size={18} />
          <span>Record Sale</span>
        </Button>
      </div>
    </div>
  );
}
