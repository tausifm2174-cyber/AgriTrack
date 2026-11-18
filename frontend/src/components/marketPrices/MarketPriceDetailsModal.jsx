import { useTranslation } from 'react-i18next';
import { X, PlusCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../common';
import MarketTrendChart from './MarketTrendChart';
import { formatCurrency } from '../../utils/formatters';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function MarketPriceDetailsModal({ marketPrice, onClose, onCreateSale }) {
  const { t } = useTranslation();
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
                <span>
                  {isRising
                    ? t('marketPrices.rising', 'Rising')
                    : isFalling
                      ? t('marketPrices.falling', 'Falling')
                      : t('marketPrices.stable', 'Stable')}{' '}
                  {t('marketPrices.priceTrend', 'Trend')}
                </span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {t('harvests.quality', 'Grade')} {marketPrice.qualityGrade}
              </span>
            </div>
            <h3 id="market-modal-title" className="agri-modal-title">
              {translateCrop(marketPrice.crop, t)} ({translateVariety(marketPrice.variety, t)})
            </h3>
            <p className="agri-modal-subtitle">
              {marketPrice.market} • {marketPrice.location} • {t('marketPrices.bulletinDate', 'Bulletin')}: {marketPrice.date}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close modal')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="agri-modal-body">
          {/* Key Rates Grid */}
          <div className="agri-market-detail-metrics">
            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">{t('marketPrices.benchmarkRate', 'Benchmark Rate')}</span>
              <span className="agri-market-detail-metric-card__value" style={{ color: 'var(--primary-700)' }}>
                {formatCurrency(marketPrice.pricePerQuintal)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('marketPrices.perQuintal100', 'Per quintal (100 kg)')}
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">{t('marketPrices.ratePerKg', 'Rate Per Kg')}</span>
              <span className="agri-market-detail-metric-card__value">
                ₹{Number(marketPrice.pricePerKg).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('marketPrices.directFarmRate', 'Direct farm gate unit rate')}
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">{t('marketPrices.movement24h', '24h Movement')}</span>
              <span
                className="agri-market-detail-metric-card__value"
                style={{ color: isRising ? '#059669' : isFalling ? '#dc2626' : 'var(--slate-700)' }}
              >
                {marketPrice.change != null ? `${isRising ? '+' : ''}₹${marketPrice.change}` : '—'}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {marketPrice.previousPrice != null
                  ? `${isRising ? '+' : ''}${marketPrice.changePercent}% ${t('marketPrices.from', 'from')} ₹${marketPrice.previousPrice}`
                  : t('marketPrices.noPriorTrading', 'No prior trading record')}
              </span>
            </div>

            <div className="agri-market-detail-metric-card">
              <span className="agri-market-detail-metric-card__label">{t('marketPrices.terminalArrivals', 'Terminal Arrivals')}</span>
              <span className="agri-market-detail-metric-card__value">
                {marketPrice.arrivalVolumeQ != null ? `${marketPrice.arrivalVolumeQ} q` : t('common.notAvailable', 'N/A')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {marketPrice.minPrice != null && marketPrice.maxPrice != null
                  ? `${t('marketPrices.dayRange', 'Range')}: ₹${marketPrice.minPrice} – ₹${marketPrice.maxPrice}`
                  : t('marketPrices.singleRateReported', 'Single auction rate reported')}
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
                {t('marketPrices.mandiSpecs', 'Mandi & Location Specs')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>{t('marketPrices.marketYard', 'Market Yard')}: <strong>{marketPrice.market}</strong></div>
                <div>{t('marketPrices.jurisdiction', 'Jurisdiction')}: <strong>{marketPrice.location}</strong></div>
                <div>{t('marketPrices.tradingSession', 'Trading Session')}: <strong>{t('marketPrices.spotAuction', 'Spot Wholesale Auction')}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                {t('marketPrices.qualitySource', 'Quality & Reporting Source')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>{t('marketPrices.standard', 'Standard')}: <strong>{t('harvests.quality', 'Grade')} {marketPrice.qualityGrade || 'A'}</strong></div>
                <div>{t('marketPrices.sourceBulletin', 'Source Bulletin')}: <strong>{marketPrice.source || 'Ministry of Agriculture (Agmarknet)'}</strong></div>
                <div>{t('marketPrices.effectiveDate', 'Effective Date')}: <strong>{marketPrice.date}</strong></div>
              </div>
            </div>
          </div>

          {/* Source Notice */}
          <div className="agri-market-disclaimer-banner">
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>{t('marketPrices.officialSource', 'Official Agmarknet Source:')}</strong> {t('marketPrices.officialDisclaimer', 'APMC commodity benchmark prices are officially reported by the Ministry of Agriculture. Modal rates fluctuate daily based on wholesale spot arrivals, commodity variety, and physical quality grade.')}
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
            aria-label={t('marketPrices.createSaleReference', 'Create Sale with this reference price')}
          >
            <PlusCircle size={16} />
            <span>{t('marketPrices.createSaleReference', 'Create Sale Using This Reference')}</span>
          </Button>
          <Button variant="secondary" size="md" onClick={onClose}>
            {t('common.close', 'Close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
