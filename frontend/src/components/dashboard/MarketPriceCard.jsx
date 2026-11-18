import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowRight, Store } from 'lucide-react';
import Card from '../common/Card';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

/**
 * MarketPriceCard Component
 * Displays demo APMC mandi commodity rates.
 * @param {Object} props
 * @param {Array} props.marketPrices
 */
export default function MarketPriceCard({ marketPrices = [] }) {
  const { t } = useTranslation();

  return (
    <Card
      title={t('marketPrices.title', 'Live APMC Market Rates')}
      subtitle={t('marketPrices.subtitle', 'Benchmark mandi commodity prices')}
      action={
        <Link to="/market-prices" className="agri-card-action-link">
          <span>{t('navigation.marketPrices', 'Market Prices')}</span>
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
          <span>{t('marketPrices.benchmarkNotice', 'APMC Mandi Rates • Official Benchmarks')}</span>
        </span>
      </div>

      <div className="agri-market-list">
        {marketPrices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <TrendingUp size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('marketPrices.noPrices', 'No APMC market rates currently available.')}</p>
          </div>
        ) : (
          marketPrices.map((item) => (
          <div key={item.id} className="agri-market-item">
            <div className="agri-market-item__left">
              <div className="agri-market-item__badge">
                {(item.crop || 'C').slice(0, 1)}
              </div>
              <div>
                <h4 className="agri-market-item__crop-name">
                  {translateCrop(item.crop, t)} {item.variety ? `(${translateVariety(item.variety, t)})` : ''}
                </h4>
                <p className="agri-market-item__crop-sub">
                  {item.mandi} • {t('dashboard.range', 'Range')}: ₹{item.minRate} - ₹{item.maxRate}
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
        ))
        )}
      </div>
    </Card>
  );
}
