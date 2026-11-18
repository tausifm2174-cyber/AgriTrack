import { useTranslation } from 'react-i18next';
import { Sprout, Building, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function MarketPriceSummaryCards({ marketPrices = [] }) {
  const { t } = useTranslation();
  const trackedCropsCount = new Set(marketPrices.map((m) => m.crop)).size;
  const mandisCount = new Set(marketPrices.map((m) => m.market)).size;

  let highestRecord = null;
  let totalPriceQ = 0;

  marketPrices.forEach((m) => {
    totalPriceQ += m.pricePerQuintal || 0;
    if (!highestRecord || m.pricePerQuintal > highestRecord.pricePerQuintal) {
      highestRecord = m;
    }
  });

  const avgPriceQ =
    marketPrices.length > 0 ? Math.round(totalPriceQ / marketPrices.length) : 0;

  return (
    <div className="agri-market-summary-grid">
      {/* 1. Tracked Commodities */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--green">
          <Sprout size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">{t('marketPrices.trackedCrops', 'Tracked Crops')}</span>
          <span className="agri-market-summary-card__value">{trackedCropsCount}</span>
          <span className="agri-market-summary-card__subtext">{t('marketPrices.majorCrops', 'Major AgriTrack crops')}</span>
        </div>
      </div>

      {/* 2. Mandis Covered */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--blue">
          <Building size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">{t('marketPrices.mandisCovered', 'Mandis Covered')}</span>
          <span className="agri-market-summary-card__value">{mandisCount}</span>
          <span className="agri-market-summary-card__subtext">
            {mandisCount > 0 ? t('marketPrices.liveReportingMandis', 'Live reporting mandis') : t('common.na', 'N/A')}
          </span>
        </div>
      </div>

      {/* 3. Highest Reference Rate */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--amber">
          <TrendingUp size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">{t('marketPrices.highestRate', 'Highest Rate')}</span>
          <span className="agri-market-summary-card__value">
            {highestRecord ? formatCurrency(highestRecord.pricePerQuintal) : '₹0'}
          </span>
          <span className="agri-market-summary-card__subtext">
            {highestRecord ? `${highestRecord.crop} (${highestRecord.variety})` : t('common.na', 'N/A')}
          </span>
        </div>
      </div>

      {/* 4. Average Market Price */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--purple">
          <DollarSign size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">{t('marketPrices.averagePrice', 'Average Price')}</span>
          <span className="agri-market-summary-card__value">
            {formatCurrency(avgPriceQ)}/q
          </span>
          <span className="agri-market-summary-card__subtext">
            ₹{(avgPriceQ / 100).toFixed(2)}/kg {t('marketPrices.mean', 'mean')}
          </span>
        </div>
      </div>

      {/* 5. Update Status */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--slate">
          <CalendarCheck size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">{t('marketPrices.datasetStatus', 'Dataset Status')}</span>
          <span className="agri-market-summary-card__value" style={{ fontSize: '1.05rem' }}>
            {marketPrices.length > 0 ? t('marketPrices.liveAgmarknet', 'Live Mandi Feed') : t('common.noData', 'No Data')}
          </span>
          <span className="agri-market-summary-card__subtext">
            {marketPrices[0]?.date ? `${t('common.date', 'Date')}: ${marketPrices[0].date}` : t('marketPrices.liveFeedActive', 'Live feed active')}
          </span>
        </div>
      </div>
    </div>
  );
}
