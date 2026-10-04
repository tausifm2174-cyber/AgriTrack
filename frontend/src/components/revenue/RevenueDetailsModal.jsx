import { useNavigate } from 'react-router-dom';
import { X, PackageCheck, Sprout, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../common';
import { SalesStatusBadge } from '../sales';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function RevenueDetailsModal({ sale, onClose }) {
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
      aria-labelledby="revenue-modal-title"
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
            <h3 id="revenue-modal-title" className="agri-modal-title">
              Revenue Inflow: {sale.cropName} ({sale.variety})
            </h3>
            <p className="agri-modal-subtitle">
              Invoiced to {sale.buyerName} • {sale.market} • {sale.invoiceNumber}
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
          {/* Financial Tiles */}
          <div className="agri-revenue-detail-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Gross Revenue
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                {formatCurrency(sale.totalAmount)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {formatWeight(sale.quantityKg, 'kg')} total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Realized Price
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                ₹{Number(sale.pricePerKg).toFixed(2)}/kg
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                ₹{sale.pricePerQuintal}/quintal
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Amount Collected
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                {formatCurrency(sale.paidAmount || 0)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Via {sale.paymentMethod || 'Bank Transfer'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Balance Receivable
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: sale.balanceDue > 0 ? '#b45309' : '#059669', marginTop: '0.2rem' }}>
                {formatCurrency(sale.balanceDue || 0)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {sale.balanceDue > 0 ? 'Due from buyer' : 'Settled'}
              </span>
            </div>
          </div>

          {/* APMC Benchmark Differential */}
          {sale.referenceMarketPricePerQ && (
            <div
              style={{
                backgroundColor: diffPerQ >= 0 ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${diffPerQ >= 0 ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: diffPerQ >= 0 ? '#15803d' : '#b91c1c',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} />
                <div>
                  <div style={{ fontWeight: 700 }}>
                    Mandi Benchmark Differential ({sale.market})
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    APMC Benchmark: ₹{sale.referenceMarketPricePerQ}/q | Realized Contract: ₹{sale.pricePerQuintal}/q
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 800 }}>
                {diffPerQ >= 0 ? (
                  <>
                    <ArrowUpRight size={16} />
                    <span>+₹{diffPerQ}/q Premium</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={16} />
                    <span>-₹{Math.abs(diffPerQ)}/q Discount</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Context Grids */}
          <div className="agri-form-grid agri-form-grid--2">
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Production Origin & Crop Lot
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Farm: <strong>{sale.farmName}</strong></div>
                <div>Field: <strong>{sale.fieldName}</strong></div>
                <div>Crop Cycle: <strong>{sale.cropName} ({sale.variety})</strong></div>
                <div>Harvest Lot Ref: <span style={{ fontFamily: 'monospace', color: 'var(--primary-700)', fontWeight: 700 }}>{sale.harvestId}</span></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Commercial Buyer & Settlement
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Buyer Name: <strong>{sale.buyerName}</strong></div>
                <div>Terminal Mandi: <strong>{sale.market}</strong></div>
                <div>Payment Method: <strong>{sale.paymentMethod || 'NEFT'}</strong></div>
                <div>Sale Execution Date: <strong>{sale.saleDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {sale.notes && (
            <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Trade Realization Remarks
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
