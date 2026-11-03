import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Button } from '../common';
import { SalesStatusBadge } from '../sales';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import {
  formatFieldName,
  translateCrop,
  translateVariety,
} from '../../utils/displayLabels';

export default function RevenueTable({ sales, onViewDetails }) {
  const { t } = useTranslation();

  return (
    <div className="agri-revenue-table-container">
      <div className="agri-revenue-table-scroll">
        <table className="agri-revenue-table">
          <thead>
            <tr>
              <th>{t('sales.saleId', 'Sale ID')}</th>
              <th>{t('sales.saleDate', 'Sale Date')}</th>
              <th>{t('marketPrices.cropVariety', 'Crop & Variety')}</th>
              <th>{t('expenses.farmField', 'Farm & Field')}</th>
              <th>{t('sales.buyerMarket', 'Buyer & Market')}</th>
              <th>{t('common.quantity', 'Quantity')}</th>
              <th>{t('revenue.realizedPrice', 'Realized Price')}</th>
              <th>{t('revenue.grossRevenue', 'Gross Revenue')}</th>
              <th>{t('expenses.payment', 'Payment')}</th>
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
                  <span style={{ whiteSpace: 'nowrap', color: 'var(--slate-600)' }}>
                    {sale.saleDate}
                  </span>
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
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                      {t(`farms.demoNames.${sale.farmId}`, sale.farmName)}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {formatFieldName(sale.fieldName, t)}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.85rem' }}>
                      {sale.buyerName}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {sale.market}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      {formatWeight(sale.quantityKg, 'kg')}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {(sale.quantityKg / 100).toFixed(1)} q
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
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
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
                      aria-label={`${t('common.viewDetails', 'View details for')} ${sale.id}`}
                    >
                      <Eye size={14} />
                      <span>{t('common.viewDetails', 'View')}</span>
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
