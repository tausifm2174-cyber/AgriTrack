import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, Wallet, PackageCheck, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../common';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function ProfitLossDetailsModal({ detailItem, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!detailItem) return null;

  const isCrop = Boolean(detailItem.crop);
  const title = isCrop
    ? t('profitLoss.cropFinancials', 'Crop Financials: {{crop}}', { crop: detailItem.crop })
    : t('profitLoss.farmFinancials', 'Holding Financials: {{farm}}', { farm: detailItem.farmName });
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
                {formatPercentage(detailItem.margin)} {t('profitLoss.margin', 'Margin')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {isCrop ? t('profitLoss.agronomicCenter', 'Agronomic Cost Center') : t('profitLoss.holdingCenter', 'Holding Cost Center')}
              </span>
            </div>
            <h3 id="pl-modal-title" className="agri-modal-title">
              {title}
            </h3>
            <p className="agri-modal-subtitle">
              {t('profitLoss.modalSubtitle', 'Net operational return and financial breakdown')}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
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
                {t('revenue.totalRevenue', 'Gross Revenue')}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                {formatCurrency(detailItem.revenue)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('profitLoss.salesInvoicesCount', '{{count}} sales invoices', { count: detailItem.salesCount })}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                {t('profitLoss.totalExpenses', 'Total Expenses')}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
                {formatCurrency(detailItem.expense)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('profitLoss.vouchersCount', '{{count}} input vouchers', { count: detailItem.expenseCount })}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                {t('profitLoss.netProfit', 'Net Operating Profit')}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isProfitable ? '#059669' : '#dc2626', marginTop: '0.2rem' }}>
                {isProfitable ? `+${formatCurrency(detailItem.profit)}` : formatCurrency(detailItem.profit)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {isProfitable ? <ArrowUpRight size={12} color="#059669" /> : <ArrowDownRight size={12} color="#dc2626" />}
                {isProfitable ? t('profitLoss.positiveReturn', 'Positive Return') : t('profitLoss.deficit', 'Deficit')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                {t('profitLoss.netMargin', 'Net Margin')}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isProfitable ? '#2563eb' : '#dc2626', marginTop: '0.2rem' }}>
                {formatPercentage(detailItem.margin)}
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                {t('profitLoss.profitRatio', 'Profit ratio')}
              </span>
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', backgroundColor: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--slate-800)' }}>
              {t('profitLoss.contextHeading', 'Financial Context & Cost Allocation')}
            </h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              {t('profitLoss.contextDesc', 'All expenses are logged via procurement vouchers linked directly to field parcels. Revenue is realized upon execution of commercial produce sales with registered buyers.')}
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="agri-modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={handleGoToExpenses} aria-label={t('navigation.expenses', 'Expenses')}>
              <CreditCard size={14} />
              <span>{t('navigation.expenses', 'Expenses')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToRevenue} aria-label={t('navigation.revenue', 'Revenue')}>
              <Wallet size={14} />
              <span>{t('navigation.revenue', 'Revenue')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToHarvests} aria-label={t('navigation.harvests', 'Harvests')}>
              <PackageCheck size={14} />
              <span>{t('navigation.harvests', 'Harvests')}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToSales} aria-label={t('navigation.sales', 'Sales')}>
              <Receipt size={14} />
              <span>{t('navigation.sales', 'Sales')}</span>
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('common.close', 'Close')}
          </Button>
        </div>
      </div>
    </div>
  );
}

