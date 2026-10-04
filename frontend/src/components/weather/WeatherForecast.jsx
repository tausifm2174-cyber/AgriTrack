import { Sun, CloudSun, CloudRain, Cloud, Droplets, Umbrella, Calendar } from 'lucide-react';

/**
 * WeatherForecast component
 * Displays 7-day meteorological forecast cards with highs, lows, precipitation, and conditions.
 *
 * @param {Object} props
 * @param {Array} props.forecast - List of daily forecast objects
 */
export default function WeatherForecast({ forecast = [] }) {
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
    <section className="agri-weather-forecast-card" aria-label="7-Day Weather Forecast">
      <div className="agri-weather-forecast-card__header">
        <div className="agri-weather-forecast-card__title-group">
          <Calendar size={18} className="text-primary" aria-hidden="true" />
          <h2 className="agri-weather-forecast-card__title">7-Day Meteorological Forecast</h2>
        </div>
        <span className="agri-weather-forecast-card__sub">
          Daily high/low temperature & precipitation Outlook
        </span>
      </div>

      <div className="agri-weather-forecast-grid">
        {forecast.map((item, index) => (
          <div
            key={item.date || index}
            className={`agri-forecast-item ${item.day === 'Today' ? 'agri-forecast-item--today' : ''}`}
          >
            <div className="agri-forecast-item__day-group">
              <span className="agri-forecast-item__day">{item.day}</span>
              <span className="agri-forecast-item__date">{item.date}</span>
            </div>

            <div className="agri-forecast-item__icon-box" title={item.condition}>
              {renderConditionIcon(item.conditionCode)}
            </div>

            <span className="agri-forecast-item__condition">
              {item.condition}
            </span>

            <div className="agri-forecast-item__temp-row">
              <span className="agri-forecast-item__temp-high">{item.highTemp}°</span>
              <span className="agri-forecast-item__temp-sep">/</span>
              <span className="agri-forecast-item__temp-low">{item.lowTemp}°</span>
            </div>

            <div className="agri-forecast-item__meta-row">
              <span className="agri-forecast-item__rain" title="Precipitation chance">
                <Umbrella size={12} aria-hidden="true" />
                <span>{item.rainChance}</span>
              </span>
              <span className="agri-forecast-item__humid" title="Relative humidity">
                <Droplets size={12} aria-hidden="true" />
                <span>{item.humidity}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
