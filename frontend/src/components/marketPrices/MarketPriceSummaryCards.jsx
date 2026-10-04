import { Sprout, Building, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function MarketPriceSummaryCards({ marketPrices = [] }) {
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
          <span className="agri-market-summary-card__label">Tracked Crops</span>
          <span className="agri-market-summary-card__value">{trackedCropsCount}</span>
          <span className="agri-market-summary-card__subtext">Major AgriTrack crops</span>
        </div>
      </div>

      {/* 2. Mandis Covered */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--blue">
          <Building size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">Mandis Covered</span>
          <span className="agri-market-summary-card__value">{mandisCount}</span>
          <span className="agri-market-summary-card__subtext">Nashik, Karnal, Vashi...</span>
        </div>
      </div>

      {/* 3. Highest Reference Rate */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--amber">
          <TrendingUp size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">Highest Rate</span>
          <span className="agri-market-summary-card__value">
            {highestRecord ? formatCurrency(highestRecord.pricePerQuintal) : '₹0'}
          </span>
          <span className="agri-market-summary-card__subtext">
            {highestRecord ? `${highestRecord.crop} (${highestRecord.variety})` : 'N/A'}
          </span>
        </div>
      </div>

      {/* 4. Average Market Price */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--purple">
          <DollarSign size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">Average Price</span>
          <span className="agri-market-summary-card__value">
            {formatCurrency(avgPriceQ)}/q
          </span>
          <span className="agri-market-summary-card__subtext">
            ₹{(avgPriceQ / 100).toFixed(2)}/kg mean
          </span>
        </div>
      </div>

      {/* 5. Update Status */}
      <div className="agri-market-summary-card">
        <div className="agri-market-summary-card__icon-box agri-market-summary-card__icon-box--slate">
          <CalendarCheck size={22} />
        </div>
        <div className="agri-market-summary-card__content">
          <span className="agri-market-summary-card__label">Dataset Status</span>
          <span className="agri-market-summary-card__value" style={{ fontSize: '1.05rem' }}>
            Demo Data
          </span>
          <span className="agri-market-summary-card__subtext">
            Last updated 02 Oct 2026
          </span>
        </div>
      </div>
    </div>
  );
}
