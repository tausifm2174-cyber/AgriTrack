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
import { calculateRevenueByCrop } from '../../utils/financialCalculations';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import { translateCrop } from '../../utils/displayLabels';

const CROP_REVENUE_COLORS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
];

export default function RevenueByCropChart({ sales = [] }) {
  const { t } = useTranslation();
  const data = calculateRevenueByCrop(sales);

  if (data.length === 0) {
    return (
      <div className="agri-revenue-chart-box">
        <div className="agri-revenue-chart-box__header">
          <span className="agri-revenue-chart-box__title">{t('revenue.revenueByCrop', 'Revenue by Crop')}</span>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          {t('revenue.noCropSalesMatch', 'No crop sales match the selected filters.')}
        </div>
      </div>
    );
  }

  return (
    <div className="agri-revenue-chart-box">
      <div className="agri-revenue-chart-box__header">
        <div>
          <span className="agri-revenue-chart-box__title">{t('revenue.cropWiseRevenue', 'Crop-Wise Revenue Distribution')}</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {t('revenue.grossRealizationDesc', 'Gross commercial realization across standing and harvested crops')}
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
          {data.length} {t('revenue.tradedCrops', 'Traded Crops')}
        </span>
      </div>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="crop"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(crop) => translateCrop(crop, t)}
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
                `${formatCurrency(value)} (${formatWeight(item.payload.quantityKg, 'kg')})`,
                t('revenue.invoicedRevenue', 'Invoiced Revenue'),
              ]}
              labelFormatter={(label) => `${t('activities.crop', 'Crop')}: ${translateCrop(label, t)}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.crop}`}
                  fill={CROP_REVENUE_COLORS[index % CROP_REVENUE_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
