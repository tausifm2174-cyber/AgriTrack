import { Warehouse, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { calculateProfitByFarm } from '../../utils/financialCalculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Button } from '../common';
import { farmData } from '../../data/farmData';

export default function ProfitLossByFarm({ sales = [], expenses = [], onSelectFarm }) {
  const farmList = calculateProfitByFarm(sales, expenses, farmData.farms);

  return (
    <div className="agri-pl-panel">
      <div className="agri-pl-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Warehouse size={18} style={{ color: 'var(--primary-700)' }} />
          <h3 className="agri-pl-panel__title">Holding-Wise Financial Performance</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          {farmList.length} Holdings
        </span>
      </div>

      <div className="agri-pl-panel__body">
        <table className="agri-pl-table">
          <thead>
            <tr>
              <th>Farm / Holding</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Net Profit / Loss</th>
              <th>Margin</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {farmList.map((item) => {
              const isProfit = item.profit >= 0;
              return (
                <tr key={item.farmId}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      {item.farmName}
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
                      onClick={() => onSelectFarm && onSelectFarm(item)}
                      aria-label={`View details for ${item.farmName}`}
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
