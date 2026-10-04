import { useNavigate } from 'react-router-dom';
import { X, PackageCheck, Sprout, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../common';
import SalesStatusBadge from './SalesStatusBadge';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function SaleDetailsModal({ sale, onClose }) {
  const navigate = useNavigate();

  if (!sale) return null;

  const handleGoToHarvest = () => {
    onClose();
    navigate(`/harvests?id=${encodeURIComponent(sale.harvestId)}`);
  };

  const handleGoToCrop = () => {
    onClose();
    navigate(`/crops?crop=${encodeURIComponent(sale.cropName)}`);
  };

  const handleGoToMarketPrices = () => {
    onClose();
    navigate(`/market-prices?crop=${encodeURIComponent(sale.cropName)}`);
  };

  const diffPerQ =
    sale.referenceMarketPricePerQ && sale.pricePerQuintal
      ? sale.pricePerQuintal - sale.referenceMarketPricePerQ
      : null;

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sale-modal-title"
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
                {sale.id}
              </span>
              <SalesStatusBadge status={sale.status} type="sale" />
              <SalesStatusBadge status={sale.paymentStatus} type="payment" />
            </div>
            <h3 id="sale-modal-title" className="agri-modal-title">
              Sale to {sale.buyerName}
            </h3>
            <p className="agri-modal-subtitle">
              {sale.cropName} ({sale.variety}) • Invoiced on {sale.saleDate} • {sale.invoiceNumber}
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
          {/* Key Financial KPIs */}
          <div className="agri-sale-detail-metrics">
            <div className="agri-sale-detail-metric-card">
              <span className="agri-sale-detail-metric-card__label">Total Invoiced</span>
              <span className="agri-sale-detail-metric-card__value" style={{ color: 'var(--primary-700)' }}>
                {formatCurrency(sale.totalAmount)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {formatWeight(sale.quantityKg, 'kg')} total
              </span>
            </div>

            <div className="agri-sale-detail-metric-card">
              <span className="agri-sale-detail-metric-card__label">Unit Realization</span>
              <span className="agri-sale-detail-metric-card__value">
                ₹{Number(sale.pricePerKg).toFixed(2)}/kg
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                ₹{sale.pricePerQuintal}/quintal
              </span>
            </div>

            <div className="agri-sale-detail-metric-card">
              <span className="agri-sale-detail-metric-card__label">Amount Settled</span>
              <span className="agri-sale-detail-metric-card__value" style={{ color: '#059669' }}>
                {formatCurrency(sale.paidAmount || 0)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Via {sale.paymentMethod || 'NEFT'}
              </span>
            </div>

            <div className="agri-sale-detail-metric-card">
              <span className="agri-sale-detail-metric-card__label">Balance Due</span>
              <span
                className="agri-sale-detail-metric-card__value"
                style={{ color: sale.balanceDue > 0 ? '#b45309' : '#059669' }}
              >
                {formatCurrency(sale.balanceDue || 0)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {sale.balanceDue > 0 ? 'Receivable' : 'Fully Cleared'}
              </span>
            </div>
          </div>

          {/* APMC Mandi Benchmark Comparison */}
          {sale.referenceMarketPricePerQ && (
            <div
              className={`agri-reference-banner ${
                diffPerQ >= 0 ? 'agri-reference-banner--premium' : 'agri-reference-banner--discount'
              }`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <TrendingUp size={20} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    APMC Benchmark Rate Comparison ({sale.market})
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    Market Reference: ₹{sale.referenceMarketPricePerQ}/quintal | Contracted: ₹{sale.pricePerQuintal}/quintal
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.925rem' }}>
                {diffPerQ >= 0 ? (
                  <>
                    <ArrowUpRight size={18} />
                    <span>+₹{diffPerQ}/q Premium</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={18} />
                    <span>-₹{Math.abs(diffPerQ)}/q Discount</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Details Section Grid */}
          <div className="agri-form-grid agri-form-grid--2">
            {/* Buyer & Market */}
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Commercial Buyer & Market
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Buyer: <strong>{sale.buyerName}</strong></div>
                <div>Terminal Mandi: <strong>{sale.market}</strong></div>
                <div>Invoice Ref: <span style={{ fontFamily: 'monospace' }}>{sale.invoiceNumber}</span></div>
                <div>Execution Date: <strong>{sale.saleDate}</strong></div>
              </div>
            </div>

            {/* Farm & Harvest Source */}
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Produce Source Origin
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Farm: <strong>{sale.farmName}</strong></div>
                <div>Field: <strong>{sale.fieldName}</strong></div>
                <div>Harvest Lot: <span style={{ fontFamily: 'monospace', color: 'var(--primary-700)', fontWeight: 700 }}>{sale.harvestId}</span></div>
                <div>Crop Variety: <strong>{sale.cropName} ({sale.variety})</strong></div>
              </div>
            </div>
          </div>

          {/* Transaction Notes */}
          {sale.notes && (
            <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Transaction & Settlement Notes
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                {sale.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="agri-modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleGoToHarvest} aria-label="View Harvest Lot">
              <PackageCheck size={14} />
              <span>View Harvest</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToCrop} aria-label="View Crop">
              <Sprout size={14} />
              <span>View Crop</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToMarketPrices} aria-label="View Mandi Prices">
              <TrendingUp size={14} />
              <span>Market Prices</span>
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
