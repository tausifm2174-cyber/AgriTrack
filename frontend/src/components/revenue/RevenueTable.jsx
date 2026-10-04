import { Eye } from 'lucide-react';
import { Button } from '../common';
import { SalesStatusBadge } from '../sales';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function RevenueTable({ sales, onViewDetails }) {
  return (
    <div className="agri-revenue-table-container">
      <div className="agri-revenue-table-scroll">
        <table className="agri-revenue-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Sale Date</th>
              <th>Crop & Variety</th>
              <th>Farm & Field</th>
              <th>Buyer & Market</th>
              <th>Quantity</th>
              <th>Realized Price</th>
              <th>Gross Revenue</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
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
                      {sale.cropName}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {sale.variety}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                      {sale.farmName}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {sale.fieldName}
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
                      aria-label={`View details for ${sale.id}`}
                    >
                      <Eye size={14} />
                      <span>View</span>
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
