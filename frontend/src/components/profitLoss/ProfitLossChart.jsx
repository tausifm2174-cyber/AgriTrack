import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function ProfitLossChart({ trendData = [] }) {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="agri-pl-chart-box">
        <div className="agri-pl-chart-box__header">
          <span className="agri-pl-chart-box__title">P&L Financial Trajectory Comparison</span>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          No trend records available for plotting.
        </div>
      </div>
    );
  }

  return (
    <div className="agri-pl-chart-box">
      <div className="agri-pl-chart-box__header">
        <div>
          <span className="agri-pl-chart-box__title">Financial Comparison (Revenue vs Expenses vs Net Profit)</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Comparative operating trajectory across cropping months
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          Kharif & Rabi Cycles
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              width={60}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Net Profit',
              ]}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '0.75rem' }}
              formatter={(value) => (value === 'revenue' ? 'Revenue' : value === 'expenses' ? 'Expenses' : 'Net Profit')}
            />
            <Bar dataKey="revenue" fill="#059669" name="revenue" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses" fill="#dc2626" name="expenses" radius={[3, 3, 0, 0]} />
            <Bar dataKey="profit" fill="#2563eb" name="profit" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
