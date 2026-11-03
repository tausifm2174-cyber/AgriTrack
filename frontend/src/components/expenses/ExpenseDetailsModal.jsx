import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Warehouse, Grid3X3, Sprout } from 'lucide-react';
import { Button, StatusBadge } from '../common';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseDetailsModal({ expense, onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                {expense.status === 'PAID' ? t('status.paid', 'Paid') : t('status.pending', 'Pending')}
              </StatusBadge>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {expense.receiptNumber}
              </span>
            </div>
            <h3 id="expense-modal-title" className="agri-modal-title">
              {expense.description}
            </h3>
            <p className="agri-modal-subtitle">
              {t('expenses.category', 'Category')}: <strong>{expense.category}</strong> • {t('common.date', 'Date')}: {expense.date}
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
          {/* Key Metric Tiles */}
          <div className="agri-expense-detail-metrics">
            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">{t('expenses.amountIncurred', 'Amount Incurred')}</span>
              <span className="agri-expense-detail-metric-card__value" style={{ color: '#dc2626' }}>
                {formatCurrency(expense.amount)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('expenses.voucherGross', 'Voucher gross amount')}
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">{t('expenses.paymentStatus', 'Payment Status')}</span>
              <span className="agri-expense-detail-metric-card__value" style={{ color: expense.status === 'PAID' ? '#059669' : '#d97706', fontSize: '1.1rem' }}>
                {expense.status === 'PAID' ? t('expenses.settledInFull', 'Settled in Full') : t('expenses.pendingSettlement', 'Pending Settlement')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('expenses.via', 'Via')} {expense.paymentMethod}
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">{t('expenses.farmCostCenter', 'Farm Cost Center')}</span>
              <span className="agri-expense-detail-metric-card__value" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {expense.farmName}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {expense.fieldName}
              </span>
            </div>

            <div className="agri-expense-detail-metric-card">
              <span className="agri-expense-detail-metric-card__label">{t('expenses.targetCrop', 'Target Crop')}</span>
              <span className="agri-expense-detail-metric-card__value" style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                {expense.cropName || t('expenses.generalFarm', 'General Farm')}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('expenses.cropLink', 'Agronomic crop link')}
              </span>
            </div>
          </div>

          {/* Vendor & Payment Details Grid */}
          <div className="agri-form-grid agri-form-grid--2">
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                {t('expenses.vendorCommercial', 'Vendor & Commercial Details')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>{t('expenses.vendor', 'Vendor')}: <strong>{expense.vendor}</strong></div>
                <div>{t('expenses.voucherRef', 'Receipt / Voucher Ref')}: <span style={{ fontFamily: 'monospace' }}>{expense.receiptNumber}</span></div>
                <div>{t('expenses.txDate', 'Transaction Date')}: <strong>{expense.date}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                {t('expenses.accountingSpecs', 'Accounting & Payment Specs')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>{t('expenses.paymentMethod', 'Payment Method')}: <strong>{expense.paymentMethod}</strong></div>
                <div>{t('expenses.categoryAlloc', 'Category Allocation')}: <strong>{expense.category}</strong></div>
                <div>{t('expenses.settlementStatus', 'Settlement Status')}: <strong style={{ color: expense.status === 'PAID' ? '#059669' : '#d97706' }}>{expense.status}</strong></div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                {t('expenses.voucherRemarks', 'Voucher & Technical Remarks')}
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
            <Button variant="outline" size="sm" onClick={handleGoToFarm} aria-label={t('navigation.farms', 'View Farm')}>
              <Warehouse size={14} />
              <span>{t('navigation.farms', 'View Farm')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToField} aria-label={t('navigation.fields', 'View Field')}>
              <Grid3X3 size={14} />
              <span>{t('navigation.fields', 'View Field')}</span>
            </Button>
            {expense.cropName && (
              <Button variant="outline" size="sm" onClick={handleGoToCrop} aria-label={t('navigation.crops', 'View Crop')}>
                <Sprout size={14} />
                <span>{t('navigation.crops', 'View Crop')}</span>
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('common.close', 'Close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
