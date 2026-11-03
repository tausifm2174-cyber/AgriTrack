import { useTranslation } from 'react-i18next';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '../common';
import { SalesStatusBadge } from '../sales';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import {
  formatFieldName,
  translateCrop,
  translateVariety,
} from '../../utils/displayLabels';

export default function RevenueCard({ sale, onViewDetails }) {
  const { t } = useTranslation();

  return (
    <div className="agri-revenue-card">
      <div className="agri-revenue-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', fontFamily: 'monospace' }}>
              {sale.id}
            </span>
            <SalesStatusBadge status={sale.status} type="sale" />
            <SalesStatusBadge status={sale.paymentStatus} type="payment" />
          </div>
          <h3 className="agri-revenue-card__title">
            {translateCrop(sale.cropName, t)} ({translateVariety(sale.variety, t)})
          </h3>
          <div className="agri-revenue-card__subtitle">
            {sale.buyerName} • {sale.market}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
            {formatCurrency(sale.totalAmount)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
            {sale.invoiceNumber}
          </div>
        </div>
      </div>

      <div className="agri-revenue-card__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <MapPin size={13} />
          <span>
            {t(`farms.demoNames.${sale.farmId}`, sale.farmName)} • {formatFieldName(sale.fieldName, t)}
          </span>
        </div>

        <div className="agri-revenue-card__stats-grid">
          <div className="agri-revenue-card__stat-item">
            <span className="agri-revenue-card__stat-label">{t('common.quantity', 'Quantity')}</span>
            <span className="agri-revenue-card__stat-value">
              {formatWeight(sale.quantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-revenue-card__stat-item">
            <span className="agri-revenue-card__stat-label">{t('revenue.realizedPrice', 'Realized Price')}</span>
            <span className="agri-revenue-card__stat-value">
              ₹{Number(sale.pricePerKg).toFixed(2)}/kg
            </span>
          </div>
        </div>
      </div>

      <div className="agri-revenue-card__footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          {t('common.date', 'Date')}: <strong>{sale.saleDate}</strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(sale)}
          aria-label={`${t('common.viewDetails', 'View revenue details for')} ${sale.id}`}
        >
          <Eye size={14} />
          <span>{t('common.details', 'Details')}</span>
        </Button>
      </div>
    </div>
  );
}
