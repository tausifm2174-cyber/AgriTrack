import { Eye } from 'lucide-react';
import { Button } from '../common';
import SalesStatusBadge from './SalesStatusBadge';
import { formatCurrency, formatWeight } from '../../utils/formatters';

export default function SalesTable({ sales, onViewDetails }) {
  return (
    <div className="agri-sales-table-container">
      <div className="agri-sales-table-scroll">
        <table className="agri-sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Crop & Variety</th>
              <th>Harvest Ref</th>
              <th>Buyer & Market</th>
              <th>Sale Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Amount</th>
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
