import { useNavigate } from 'react-router-dom';
import { X, Warehouse, Grid3X3, Sprout } from 'lucide-react';
import { Button, StatusBadge } from '../common';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseDetailsModal({ expense, onClose }) {
  const navigate = useNavigate();

  if (!expense) return null;

  const handleGoToFarm = () => {
    onClose();
    navigate('/farms');
  };

  const handleGoToField = () => {
    onClose();
    navigate('/fields');
  };

  const handleGoToCrop = () => {
    onClose();
    if (expense.cropName) {
      navigate(`/crops?crop=${encodeURIComponent(expense.cropName)}`);
    } else {
      navigate('/crops');
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-modal-title"
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
                {expense.id}
              </span>
              <StatusBadge variant={expense.status === 'PAID' ? 'success' : 'warning'}>
                {expense.status === 'PAID' ? 'Paid' : 'Pending'}
              </StatusBadge>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {expense.receiptNumber}
              </span>
            </div>
            <h3 id="expense-modal-title" className="agri-modal-title">
              {expense.description}
            </h3>
            <p className="agri-modal-subtitle">
              Category: <strong>{expense.category}</strong> • Date: {expense.date}
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
          {/* Key Metric Tiles */}
          <div className="agri-expense-detail-metrics">
            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">Amount Incurred</span>
              <span className="agri-expense-detail-metric-card__value" style={{ color: '#dc2626' }}>
                {formatCurrency(expense.amount)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Voucher gross amount
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">Payment Status</span>
              <span className="agri-expense-detail-metric-card__value" style={{ color: expense.status === 'PAID' ? '#059669' : '#d97706', fontSize: '1.1rem' }}>
                {expense.status === 'PAID' ? 'Settled in Full' : 'Pending Settlement'}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Via {expense.paymentMethod}
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">Farm Cost Center</span>
              <span className="agri-expense-detail-metric-card__value" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {expense.farmName}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {expense.fieldName}
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">Target Crop</span>
              <span className="agri-expense-detail-metric-card__value" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {expense.cropName || 'General Farm'}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                Agronomic crop link
              </span>
            </div>
          </div>

          {/* Vendor & Payment Details Grid */}
          <div className="agri-form-grid agri-form-grid--2">
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Vendor & Commercial Details
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Vendor: <strong>{expense.vendor}</strong></div>
                <div>Receipt / Voucher Ref: <span style={{ fontFamily: 'monospace' }}>{expense.receiptNumber}</span></div>
                <div>Transaction Date: <strong>{expense.date}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Accounting & Payment Specs
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>Payment Method: <strong>{expense.paymentMethod}</strong></div>
                <div>Category Allocation: <strong>{expense.category}</strong></div>
                <div>Settlement Status: <strong style={{ color: expense.status === 'PAID' ? '#059669' : '#d97706' }}>{expense.status}</strong></div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Voucher & Technical Remarks
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                {expense.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="agri-modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleGoToFarm} aria-label="View Farm">
              <Warehouse size={14} />
              <span>View Farm</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToField} aria-label="View Field">
              <Grid3X3 size={14} />
              <span>View Field</span>
            </Button>
            {expense.cropName && (
              <Button variant="outline" size="sm" onClick={handleGoToCrop} aria-label="View Crop">
                <Sprout size={14} />
                <span>View Crop</span>
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
