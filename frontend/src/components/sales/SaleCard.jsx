import { useTranslation } from 'react-i18next';
import { Eye, MapPin, Calendar } from 'lucide-react';
import { Button } from '../common';
import SalesStatusBadge from './SalesStatusBadge';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function SaleCard({ sale, onViewDetails }) {
  const { t } = useTranslation();

  return (
    <div className="agri-sale-card">
      <div className="agri-sale-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
              {sale.id}
            </span>
            <SalesStatusBadge status={sale.status} type="sale" />
            <SalesStatusBadge status={sale.paymentStatus} type="payment" />
          </div>
          <h3 className="agri-sale-card__title">
            {translateCrop(sale.cropName, t)} ({translateVariety(sale.variety, t)})
          </h3>
          <div className="agri-sale-card__subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} />
            <span>
              {sale.buyerName} • {sale.market}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
            {formatCurrency(sale.totalAmount)}
          </span>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
            {sale.invoiceNumber}
          </div>
        </div>
      </div>

      <div className="agri-sale-card__body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            <span>{t('sales.saleDate', 'Sale Date')}: {sale.saleDate}</span>
          </div>
          <div>
            {t('sales.harvestRef', 'Harvest')}: <strong style={{ color: 'var(--slate-800)', fontFamily: 'monospace' }}>{sale.harvestId}</strong>
          </div>
        </div>

        <div className="agri-sale-card__stats-grid">
          <div className="agri-sale-card__stat-item">
            <span className="agri-sale-card__stat-label">{t('common.quantity', 'Quantity')}</span>
            <span className="agri-sale-card__stat-value">
              {formatWeight(sale.quantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-sale-card__stat-item">
            <span className="agri-sale-card__stat-label">{t('sales.pricePerUnit', 'Price / Unit')}</span>
            <span className="agri-sale-card__stat-value">
              ₹{Number(sale.pricePerKg).toFixed(2)}/kg
            </span>
          </div>
          <div className="agri-sale-card__stat-item">
            <span className="agri-sale-card__stat-label">{t('sales.settledPaid', 'Settled Paid')}</span>
            <span className="agri-sale-card__stat-value" style={{ color: 'var(--primary-700)' }}>
              {formatCurrency(sale.paidAmount || 0)}
            </span>
          </div>
          <div className="agri-sale-card__stat-item">
            <span className="agri-sale-card__stat-label">{t('sales.balanceDue', 'Balance Due')}</span>
            <span
              className="agri-sale-card__stat-value"
              style={{ color: sale.balanceDue > 0 ? '#b45309' : 'var(--slate-800)' }}
            >
              {formatCurrency(sale.balanceDue || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="agri-sale-card__footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          {t('sales.paymentMethod', 'Method')}: <strong>{sale.paymentMethod || 'Direct Transfer'}</strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(sale)}
          aria-label={`${t('common.viewDetails', 'View details')} ${sale.id}`}
        >
          <Eye size={14} />
          <span>{t('common.details', 'Details')}</span>
        </Button>
      </div>
    </div>
  );
}
