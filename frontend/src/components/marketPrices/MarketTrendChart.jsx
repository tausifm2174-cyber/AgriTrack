import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function MarketTrendChart({ history = [], crop, market }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
        No historical price records available for chart rendering.
      </div>
    );
  }

  // Calculate min and max for Y-axis domain padding
  const prices = history.map((h) => h.price);
  const minP = Math.floor(Math.min(...prices) * 0.98);
  const maxP = Math.ceil(Math.max(...prices) * 1.02);

  return (
    <div className="agri-trend-chart-box">
      <div className="agri-trend-chart-box__header">
        <span className="agri-trend-chart-box__title">
          5-Day Mandi Price Movement ({crop} • {market})
        </span>
        <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
          Sample Historical Points
        </span>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[minP, maxP]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
              width={65}
            />
            <Tooltip
              formatter={(value, name) => [
                name === 'price' ? `₹${value} / quintal` : `${value} q`,
                name === 'price' ? 'Reference Rate' : 'Arrival Volume',
              ]}
              labelFormatter={(label) => `Date: ${label} 2026`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--primary-600)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--primary-600)', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--primary-700)' }}
              name="price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
