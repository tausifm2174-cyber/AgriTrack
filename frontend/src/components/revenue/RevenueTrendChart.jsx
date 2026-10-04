import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function RevenueTrendChart({ sales = [] }) {
  // Aggregate revenue by date
  const map = {};
  sales.forEach((s) => {
    const d = s.saleDate;
    if (!map[d]) map[d] = 0;
    map[d] += s.totalAmount || 0;
  });

  const dates = Object.keys(map).sort();
  const data = dates.map((date) => {
    // format "2026-09-28" to "28 Sep"
    const parts = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${parts[2]} ${months[parseInt(parts[1], 10) - 1]}`;
    return {
      date,
      displayDate: label,
      revenue: map[date],
    };
  });

  if (data.length === 0) {
    return (
      <div className="agri-revenue-chart-box">
        <div className="agri-revenue-chart-box__header">
          <span className="agri-revenue-chart-box__title">Revenue Trajectory over Time</span>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          No revenue transactions found for chart plotting.
        </div>
      </div>
    );
  }

  return (
    <div className="agri-revenue-chart-box">
      <div className="agri-revenue-chart-box__header">
        <div>
          <span className="agri-revenue-chart-box__title">Revenue Realization Timeline</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Chronological inflow from executed produce sales
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          {data.length} Transaction Points
        </span>
      </div>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              width={55}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Gross Inflow']}
              labelFormatter={(label, items) => {
                const fullDate = items && items[0] ? items[0].payload.date : label;
                return `Date: ${fullDate}`;
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
              dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
