import { Eye, MapPin } from 'lucide-react';
import { Button, StatusBadge } from '../common';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseCard({ expense, onViewDetails }) {
  const catLower = expense.category?.toLowerCase() || 'other';
  const catClass =
    catLower.includes('seed')
      ? 'agri-category-pill--seeds'
      : catLower.includes('fertilizer')
      ? 'agri-category-pill--fertilizer'
      : catLower.includes('labour')
      ? 'agri-category-pill--labour'
      : catLower.includes('fuel')
      ? 'agri-category-pill--fuel'
      : catLower.includes('irrigation')
      ? 'agri-category-pill--irrigation'
      : catLower.includes('machinery')
      ? 'agri-category-pill--machinery'
      : '';

  return (
    <div className="agri-expense-card">
      <div className="agri-expense-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
              {expense.id}
            </span>
            <span className={`agri-category-pill ${catClass}`}>
              {expense.category}
            </span>
            <StatusBadge variant={expense.status === 'PAID' ? 'success' : 'warning'}>
              {expense.status === 'PAID' ? 'Paid' : 'Pending'}
            </StatusBadge>
          </div>
          <h3 className="agri-expense-card__title">
            {expense.description}
          </h3>
          <div className="agri-expense-card__subtitle">
            Vendor: <strong>{expense.vendor}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {formatCurrency(expense.amount)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
            {expense.receiptNumber}
          </div>
        </div>
      </div>

      <div className="agri-expense-card__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <MapPin size={13} />
          <span>
            {expense.farmName} • {expense.fieldName} {expense.cropName ? `(${expense.cropName})` : ''}
          </span>
        </div>

        <div className="agri-expense-card__stats-grid">
          <div className="agri-expense-card__stat-item">
            <span className="agri-expense-card__stat-label">Date</span>
            <span className="agri-expense-card__stat-value" style={{ fontSize: '0.875rem' }}>
              {expense.date}
            </span>
          </div>
          <div className="agri-expense-card__stat-item">
            <span className="agri-expense-card__stat-label">Payment Method</span>
            <span className="agri-expense-card__stat-value" style={{ fontSize: '0.875rem' }}>
              {expense.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      <div className="agri-expense-card__footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          Status: <strong>{expense.status === 'PAID' ? 'Settled Voucher' : 'Pending Payment'}</strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(expense)}
          aria-label={`View details for ${expense.id}`}
        >
          <Eye size={14} />
          <span>Details</span>
        </Button>
      </div>
    </div>
  );
}
