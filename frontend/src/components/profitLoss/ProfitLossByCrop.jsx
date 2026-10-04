import { Sprout, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { calculateProfitByCrop } from '../../utils/financialCalculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Button } from '../common';

export default function ProfitLossByCrop({ sales = [], expenses = [], onSelectCrop }) {
  const cropList = calculateProfitByCrop(sales, expenses);

  return (
    <div className="agri-pl-panel">
      <div className="agri-pl-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sprout size={18} style={{ color: 'var(--primary-700)' }} />
          <h3 className="agri-pl-panel__title">Crop-Wise Financial Performance</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          {cropList.length} Active Crops
        </span>
      </div>

      <div className="agri-pl-panel__body">
        <table className="agri-pl-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Net Profit / Loss</th>
              <th>Margin</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cropList.map((item) => {
              const isProfit = item.profit >= 0;
              return (
                <tr key={item.crop}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      {item.crop}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                      {item.salesCount} sales • {item.expenseCount} vouchers
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(item.revenue)}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#dc2626' }}>
                      {formatCurrency(item.expense)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 800, color: isProfit ? '#059669' : '#dc2626' }}>
                      {isProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{isProfit ? '+' : ''}{formatCurrency(item.profit)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`agri-margin-badge ${isProfit ? 'agri-margin-badge--positive' : 'agri-margin-badge--negative'}`}>
                      {formatPercentage(item.margin)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectCrop && onSelectCrop(item)}
                      aria-label={`View details for ${item.crop}`}
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </Button>
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
