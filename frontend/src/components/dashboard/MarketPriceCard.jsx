import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Store } from 'lucide-react';
import Card from '../common/Card';

/**
 * MarketPriceCard Component
 * Displays demo APMC mandi commodity rates.
 * @param {Object} props
 * @param {Array} props.marketPrices
 */
export default function MarketPriceCard({ marketPrices = [] }) {
  return (
    <Card
      title="Live APMC Market Rates"
      subtitle="Benchmark mandi commodity prices"
      action={
        <Link to="/market-prices" className="agri-card-action-link">
          <span>View Market Prices</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div style={{ marginBottom: '0.75rem' }}>
        <span
          className="agri-badge agri-badge--neutral"
          style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Store size={11} aria-hidden="true" />
          <span>Demo Market Data • Illustrative APMC Rates</span>
        </span>
      </div>

      <div className="agri-market-list">
        {marketPrices.map((item) => (
          <div key={item.id} className="agri-market-item">
            <div className="agri-market-item__left">
              <div className="agri-market-item__badge">
                {item.crop.slice(0, 1)}
              </div>
              <div>
                <h4 className="agri-market-item__crop-name">
                  {item.crop} ({item.variety})
                </h4>
                <p className="agri-market-item__crop-sub">
                  {item.mandi} • Range: ₹{item.minRate} - ₹{item.maxRate}
                </p>
              </div>
            </div>

            <div className="agri-market-item__right">
              <span className="agri-market-item__price">{item.unit}</span>
              <span className="agri-market-item__trend">
                <TrendingUp size={13} aria-hidden="true" />
                <span>{item.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
