import { useTranslation } from 'react-i18next';
import { Sun, CloudSun, CloudRain, Cloud, Droplets, Umbrella, Calendar } from 'lucide-react';
import { translateWeatherCondition, translateTime } from '../../utils/displayLabels';

/**
 * WeatherForecast component
 * Displays 7-day meteorological forecast cards with highs, lows, precipitation, and conditions.
 */
export default function WeatherForecast({ forecast = [] }) {
  const { t } = useTranslation();

  const renderConditionIcon = (code) => {
    switch (code) {
      case 'sunny':
      case 'clear':
        return <Sun size={24} className="text-warning" aria-hidden="true" />;
      case 'rainy':
      case 'heavy-rain':
        return <CloudRain size={24} className="text-info" aria-hidden="true" />;
      case 'cloudy':
        return <Cloud size={24} className="text-slate-400" aria-hidden="true" />;
      default:
        return <CloudSun size={24} className="text-primary" aria-hidden="true" />;
    }
  };

  return (
    <section className="agri-weather-forecast-card" aria-label={t('weather.forecast', '7-Day Weather Forecast')}>
      <div className="agri-weather-forecast-card__header">
        <div className="agri-weather-forecast-card__title-group">
          <Calendar size={18} className="text-primary" aria-hidden="true" />
          <h2 className="agri-weather-forecast-card__title">{t('weather.sevenDayForecast', '7-Day Meteorological Forecast')}</h2>
        </div>
        <span className="agri-weather-forecast-card__sub">
          {t('weather.dailyOutlook', 'Daily high/low temperature & precipitation Outlook')}
        </span>
      </div>

      <div className="agri-weather-forecast-grid">
        {forecast.map((item, index) => {
          const displayDay = translateTime(item.day, t);
          return (
            <div
              key={item.date || index}
              className={`agri-forecast-item ${item.day === 'Today' ? 'agri-forecast-item--today' : ''}`}
            >
              <div className="agri-forecast-item__day-group">
                <span className="agri-forecast-item__day">{displayDay}</span>
                <span className="agri-forecast-item__date">{item.date}</span>
              </div>

              <div className="agri-forecast-item__icon-box" title={translateWeatherCondition(item.conditionCode || item.condition, t)}>
                {renderConditionIcon(item.conditionCode)}
              </div>

              <span className="agri-forecast-item__condition">
                {translateWeatherCondition(item.conditionCode || item.condition, t)}
              </span>

              <div className="agri-forecast-item__temp-row">
                <span className="agri-forecast-item__temp-high">{item.highTemp}°</span>
                <span className="agri-forecast-item__temp-sep">/</span>
                <span className="agri-forecast-item__temp-low">{item.lowTemp}°</span>
              </div>

              <div className="agri-forecast-item__meta-row">
                <span className="agri-forecast-item__rain" title={t('weather.rainChance', 'Precipitation chance')}>
                  <Umbrella size={12} aria-hidden="true" />
                  <span>{item.rainChance}</span>
                </span>
                <span className="agri-forecast-item__humid" title={t('weather.humidity', 'Relative humidity')}>
                  <Droplets size={12} aria-hidden="true" />
                  <span>{item.humidity}%</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
