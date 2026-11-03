import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Button } from '../common';
import SalesStatusBadge from './SalesStatusBadge';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function SalesTable({ sales, onViewDetails }) {
  const { t } = useTranslation();

  return (
    <div className="agri-sales-table-container">
      <div className="agri-sales-table-scroll">
        <table className="agri-sales-table">
          <thead>
            <tr>
              <th>{t('sales.saleId', 'Sale ID')}</th>
              <th>{t('crops.cropVariety', 'Crop & Variety')}</th>
              <th>{t('sales.harvestRef', 'Harvest Ref')}</th>
              <th>{t('sales.buyerMarket', 'Buyer & Market')}</th>
              <th>{t('sales.saleDate', 'Sale Date')}</th>
              <th>{t('common.quantity', 'Quantity')}</th>
              <th>{t('common.price', 'Price')}</th>
              <th>{t('sales.totalAmount', 'Total Amount')}</th>
              <th>{t('sales.paymentStatus', 'Payment')}</th>
              <th>{t('common.status', 'Status')}</th>
              <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'monospace' }}>
                    {sale.id}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                    {sale.invoiceNumber}
                  </div>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      {translateCrop(sale.cropName, t)}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {translateVariety(sale.variety, t)}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {sale.harvestId}
                  </span>
                </td>
                <td>
                  <div className="agri-sales-table__buyer-cell">
                    <span className="agri-sales-table__buyer-name">{sale.buyerName}</span>
                    <span className="agri-sales-table__buyer-market">{sale.market}</span>
                  </div>
                </td>
                <td>
                  <span style={{ whiteSpace: 'nowrap', color: 'var(--slate-600)' }}>
                    {sale.saleDate}
                  </span>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      {formatWeight(sale.quantityKg, 'kg')}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {(sale.quantityKg / 100).toFixed(1)} {t('units.q', 'q')}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                      ₹{Number(sale.pricePerKg).toFixed(2)}/kg
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      ₹{sale.pricePerQuintal}/q
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                    {formatCurrency(sale.totalAmount)}
                  </span>
                </td>
                <td>
                  <SalesStatusBadge status={sale.paymentStatus} type="payment" />
                </td>
                <td>
                  <SalesStatusBadge status={sale.status} type="sale" />
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(sale)}
                      aria-label={`${t('common.viewDetails', 'View details')} ${sale.id}`}
                    >
                      <Eye size={14} />
                      <span>{t('common.view', 'View')}</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
