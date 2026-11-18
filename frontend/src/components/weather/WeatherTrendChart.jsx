import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { translateTime } from '../../utils/displayLabels';

/**
 * Custom Tooltip for Weather Trend Chart
 */
function WeatherChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="agri-chart-tooltip">
        <p className="agri-chart-tooltip__title">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="agri-chart-tooltip__item">
            <span
              className="agri-chart-tooltip__dot"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <strong style={{ color: 'var(--slate-800)' }}>
              {entry.value}°C
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * WeatherTrendChart component
 * Visualizes 7-day high vs low temperature curve using Recharts.
 */
export default function WeatherTrendChart({ forecast = [] }) {
  const { t } = useTranslation();

  const chartData = forecast.map((f) => {
    const localizedDay = translateTime(f.day, t);
    return {
      name: `${localizedDay} (${f.date})`,
      day: localizedDay,
      'High Temp': f.highTemp,
      'Low Temp': f.lowTemp,
      rainMm: f.rainMm,
    };
  });

  return (
    <div className="agri-weather-trend-card">
      <div className="agri-weather-trend-card__header">
        <div className="agri-weather-trend-card__title-group">
          <TrendingUp size={18} className="text-primary" aria-hidden="true" />
          <h2 className="agri-weather-trend-card__title">{t('weather.temperatureTrend', 'Temperature & Thermal Trend')}</h2>
        </div>
        <span className="agri-weather-trend-card__sub">
          {t('weather.tempCurveSub', '7-Day Daytime High vs Nighttime Low Temperature Curve')}
        </span>
      </div>

      {chartData.length === 0 ? (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
          <p>{t('weather.noTrendData', 'No temperature trend data available.')}</p>
        </div>
      ) : (
        <div className="agri-weather-trend-card__chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                unit="°C"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<WeatherChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: '0.8rem' }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                name={t('weather.highTemp', 'High Temp')}
                dataKey="High Temp"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHigh)"
                dot={{ r: 4, fill: '#f59e0b' }}
              />
              <Area
                type="monotone"
                name={t('weather.lowTemp', 'Low Temp')}
                dataKey="Low Temp"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorLow)"
                dot={{ r: 4, fill: '#0284c7' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
