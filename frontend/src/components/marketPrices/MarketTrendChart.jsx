import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { translateCrop } from '../../utils/displayLabels';

export default function MarketTrendChart({
  history = [],
  crop = '',
  market = '',
  range = '5d',
  onRangeChange = null,
  isLoading = false,
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="agri-trend-chart-box" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
          {t('marketPrices.loadingHistory', 'Loading price history...')}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="agri-trend-chart-box" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          {t('marketPrices.noHistory', 'No historical price records available for this APMC and crop.')}
        </div>
      </div>
    );
  }

  // Calculate min and max for Y-axis domain padding
  const validPrices = history
    .flatMap((h) => [h.price, h.minPrice, h.maxPrice])
    .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);

  const minP = validPrices.length > 0 ? Math.floor(Math.min(...validPrices) * 0.95) : 0;
  const maxP = validPrices.length > 0 ? Math.ceil(Math.max(...validPrices) * 1.05) : 1000;

  const hasMinMax = history.some((h) => h.minPrice != null && h.maxPrice != null);

  return (
    <div className="agri-trend-chart-box">
      <div className="agri-trend-chart-box__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="agri-trend-chart-box__title">
          {range === '30d' ? t('marketPrices.range30d', '30-Day') : t('marketPrices.range5d', '5-Day')}{' '}
          {t('marketPrices.historicalPriceTrend', 'APMC Historical Price Trend')}
          {crop && market ? ` (${translateCrop(crop, t)} • ${market})` : ''}
        </span>

        {onRangeChange && (
          <div style={{ display: 'inline-flex', borderRadius: '6px', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
            <button
              type="button"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: range === '5d' ? 700 : 500,
                backgroundColor: range === '5d' ? 'var(--primary-600)' : '#ffffff',
                color: range === '5d' ? '#ffffff' : 'var(--slate-700)',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => onRangeChange('5d')}
            >
              {t('marketPrices.range5d', '5 Days')}
            </button>
            <button
              type="button"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: range === '30d' ? 700 : 500,
                backgroundColor: range === '30d' ? 'var(--primary-600)' : '#ffffff',
                color: range === '30d' ? '#ffffff' : 'var(--slate-700)',
                border: 'none',
                borderLeft: '1px solid var(--slate-200)',
                cursor: 'pointer',
              }}
              onClick={() => onRangeChange('30d')}
            >
              {t('marketPrices.range30d', '30 Days')}
            </button>
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 240, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={[minP, maxP]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
              width={65}
            />
            <Tooltip
              formatter={(value, name) => [
                `₹${value} / ${t('units.quintal', 'quintal')}`,
                name === 'price'
                  ? t('marketPrices.modalPrice', 'Modal Price')
                  : name === 'minPrice'
                  ? t('marketPrices.minPrice', 'Min Price')
                  : t('marketPrices.maxPrice', 'Max Price'),
              ]}
              labelFormatter={(label) => `${t('common.date', 'Date')}: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {hasMinMax && <Legend verticalAlign="top" height={28} iconSize={10} />}
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--primary-600)"
              strokeWidth={3}
              dot={{ r: 3, fill: 'var(--primary-600)', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: 'var(--primary-700)' }}
              name={t('marketPrices.modalPrice', 'Modal Price')}
            />
            {hasMinMax && (
              <Line
                type="monotone"
                dataKey="minPrice"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name={t('marketPrices.minPrice', 'Min Price')}
              />
            )}
            {hasMinMax && (
              <Line
                type="monotone"
                dataKey="maxPrice"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name={t('marketPrices.maxPrice', 'Max Price')}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
