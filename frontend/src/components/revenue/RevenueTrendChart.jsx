import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  // Aggregate revenue by date
  const map = {};
  sales.forEach((s) => {
    const d = s.saleDate;
    if (!map[d]) map[d] = 0;
    map[d] += s.totalAmount || 0;
  });

  const dates = Object.keys(map).sort();
  const data = dates.map((date) => {
    let label;
    try {
      label = new Intl.DateTimeFormat(i18n.language || 'en-IN', {
        day: 'numeric',
        month: 'short',
      }).format(new Date(date));
    } catch {
      const parts = date.split('-');
      label = `${parts[2]}/${parts[1]}`;
    }
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
          <span className="agri-revenue-chart-box__title">{t('revenue.trajectoryOverTime', 'Revenue Trajectory over Time')}</span>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          {t('revenue.noTransactionsFound', 'No revenue transactions found for chart plotting.')}
        </div>
      </div>
    );
  }

  return (
    <div className="agri-revenue-chart-box">
      <div className="agri-revenue-chart-box__header">
        <div>
          <span className="agri-revenue-chart-box__title">{t('revenue.realizationTimeline', 'Revenue Realization Timeline')}</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {t('revenue.chronologicalInflowDesc', 'Chronological inflow from executed produce sales')}
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          {data.length} {t('revenue.txPoints', 'Transaction Points')}
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
              formatter={(value) => [formatCurrency(value), t('revenue.grossInflow', 'Gross Inflow')]}
              labelFormatter={(label, items) => {
                const fullDate = items && items[0] ? items[0].payload.date : label;
                return `${t('common.date', 'Date')}: ${fullDate}`;
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
