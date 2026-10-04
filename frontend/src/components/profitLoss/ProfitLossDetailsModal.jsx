import { useNavigate } from 'react-router-dom';
import { X, CreditCard, Wallet, PackageCheck, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../common';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function ProfitLossDetailsModal({ detailItem, onClose }) {
  const navigate = useNavigate();

  if (!detailItem) return null;

  const isCrop = Boolean(detailItem.crop);
  const title = isCrop ? `Crop Financials: ${detailItem.crop}` : `Holding Financials: ${detailItem.farmName}`;
  const isProfitable = detailItem.profit >= 0;

  const handleGoToExpenses = () => {
    onClose();
    if (isCrop) {
      navigate(`/expenses?crop=${encodeURIComponent(detailItem.crop)}`);
    } else {
      navigate(`/expenses?farmId=${encodeURIComponent(detailItem.farmId)}`);
    }
  };

  const handleGoToRevenue = () => {
    onClose();
    if (isCrop) {
      navigate(`/revenue?crop=${encodeURIComponent(detailItem.crop)}`);
    } else {
      navigate(`/revenue?farmId=${encodeURIComponent(detailItem.farmId)}`);
    }
  };

  const handleGoToHarvests = () => {
    onClose();
    if (isCrop) {
      navigate(`/harvests?crop=${encodeURIComponent(detailItem.crop)}`);
    } else {
      navigate(`/harvests?farmId=${encodeURIComponent(detailItem.farmId)}`);
    }
  };

  const handleGoToSales = () => {
    onClose();
    if (isCrop) {
      navigate(`/sales?crop=${encodeURIComponent(detailItem.crop)}`);
    } else {
      navigate('/sales');
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pl-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className={`agri-margin-badge ${isProfitable ? 'agri-margin-badge--positive' : 'agri-margin-badge--negative'}`}>
                {formatPercentage(detailItem.margin)} Margin
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {isCrop ? 'Agronomic Cost Center' : 'Holding Cost Center'}
              </span>
            </div>
            <h3 id="pl-modal-title" className="agri-modal-title">
              {title}
            </h3>
            <p className="agri-modal-subtitle">
              Net operational return and financial breakdown
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
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Gross Revenue
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                {formatCurrency(detailItem.revenue)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {detailItem.salesCount} sales invoices
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Total Expenses
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
                {formatCurrency(detailItem.expense)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {detailItem.expenseCount} input vouchers
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Net Operating Profit
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isProfitable ? '#059669' : '#dc2626', marginTop: '0.2rem' }}>
                {isProfitable ? `+${formatCurrency(detailItem.profit)}` : formatCurrency(detailItem.profit)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {isProfitable ? <ArrowUpRight size={12} color="#059669" /> : <ArrowDownRight size={12} color="#dc2626" />}
                {isProfitable ? 'Positive Return' : 'Deficit'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Net Margin
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isProfitable ? '#2563eb' : '#dc2626', marginTop: '0.2rem' }}>
                {formatPercentage(detailItem.margin)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Profit ratio
              </span>
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', backgroundColor: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--slate-800)' }}>
              Financial Context & Cost Allocation
            </h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              All expenses are logged via procurement vouchers linked directly to field parcels. Revenue is realized upon execution of commercial produce sales with registered buyers.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="agri-modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleGoToExpenses} aria-label="View Vouchers">
              <CreditCard size={14} />
              <span>View Expenses</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToRevenue} aria-label="View Revenue Inflows">
              <Wallet size={14} />
              <span>View Revenue</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToHarvests} aria-label="View Harvest Lots">
              <PackageCheck size={14} />
              <span>Harvests</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToSales} aria-label="View Sales Invoices">
              <Receipt size={14} />
              <span>Sales</span>
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
