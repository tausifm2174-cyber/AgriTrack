import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Receipt, Sprout, AlertTriangle } from 'lucide-react';
import { Button } from '../common';

const MARKET_DATA_DISCLAIMER =
  'APMC mandi commodity rates are benchmark modal prices reported from major agricultural wholesale markets (mandis). Prices fluctuate daily based on arrivals, variety, and grade quality.';

export default function MarketPriceHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="agri-market-header">
      <div className="agri-market-header__left">
        <div className="agri-market-header__badge">
          <TrendingUp size={14} />
          <span>{t('marketPrices.benchmarkBadge', 'APMC Terminal Mandi Benchmarks • Sample Data')}</span>
        </div>
        <h1 className="agri-market-header__title">{t('marketPrices.title', 'APMC Market Prices')}</h1>
        <p className="agri-market-header__desc">
          {t('marketPrices.subtitle', 'Daily agricultural commodity rates across major terminal mandis to support harvest valuation, sales negotiation, and farmer profitability.')}
        </p>

        {/* Prominent Demo Data Disclaimer */}
        <div className="agri-market-disclaimer-banner" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>{t('marketPrices.demoDataset', 'Demonstration Dataset:')}</strong> {MARKET_DATA_DISCLAIMER}
          </div>
        </div>
      </div>

      <div className="agri-market-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sales')}
          aria-label={t('navigation.sales', 'View Sales')}
        >
          <Receipt size={16} />
          <span>{t('navigation.sales', 'View Sales')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/crops')}
          aria-label={t('navigation.crops', 'View Crops')}
        >
          <Sprout size={16} />
          <span>{t('navigation.crops', 'View Crops')}</span>
        </Button>
      </div>
    </div>
  );
}
