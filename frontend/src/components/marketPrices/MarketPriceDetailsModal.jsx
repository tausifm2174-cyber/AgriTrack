import { X, PlusCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../common';
import MarketTrendChart from './MarketTrendChart';
import { MARKET_DATA_DISCLAIMER } from '../../data/marketPriceData';
import { formatCurrency } from '../../utils/formatters';

export default function MarketPriceDetailsModal({ marketPrice, onClose, onCreateSale }) {
  if (!marketPrice) return null;

  const isRising = marketPrice.trend === 'RISING';
  const isFalling = marketPrice.trend === 'FALLING';
  const trendClass = isRising
    ? 'agri-trend-pill--rising'
    : isFalling
    ? 'agri-trend-pill--falling'
    : 'agri-trend-pill--stable';

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="market-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
                {marketPrice.id}
              </span>
              <span className={`agri-trend-pill ${trendClass}`}>
                <span>{marketPrice.trend} Trend</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Grade {marketPrice.qualityGrade}
              </span>
            </div>
            <h3 id="market-modal-title" className="agri-modal-title">
              {marketPrice.crop} ({marketPrice.variety})
            </h3>
            <p className="agri-modal-subtitle">
              {marketPrice.market} • {marketPrice.location} • Bulletin: {marketPrice.date}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Key Rates Grid */}
          <div className="agri-market-detail-metrics">
            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">Benchmark Rate</span>
              <span className="agri-market-detail-metric-card__value" style={{ color: 'var(--primary-700)' }}>
                {formatCurrency(marketPrice.pricePerQuintal)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Per quintal (100 kg)
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">Rate Per Kg</span>
              <span className="agri-market-detail-metric-card__value">
                ₹{Number(marketPrice.pricePerKg).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Direct farm gate unit rate
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">24h Movement</span>
              <span
                className="agri-market-detail-metric-card__value"
                style={{ color: isRising ? '#059669' : isFalling ? '#dc2626' : 'var(--slate-700)' }}
              >
                {isRising ? '+' : ''}₹{marketPrice.change}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {isRising ? '+' : ''}{marketPrice.changePercent}% from ₹{marketPrice.previousPrice}
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">Terminal Arrivals</span>
              <span className="agri-market-detail-metric-card__value">
                {marketPrice.arrivalVolumeQ} q
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Range: ₹{marketPrice.minPrice} – ₹{marketPrice.maxPrice}
              </span>
            </div>
          </div>

          {/* Historical Trend Chart */}
          <MarketTrendChart
            history={marketPrice.history}
            crop={marketPrice.crop}
            market={marketPrice.market}
          />

          {/* Market & Source Info */}
          <div className="agri-form-grid agri-form-grid--2">
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Mandi & Location Specs
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Market Yard: <strong>{marketPrice.market}</strong></div>
                <div>Jurisdiction: <strong>{marketPrice.location}</strong></div>
                <div>Trading Session: <strong>Spot Wholesale Auction</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Quality & Reporting Source
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Standard: <strong>Grade {marketPrice.qualityGrade} (Moisture &lt; 12%)</strong></div>
                <div>Source Bulletin: <strong>{marketPrice.source}</strong></div>
                <div>Effective Date: <strong>{marketPrice.date}</strong></div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="agri-market-disclaimer-banner">
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Demonstration Disclaimer:</strong> {MARKET_DATA_DISCLAIMER}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="agri-modal-footer">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onCreateSale(marketPrice);
            }}
            aria-label="Create Sale with this reference price"
          >
            <PlusCircle size={16} />
            <span>Create Sale Using This Reference</span>
          </Button>
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
