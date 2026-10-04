import { useNavigate } from 'react-router-dom';
import { Wallet, Plus, CreditCard, PieChart } from 'lucide-react';
import { Button } from '../common';

export default function RevenueHeader() {
  const navigate = useNavigate();

  return (
    <div className="agri-revenue-header">
      <div className="agri-revenue-header__left">
        <div className="agri-revenue-header__badge">
          <Wallet size={14} />
          <span>Finance & Income Accounting • Commercial Realization</span>
        </div>
        <h1 className="agri-revenue-header__title">Revenue Management</h1>
        <p className="agri-revenue-header__desc">
          Monitor crop commercial realizations, invoiced sales receipts, buyer receivables, and historical revenue trajectories across all holdings.
        </p>
      </div>
      <div className="agri-revenue-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/expenses')}
          aria-label="View Expenses"
        >
          <CreditCard size={16} />
          <span>View Expenses</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/profit-loss')}
          aria-label="View Profit & Loss"
        >
          <PieChart size={16} />
          <span>Profit & Loss</span>
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
