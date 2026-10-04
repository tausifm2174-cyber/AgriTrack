import { Eye, PlusCircle, ArrowUpRight, ArrowDownRight, Minus, MapPin, Calendar } from 'lucide-react';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';

export default function MarketPriceCard({ marketPrice, onViewDetails, onCreateSale }) {
  const isRising = marketPrice.trend === 'RISING';
  const isFalling = marketPrice.trend === 'FALLING';
  const trendClass = isRising
    ? 'agri-trend-pill--rising'
    : isFalling
    ? 'agri-trend-pill--falling'
    : 'agri-trend-pill--stable';

  return (
    <div className="agri-market-card">
      <div className="agri-market-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
              {marketPrice.id}
            </span>
            <span className={`agri-trend-pill ${trendClass}`}>
              {isRising ? (
                <ArrowUpRight size={13} />
              ) : isFalling ? (
                <ArrowDownRight size={13} />
              ) : (
                <Minus size={13} />
              )}
              <span>{marketPrice.trend}</span>
            </span>
          </div>
          <h3 className="agri-market-card__title">
            {marketPrice.crop} ({marketPrice.variety})
          </h3>
          <div className="agri-market-card__subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} />
            <span>
              {marketPrice.market} • {marketPrice.location}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="agri-market-card__price-quintal">
            {formatCurrency(marketPrice.pricePerQuintal)}
          </div>
          <div className="agri-market-card__price-kg">
            ₹{Number(marketPrice.pricePerKg).toFixed(2)}/kg
          </div>
        </div>
      </div>

      <div className="agri-market-card__body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            <span>Bulletin Date: {marketPrice.date}</span>
          </div>
          <div style={{ fontWeight: 700, color: isRising ? '#059669' : isFalling ? '#dc2626' : 'var(--slate-600)' }}>
            {isRising ? '+' : ''}₹{marketPrice.change} ({isRising ? '+' : ''}{marketPrice.changePercent}%)
          </div>
        </div>

        <div className="agri-market-card__stats-grid">
          <div className="agri-market-card__stat-item">
            <span className="agri-market-card__stat-label">Previous Rate</span>
            <span className="agri-market-card__stat-value">
              {formatCurrency(marketPrice.previousPrice)}/q
            </span>
          </div>
          <div className="agri-market-card__stat-item">
            <span className="agri-market-card__stat-label">Day Range</span>
            <span className="agri-market-card__stat-value">
              ₹{marketPrice.minPrice} – ₹{marketPrice.maxPrice}
            </span>
          </div>
          <div className="agri-market-card__stat-item">
            <span className="agri-market-card__stat-label">Arrival Volume</span>
            <span className="agri-market-card__stat-value">
              {marketPrice.arrivalVolumeQ ? `${marketPrice.arrivalVolumeQ} q` : 'N/A'}
            </span>
          </div>
          <div className="agri-market-card__stat-item">
            <span className="agri-market-card__stat-label">Quality Grade</span>
            <span className="agri-market-card__stat-value">
              Grade {marketPrice.qualityGrade} Standard
            </span>
          </div>
        </div>
      </div>

      <div className="agri-market-card__footer">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(marketPrice)}
          aria-label={`View trend for ${marketPrice.crop}`}
        >
          <Eye size={14} />
          <span>Trend Chart</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onCreateSale(marketPrice)}
          aria-label={`Create sale from ${marketPrice.crop}`}
        >
          <PlusCircle size={14} />
          <span>Create Sale</span>
        </Button>
      </div>
    </div>
  );
}
