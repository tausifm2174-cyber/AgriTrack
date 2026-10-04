import { useNavigate } from 'react-router-dom';
import { TrendingUp, Receipt, Sprout, AlertTriangle } from 'lucide-react';
import { Button } from '../common';
import { MARKET_DATA_DISCLAIMER } from '../../data/marketPriceData';

export default function MarketPriceHeader() {
  const navigate = useNavigate();

  return (
    <div className="agri-market-header">
      <div className="agri-market-header__left">
        <div className="agri-market-header__badge">
          <TrendingUp size={14} />
          <span>APMC Terminal Mandi Benchmarks • Sample Data</span>
        </div>
        <h1 className="agri-market-header__title">APMC Market Prices</h1>
        <p className="agri-market-header__desc">
          Daily agricultural commodity rates across major terminal mandis to support harvest valuation, sales negotiation, and farmer profitability.
        </p>

        {/* Prominent Demo Data Disclaimer */}
        <div className="agri-market-disclaimer-banner" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Demonstration Dataset:</strong> {MARKET_DATA_DISCLAIMER}
          </div>
        </div>
      </div>

      <div className="agri-market-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sales')}
          aria-label="View Sales"
        >
          <Receipt size={16} />
          <span>View Sales</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/crops')}
          aria-label="View Crops"
        >
          <Sprout size={16} />
          <span>View Crops</span>
        </Button>
      </div>
    </div>
  );
}
