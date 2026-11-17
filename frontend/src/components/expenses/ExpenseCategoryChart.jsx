import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { calculateExpensesByCategory } from '../../utils/financialCalculations';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_COLORS = [
  '#dc2626', // Seeds
  '#2563eb', // Fertilizer
  '#059669', // Labour
  '#d97706', // Fuel
  '#7c3aed', // Machinery
  '#0891b2', // Irrigation
  '#ea580c', // Transport
  '#4f46e5', // Soil Testing
  '#64748b', // Other
];

export default function ExpenseCategoryChart({ expenses = [], categoryBreakdown = null }) {
  const { t } = useTranslation();
  const data = Array.isArray(categoryBreakdown) && categoryBreakdown.length > 0
    ? categoryBreakdown.map((b) => ({
        category: b.category,
        amount: b.totalAmount != null ? Number(b.totalAmount) : Number(b.amount || 0),
        count: b.count || 0,
        percentage: b.percentageOfExpenses != null ? Number(b.percentageOfExpenses) : Number(b.percentage || 0),
      }))
    : calculateExpensesByCategory(expenses);

  if (data.length === 0) {
    return (
      <div className="agri-expense-chart-box">
        <div className="agri-expense-chart-box__header">
          <span className="agri-expense-chart-box__title">{t('expenses.categoryDistribution', 'Expense Distribution by Category')}</span>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          {t('expenses.noVouchersMatch', 'No expense vouchers match the selected filters.')}
        </div>
      </div>
    );
  }

  return (
    <div className="agri-expense-chart-box">
      <div className="agri-expense-chart-box__header">
        <div>
          <span className="agri-expense-chart-box__title">{t('expenses.categoryDistribution', 'Expense Distribution by Category')}</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {t('expenses.aggregatedCostDesc', 'Aggregated cost breakdown across active inputs & operational vouchers')}
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          {data.length} {t('expenses.activeCategories', 'Active Categories')}
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              tickFormatter={(cat) => t(`expenseCategories.${(cat || '').toLowerCase()}`, cat)}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              width={55}
            />
            <Tooltip
              formatter={(value, name, item) => [
                `${formatCurrency(value)} (${item.payload.percentage}%)`,
                t('expenses.totalExpenditure', 'Total Expenditure'),
              ]}
              labelFormatter={(label) => `${t('common.category', 'Category')}: ${t(`expenseCategories.${(label || '').toLowerCase()}`, label)}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.category}`}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
