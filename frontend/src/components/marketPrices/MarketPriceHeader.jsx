import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Receipt, Sprout, AlertTriangle } from 'lucide-react';
import { Button } from '../common';

export default function MarketPriceHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="agri-market-header">
      <div className="agri-market-header__left">
        <div className="agri-market-header__badge">
          <TrendingUp size={14} />
          <span>{t('marketPrices.benchmarkBadge', 'APMC Terminal Mandi Benchmarks • Live Data')}</span>
        </div>
        <h1 className="agri-market-header__title">{t('marketPrices.title', 'APMC Market Prices')}</h1>
        <p className="agri-market-header__desc">
          {t('marketPrices.subtitle', 'Live agricultural commodity rates across major terminal mandis to support harvest valuation, sales negotiation, and farmer profitability.')}
        </p>

        {/* Live Data Agmarknet Banner */}
        <div className="agri-market-disclaimer-banner" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>{t('marketPrices.officialSource', 'Official Agmarknet Source:')}</strong>{' '}
            {t('marketPrices.officialDisclaimer', 'APMC commodity benchmark prices are officially reported by the Ministry of Agriculture. Modal rates fluctuate daily based on wholesale spot arrivals, commodity variety, and physical quality grade.')}
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
