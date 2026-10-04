import { useNavigate } from 'react-router-dom';
import { Receipt, Plus, PackageCheck, TrendingUp } from 'lucide-react';
import { Button } from '../common';

export default function SalesHeader({ onRecordSale }) {
  const navigate = useNavigate();

  return (
    <div className="agri-sales-header">
      <div className="agri-sales-header__left">
        <div className="agri-sales-header__badge">
          <Receipt size={14} />
          <span>Harvest & Trade • Produce Sales & Realization</span>
        </div>
        <h1 className="agri-sales-header__title">Sales Management</h1>
        <p className="agri-sales-header__desc">
          Record produce transactions, track buyer receivables, compare against mandi benchmarks, and monitor revenue realization.
        </p>
      </div>
      <div className="agri-sales-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/harvests')}
          aria-label="View Harvests"
        >
          <PackageCheck size={16} />
          <span>View Harvests</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/market-prices')}
          aria-label="View Market Prices"
        >
          <TrendingUp size={16} />
          <span>Market Prices</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onRecordSale}
          aria-label="Record New Sale"
        >
          <Plus size={18} />
          <span>Record Sale</span>
        </Button>
      </div>
    </div>
  );
}
