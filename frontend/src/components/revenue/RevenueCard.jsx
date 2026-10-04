import { Eye, MapPin } from 'lucide-react';
import { Button } from '../common';
import { SalesStatusBadge } from '../sales';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function RevenueCard({ sale, onViewDetails }) {
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
            {sale.cropName} ({sale.variety})
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
            {sale.farmName} • {sale.fieldName}
          </span>
        </div>

        <div className="agri-revenue-card__stats-grid">
          <div className="agri-revenue-card__stat-item">
            <span className="agri-revenue-card__stat-label">Quantity</span>
            <span className="agri-revenue-card__stat-value">
              {formatWeight(sale.quantityKg, 'kg')}
            </span>
          </div>
          <div className="agri-revenue-card__stat-item">
            <span className="agri-revenue-card__stat-label">Realized Price</span>
            <span className="agri-revenue-card__stat-value">
              ₹{Number(sale.pricePerKg).toFixed(2)}/kg
            </span>
          </div>
        </div>
      </div>

      <div className="agri-revenue-card__footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          Date: <strong>{sale.saleDate}</strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(sale)}
          aria-label={`View revenue details for ${sale.id}`}
        >
          <Eye size={14} />
          <span>Details</span>
        </Button>
      </div>
    </div>
  );
}
