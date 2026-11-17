import { useTranslation } from 'react-i18next';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Button, StatusBadge } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { formatFieldName, translateCrop } from '../../utils/displayLabels';

export default function ExpenseTable({ expenses, onViewDetails, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="agri-expense-table-container">
      <div className="agri-expense-table-scroll">
        <table className="agri-expense-table">
          <thead>
            <tr>
              <th>{t('expenses.expenseId', 'Expense ID')}</th>
              <th>{t('common.date', 'Date')}</th>
              <th>{t('expenses.farmField', 'Farm & Field')}</th>
              <th>{t('activities.crop', 'Crop')}</th>
              <th>{t('expenses.category', 'Category')}</th>
              <th>{t('expenses.descVendor', 'Description & Vendor')}</th>
              <th>{t('expenses.amount', 'Amount')}</th>
              <th>{t('expenses.payment', 'Payment')}</th>
              <th>{t('common.status', 'Status')}</th>
              <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => {
              const catLower = exp.category?.toLowerCase() || 'other';
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
                <tr key={exp.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'monospace' }}>
                      {exp.id}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                      {exp.receiptNumber}
                    </div>
                  </td>
                  <td>
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--slate-600)' }}>
                      {exp.date}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                        {t(`farms.demoNames.${exp.farmId}`, exp.farmName)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {formatFieldName(exp.fieldName, t)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                      {exp.cropName ? translateCrop(exp.cropName, t) : t('expenses.generalFarm', 'General Farm')}
                    </span>
                  </td>
                  <td>
                    <span className={`agri-category-pill ${catClass}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '240px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--slate-900)', display: 'block', fontSize: '0.85rem' }}>
                        {exp.description}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {exp.vendor}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '0.95rem' }}>
                      {formatCurrency(exp.amount)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <StatusBadge variant={exp.status === 'PAID' ? 'success' : 'warning'}>
                      {exp.status === 'PAID' ? t('status.paid', 'Paid') : t('status.pending', 'Pending')}
                    </StatusBadge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(exp)}
                        aria-label={`${t('common.viewDetails', 'View details for')} ${exp.id}`}
                      >
                        <Eye size={14} />
                        <span>{t('common.viewDetails', 'View')}</span>
                      </Button>
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(exp)}
                          aria-label={`${t('common.edit', 'Edit')} ${exp.id}`}
                        >
                          <Edit2 size={14} />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(exp)}
                          style={{ color: '#dc2626' }}
                          aria-label={`${t('common.delete', 'Delete')} ${exp.id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
